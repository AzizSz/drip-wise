import type {
  BeanProfile, BrewCalculation, BrewMode, BrewRecipeStep, BrewRecommendation,
} from "./types";

export function calcFromWater(water: number, ratio: number): number {
  return Math.round((water / ratio) * 10) / 10;
}

export function calcFromCoffee(coffee: number, ratio: number): number {
  return Math.round(coffee * ratio * 10) / 10;
}

export function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function getBeanRecommendation(bean: BeanProfile): BrewRecommendation {
  const { roast, altitude, processing } = bean;
  let ratioNumber = 14;
  let tempMin = 91;
  let tempMax = 93;
  let grindSize: BrewRecommendation["grindSize"] = "Medium-Fine";
  let bloomTime = 45;
  let flavorTip = "";

  // Roast-based baseline
  if (roast === "Light") {
    ratioNumber = 15;
    tempMin = 93; tempMax = 96;
    grindSize = "Medium-Fine";
    flavorTip = "Light roasts shine with higher water ratios and hotter water to unlock complex brightness.";
  } else if (roast === "Medium-Light") {
    ratioNumber = 15;
    tempMin = 92; tempMax = 94;
    grindSize = "Medium-Fine";
    flavorTip = "A balanced approach — lean slightly hotter to draw out the delicate sweetness.";
  } else if (roast === "Medium") {
    ratioNumber = 14;
    tempMin = 91; tempMax = 93;
    grindSize = "Medium";
    flavorTip = "Medium roasts are forgiving. Focus on even pours to highlight balanced sweetness and body.";
  } else if (roast === "Medium-Dark") {
    ratioNumber = 13;
    tempMin = 89; tempMax = 92;
    grindSize = "Medium";
    flavorTip = "Slightly cooler water prevents bitterness while preserving rich body and chocolate notes.";
  } else if (roast === "Dark") {
    ratioNumber = 13;
    tempMin = 88; tempMax = 91;
    grindSize = "Medium";
    flavorTip = "Cooler water and a lower ratio tame harshness and bring out dark chocolate and caramel sweetness.";
  }

  // Altitude adjustment
  if (altitude === "2000m+" || altitude === "1700-2000m") {
    // Dense beans — benefit from slightly hotter water
    tempMin = Math.min(tempMin + 1, 96);
    tempMax = Math.min(tempMax + 1, 97);
    if (roast === "Light" || roast === "Medium-Light") {
      ratioNumber = Math.min(ratioNumber + 1, 16);
      flavorTip = "High-altitude beans are dense with vibrant acidity — go higher ratio and slightly hotter for full extraction.";
    }
  } else if (altitude === "Below 1000m") {
    // Less dense, lower altitude — be careful not to over-extract
    tempMin = Math.max(tempMin - 1, 88);
    tempMax = Math.max(tempMax - 1, 90);
  }

  // Processing adjustment
  if (processing === "Natural") {
    bloomTime = 50;
    if (roast === "Light" || roast === "Medium-Light") {
      flavorTip = "Natural process creates fruity, wine-like complexity. Extended bloom releases trapped CO2 for even extraction.";
    }
  } else if (processing === "Anaerobic") {
    bloomTime = 50;
    ratioNumber = Math.min(ratioNumber, 14);
    tempMin = Math.max(tempMin - 1, 88);
    tempMax = Math.max(tempMax - 1, 92);
    flavorTip = "Anaerobic fermentation creates intense, layered flavors. Careful temperature control prevents over-extraction of wild notes.";
  } else if (processing === "Honey") {
    ratioNumber = Math.min(ratioNumber, 15);
    flavorTip = "Honey process balances clean clarity with natural sweetness — a medium ratio lets both aspects shine.";
  } else if (processing === "Wet-Hulled") {
    tempMin = Math.max(tempMin - 1, 88);
    tempMax = Math.max(tempMax - 1, 91);
    grindSize = "Medium";
    flavorTip = "Wet-hulled processing creates earthy, syrupy body. Slightly cooler water avoids muddying the cup.";
  }

  return {
    ratio: `1:${ratioNumber}`,
    ratioNumber,
    waterTemp: `${tempMin}–${tempMax}°C`,
    waterTempRange: [tempMin, tempMax],
    grindSize,
    bloomTime,
    flavorTip,
  };
}

export function buildBrewRecipe(
  coffee: number,
  water: number,
  brewMode: BrewMode,
  bloomTime: number,
): BrewRecipeStep[] {
  const brewWater = brewMode === "iced" ? water * 0.6 : water;
  const bloomAmount = Math.round(coffee * 2);
  const remaining = brewWater - bloomAmount;
  const pourAmount = Math.round(remaining / 3);

  const steps: BrewRecipeStep[] = [];
  let elapsed = 0;

  // Bloom
  steps.push({
    step: 1,
    label: "Bloom",
    amount: bloomAmount,
    totalWater: bloomAmount,
    timestamp: formatTimestamp(elapsed),
    duration: bloomTime,
  });
  elapsed += bloomTime;

  // Three pours
  const pourLabels = ["1st Pour", "2nd Pour", "3rd Pour"];
  let cumulativeWater = bloomAmount;
  for (let i = 0; i < 3; i++) {
    const amt = i < 2 ? pourAmount : brewWater - bloomAmount - pourAmount * 2;
    cumulativeWater += amt;
    steps.push({
      step: i + 2,
      label: pourLabels[i],
      amount: amt,
      totalWater: cumulativeWater,
      timestamp: formatTimestamp(elapsed),
      duration: 45,
    });
    elapsed += 45;
  }

  return steps;
}

export function buildBrewCalculation(
  coffee: number,
  water: number,
  ratio: number,
  brewMode: BrewMode,
  bloomTime: number,
  recommendation?: BrewRecommendation,
): BrewCalculation {
  const recipe = buildBrewRecipe(coffee, water, brewMode, bloomTime);
  const lastStep = recipe[recipe.length - 1];
  const totalSeconds = lastStep.timestamp
    .split(":")
    .reduce((acc, t, i) => acc + (i === 0 ? +t * 60 : +t), 0) + lastStep.duration;

  return {
    coffee,
    water,
    ratio,
    brewMode,
    brewWater: brewMode === "iced" ? Math.round(water * 0.6) : water,
    iceWater: brewMode === "iced" ? Math.round(water * 0.4) : undefined,
    recipe,
    bloomTime,
    totalBrewTime: formatTimestamp(totalSeconds),
    recommendation,
  };
}
