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
  let tempMin = 91, tempMax = 93;
  let grindSize: BrewRecommendation["grindSize"] = "Medium-Fine";
  let bloomTime = 45;
  const tips: string[] = [];

  if (roast === "Light")        { ratioNumber = 15; tempMin = 93; tempMax = 96; grindSize = "Medium-Fine"; }
  if (roast === "Medium-Light") { ratioNumber = 15; tempMin = 92; tempMax = 94; grindSize = "Medium-Fine"; }
  if (roast === "Medium")       { ratioNumber = 14; tempMin = 91; tempMax = 93; grindSize = "Medium"; }
  if (roast === "Medium-Dark")  { ratioNumber = 13; tempMin = 89; tempMax = 92; grindSize = "Medium"; }
  if (roast === "Dark") {
    ratioNumber = 13; tempMin = 88; tempMax = 91; grindSize = "Medium";
    tips.push("الماء الأبرد يمنع مرارة الحمص الغامق");
  }

  if (processing === "Washed") {
    tempMin = Math.min(tempMin + 1, 96); tempMax = Math.min(tempMax + 1, 97); bloomTime = 35;
    tips.push("مغسول: حموضة نظيفة — زد الحرارة قليلاً لتبرزها");
  }
  if (processing === "Natural") {
    bloomTime = 50; ratioNumber = Math.min(ratioNumber + 1, 16);
    tips.push("طبيعي: bloom 45-50 ثانية بسبب CO2 الزائد — تجنب الاستخلاص المفرط");
  }
  if (processing === "Honey") {
    tempMin = Math.max(tempMin - 1, 88); tempMax = Math.max(tempMax - 1, 93); bloomTime = 42;
    tips.push("عسلي: حلو ومتوازن — تجنب الإفراط في الاستخلاص");
  }
  if (processing === "Anaerobic") {
    bloomTime = 50; ratioNumber = Math.min(ratioNumber, 14);
    tempMin = Math.max(tempMin - 1, 88); tempMax = Math.max(tempMax - 1, 92);
    tips.push("لاهوائي: bloom طويل وحرارة منضبطة لتجنب الطعم المخمّر");
  }
  if (processing === "Wet-Hulled") {
    ratioNumber = Math.max(ratioNumber - 1, 12);
    tempMin = Math.max(tempMin - 2, 86); tempMax = Math.max(tempMax - 2, 90);
    grindSize = "Medium"; bloomTime = 32;
    tips.push("مقشور رطب: جسم ثقيل — ريشيو أقل وحرارة أبرد للتوازن");
  }

  if (altitude === "2000m+") {
    tempMin = Math.min(tempMin + 2, 97); tempMax = Math.min(tempMax + 2, 97);
    tips.push("فوق 2000م: حبوب كثيفة جداً — زد الحرارة لاستخلاص كامل");
  }
  if (altitude === "1700-2000m") {
    tempMin = Math.min(tempMin + 1, 96); tempMax = Math.min(tempMax + 1, 97);
    tips.push("1700-2000م: ارتفاع عالٍ — حرارة أعلى قليلاً للكثافة");
  }
  if (altitude === "Below 1000m") {
    tempMin = Math.max(tempMin - 1, 88); tempMax = Math.max(tempMax - 1, 90);
    tips.push("ارتفاع منخفض: حبوب أقل كثافة — تجنب الإفراط في الحرارة");
  }

  if (bean.body === "ممتلئ")      { ratioNumber = Math.max(ratioNumber - 1, 12); tips.push("قوام ممتلئ — قلل الماء للحفاظ على الجسم"); }
  if (bean.body === "كريمي")      { ratioNumber = Math.max(ratioNumber - 1, 12); bloomTime = Math.min(bloomTime + 3, 55); }
  if (bean.body === "خفيف")       { ratioNumber = Math.min(ratioNumber + 1, 17); tips.push("قوام خفيف — زد الماء لكوب منعش ونظيف"); }
  if (bean.body === "ناعم وعميق") { tempMin = Math.max(tempMin - 1, 88); tips.push("ناعم وعميق — حرارة أبرد قليلاً تبرز النعومة"); }

  const variety = (bean.variety || "").toLowerCase();
  if (variety.includes("gesha") || variety.includes("geisha")) {
    ratioNumber = Math.min(ratioNumber + 1, 17);
    tips.push("Gesha: من أرق البنوز — ريشيو أعلى يبرز تعقيدها الزهري");
  }
  if (variety.includes("bourbon")) tips.push("Bourbon: حلاوة طبيعية — الريشيو المتوسط يبرزها");
  if (variety.includes("typica"))  tips.push("Typica: كلاسيكي ونظيف — يتسامح مع الريشيو المعتدل");

  ratioNumber = Math.min(Math.max(ratioNumber, 12), 17);
  tempMin = Math.min(Math.max(tempMin, 86), 97);
  tempMax = Math.min(Math.max(tempMax, 88), 97);
  bloomTime = Math.min(Math.max(bloomTime, 30), 55);

  const flavorTip = tips.slice(0, 2).join(" · ") || "ضبط الطحنة والريشيو يعطيك أفضل استخلاص";

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
  const effectiveBloomTime = brewMode === "iced" ? Math.max(bloomTime, 48) : bloomTime;
  const brewWater = brewMode === "iced" ? water * 0.5 : water;
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
    duration: effectiveBloomTime,
  });
  elapsed += effectiveBloomTime;

  // Three pours
  const pourLabels = ["السكبة الأولى", "السكبة الثانية", "السكبة الثالثة"];
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

  const finalRec = recommendation && brewMode === "iced"
    ? { ...recommendation, waterTemp: "88–93°C", waterTempRange: [88, 93] as [number, number] }
    : recommendation;

  return {
    coffee,
    water,
    ratio,
    brewMode,
    brewWater: brewMode === "iced" ? Math.round(water * 0.5) : water,
    iceWater: brewMode === "iced" ? Math.round(water * 0.5) : undefined,
    recipe,
    bloomTime,
    totalBrewTime: formatTimestamp(totalSeconds),
    recommendation: finalRec,
  };
}
