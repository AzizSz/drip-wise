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

// ─────────────────────────────────────────────────────────────
// PRESET RECIPES — exact Saudi roaster recipes (Black Knight, Sulalat)
// These override the calculated recipe when a known bean is selected
// ─────────────────────────────────────────────────────────────
interface PresetRecipe {
  coffee: number; water: number; temp: number;
  bloomMl: number; bloomWait: number;
  pours: number[]; // ml per pour after bloom
  pourIntervals: number[]; // seconds from brew start for each pour
  totalTime: string;
  icedRecipe?: {
    coffee: number; brewWater: number; ice: number; temp: number;
    pours: number[]; pourIntervals: number[]; totalTime: string;
  };
}

const PRESET_RECIPES: Record<string, PresetRecipe> = {
  // Source: Black Knight (الفارس الأسود) — Adham blend
  "adham-1": {
    coffee: 20, water: 300, temp: 90,
    bloomMl: 40, bloomWait: 35,
    pours: [80, 120, 60], // 40→120→240→300
    pourIntervals: [35, 75, 140],
    totalTime: "3:00",
    icedRecipe: {
      coffee: 23, brewWater: 160, ice: 170, temp: 89,
      pours: [50, 60], // 50→100→160
      pourIntervals: [30, 70],
      totalTime: "1:45",
    },
  },
  // Source: Black Knight — Chelchele Ethiopia Natural (similar to Sulalat data)
  "shilshili-1": {
    coffee: 20, water: 300, temp: 90,
    bloomMl: 50, bloomWait: 35,
    pours: [110, 90, 50], // 50→160→250→300
    pourIntervals: [35, 80, 140],
    totalTime: "2:45",
    icedRecipe: {
      coffee: 23, brewWater: 160, ice: 170, temp: 89,
      pours: [50, 60],
      pourIntervals: [30, 70],
      totalTime: "2:45", // Natural = slower even iced
    },
  },
  // Source: Black Knight — El Salvador Silver (Honey)
  "martin-1": {
    coffee: 20, water: 300, temp: 90,
    bloomMl: 50, bloomWait: 35,
    pours: [100, 100, 50], // 50→150→250→300
    pourIntervals: [35, 80, 140],
    totalTime: "3:00",
    icedRecipe: {
      coffee: 23, brewWater: 160, ice: 170, temp: 89,
      pours: [50, 60],
      pourIntervals: [30, 70],
      totalTime: "1:45",
    },
  },
};

// ─────────────────────────────────────────────────────────────
// BREW TIME CALCULATOR
// Based on: Saudi roaster data + Coffee ad Astra + SCA standards
// ─────────────────────────────────────────────────────────────
function getBrewTime(
  roast: string,
  processing: string,
  brewMode: BrewMode,
  waterAmount: number,
): string {
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (brewMode === "iced") {
    // Source: Black Knight recipes — Adham/Silver iced = 1:45, Chelchele iced = 2:45
    // Natural = more CO2 = slower drawdown even in iced mode
    if (processing === "Natural" || processing === "Anaerobic") {
      return `${fmt(150)} – ${fmt(165)}`; // 2:30–2:45
    }
    if (processing === "Honey") {
      return `${fmt(105)} – ${fmt(120)}`; // 1:45–2:00
    }
    return `${fmt(95)} – ${fmt(115)}`; // 1:35–1:55 default iced
  }

  // HOT brew base: Saudi market standard = 3:00 for Medium
  // Source: Black Knight Adham=3:00, Silver=3:00, Chelchele=2:45
  let baseMin = 155; // 2:35
  let baseMax = 185; // 3:05

  // ROAST effect on drawdown speed
  // Light = denser = slower; Dark = porous = faster
  if (roast === "Light")        { baseMin += 20; baseMax += 25; } // ~3:00–3:30
  if (roast === "Medium-Light") { baseMin += 10; baseMax += 15; } // ~2:45–3:20
  if (roast === "Medium")       { /* baseline ~2:35–3:05 */ }
  if (roast === "Medium-Dark")  { baseMin -= 10; baseMax -= 10; }
  if (roast === "Dark")         { baseMin -= 20; baseMax -= 20; }

  // PROCESSING effect
  if (processing === "Natural")    { baseMin -= 10; baseMax -= 10; }
  if (processing === "Anaerobic")  { baseMin -= 5;  baseMax -= 5; }
  if (processing === "Honey")      { /* same as baseline */ }
  if (processing === "Washed")     { baseMin += 5;  baseMax += 10; }
  if (processing === "Wet-Hulled") { baseMin -= 20; baseMax -= 15; }

  // BATCH SIZE
  if (waterAmount > 600)      { baseMin += 45; baseMax += 60; }
  else if (waterAmount > 400) { baseMin += 15; baseMax += 25; }
  else if (waterAmount < 200) { baseMin -= 10; baseMax -= 10; }

  baseMin = Math.min(Math.max(baseMin, 120), 270);
  baseMax = Math.min(Math.max(baseMax, 150), 300);
  return `${fmt(baseMin)} – ${fmt(baseMax)}`;
}

// ─────────────────────────────────────────────────────────────
// BEAN RECOMMENDATION ENGINE
// ─────────────────────────────────────────────────────────────
export function getBeanRecommendation(bean: BeanProfile): BrewRecommendation {
  const { roast, altitude, processing } = bean;
  let ratioNumber = 14;
  let tempMin = 90, tempMax = 92;
  let grindSize: BrewRecommendation["grindSize"] = "Medium-Fine";
  let bloomTime = 40;
  const tips: string[] = [];

  // ── ROAST ──
  if (roast === "Light")        { ratioNumber = 15; tempMin = 93; tempMax = 96; grindSize = "Medium-Fine"; bloomTime = 40; }
  if (roast === "Medium-Light") { ratioNumber = 15; tempMin = 91; tempMax = 93; grindSize = "Medium-Fine"; bloomTime = 40; }
  if (roast === "Medium")       { ratioNumber = 14; tempMin = 89; tempMax = 91; grindSize = "Medium"; bloomTime = 38; }
  if (roast === "Medium-Dark")  { ratioNumber = 13; tempMin = 88; tempMax = 90; grindSize = "Medium"; bloomTime = 35; }
  if (roast === "Dark") {
    ratioNumber = 13; tempMin = 86; tempMax = 89; grindSize = "Medium"; bloomTime = 33;
    tips.push("الماء الأبرد يمنع مرارة الحمص الغامق");
  }

  // ── PROCESSING ──
  if (processing === "Washed") {
    tempMin = Math.min(tempMin + 2, 96);
    tempMax = Math.min(tempMax + 2, 97);
    bloomTime = Math.max(bloomTime - 5, 30);
    tips.push("مغسول: حموضة نظيفة — زد الحرارة قليلاً لتبرزها");
  }
  if (processing === "Natural") {
    bloomTime = Math.min(bloomTime + 10, 50);
    ratioNumber = Math.min(ratioNumber + 1, 16);
    tips.push("طبيعي: bloom 45-50 ثانية — CO2 الزائد يحتاج وقتاً للخروج");
  }
  if (processing === "Honey") {
    tempMin = Math.max(tempMin - 1, 86);
    tempMax = Math.max(tempMax - 1, 88);
    bloomTime = Math.min(bloomTime + 3, 45);
    tips.push("عسلي: حلو ومتوازن — تجنب الإفراط في الاستخلاص");
  }
  if (processing === "Anaerobic") {
    bloomTime = Math.min(bloomTime + 12, 52);
    ratioNumber = Math.min(ratioNumber, 14);
    tempMin = Math.max(tempMin - 2, 86);
    tempMax = Math.max(tempMax - 1, 88);
    tips.push("لاهوائي: bloom أطول وحرارة منضبطة — تجنب الطعم المخمّر");
  }
  if (processing === "Wet-Hulled") {
    ratioNumber = Math.max(ratioNumber - 1, 12);
    tempMin = Math.max(tempMin - 3, 84);
    tempMax = Math.max(tempMax - 2, 87);
    grindSize = "Medium";
    bloomTime = Math.max(bloomTime - 8, 28);
    tips.push("مقشور رطب: جسم ثقيل — ريشيو أقل وحرارة أبرد للتوازن");
  }

  // ── ALTITUDE ──
  const altStr = altitude || "";
  const altNum = parseInt(altStr.replace(/[^0-9]/g, "").slice(0, 4) || "0");
  if (altNum >= 2000 || altStr === "2000m+") {
    tempMin = Math.min(tempMin + 2, 96);
    tempMax = Math.min(tempMax + 2, 97);
    tips.push("فوق 2000م: حبوب كثيفة جداً — زد الحرارة لاستخلاص كامل");
  } else if (altNum >= 1700 || altStr === "1700-2000m") {
    tempMin = Math.min(tempMin + 1, 95);
    tempMax = Math.min(tempMax + 1, 96);
    tips.push("1700-2000م: ارتفاع عالٍ — حرارة أعلى قليلاً");
  } else if ((altNum > 0 && altNum < 1000) || altStr === "Below 1000m") {
    tempMin = Math.max(tempMin - 1, 84);
    tempMax = Math.max(tempMax - 1, 86);
    tips.push("ارتفاع منخفض: حبوب أخف — تجنب الإفراط في الحرارة");
  }

  // ── BODY ──
  if (bean.body === "ممتلئ")      { ratioNumber = Math.max(ratioNumber - 1, 12); tips.push("قوام ممتلئ — قلل الماء للحفاظ على الجسم"); }
  if (bean.body === "كريمي")      { ratioNumber = Math.max(ratioNumber - 1, 12); bloomTime = Math.min(bloomTime + 3, 55); }
  if (bean.body === "خفيف")       { ratioNumber = Math.min(ratioNumber + 1, 17); tips.push("قوام خفيف — زد الماء لكوب منعش ونظيف"); }
  if (bean.body === "ناعم وعميق") { tempMin = Math.max(tempMin - 1, 84); tips.push("ناعم وعميق — حرارة أبرد تبرز النعومة"); }

  // ── VARIETY ──
  const variety = (bean.variety || "").toLowerCase();
  if (variety.includes("gesha") || variety.includes("geisha")) {
    ratioNumber = Math.min(ratioNumber + 1, 17);
    tips.push("Gesha: من أرق البنوز — ريشيو أعلى يبرز تعقيدها الزهري");
  }
  if (variety.includes("bourbon")) tips.push("Bourbon: حلاوة طبيعية — الريشيو المتوسط يبرزها");
  if (variety.includes("typica"))  tips.push("Typica: كلاسيكي ونظيف — يتسامح مع الريشيو المعتدل");

  // ── FLAVOR NOTES ──
  const hasFruityFloral = bean.flavorNotes?.some(n =>
    ["Berry","Cherry","Grape","Citrus","Floral","Jasmine","Rose","Hibiscus",
     "Strawberry","Peach","Mango","Tropical"].includes(n)
  );
  if (hasFruityFloral && (roast === "Light" || roast === "Medium-Light")) {
    tips.push("نكهات فاكهية وزهرية — صبات متعددة تبرزها بوضوح أكثر");
  }

  // ── CLAMP ──
  ratioNumber = Math.min(Math.max(ratioNumber, 12), 17);
  tempMin    = Math.min(Math.max(tempMin, 84), 97);
  tempMax    = Math.min(Math.max(tempMax, 86), 97);
  bloomTime  = Math.min(Math.max(bloomTime, 28), 55);

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

// ─────────────────────────────────────────────────────────────
// BREW RECIPE BUILDER
// ─────────────────────────────────────────────────────────────
export function buildBrewRecipe(
  coffee: number,
  water: number,
  brewMode: BrewMode,
  bloomTime: number,
  beanId?: string,
): BrewRecipeStep[] {
  const steps: BrewRecipeStep[] = [];
  let elapsed = 0;

  const preset = beanId ? PRESET_RECIPES[beanId] : null;

  if (preset) {
    const isIced = brewMode === "iced" && preset.icedRecipe;
    const src = isIced ? preset.icedRecipe! : preset;
    const scale = water / preset.water;
    const scaledBloom = Math.round((isIced ? 50 : preset.bloomMl) * scale);
    const scaledPours = src.pours.map(p => Math.round(p * scale));
    const waitTime    = isIced ? preset.icedRecipe!.pourIntervals[0] : preset.bloomWait;

    let cumulative = 0;
    cumulative += scaledBloom;
    steps.push({ step: 1, label: "Bloom", amount: scaledBloom,
      totalWater: cumulative, timestamp: "0:00", duration: waitTime });
    elapsed = waitTime;

    const pourLabels = ["السكبة الأولى", "السكبة الثانية", "السكبة الثالثة"];
    for (let i = 0; i < scaledPours.length; i++) {
      cumulative += scaledPours[i];
      steps.push({
        step: i + 2, label: pourLabels[i], amount: scaledPours[i],
        totalWater: Math.min(cumulative, isIced ? Math.round(water * 0.52) : water),
        timestamp: formatTimestamp(elapsed), duration: 40,
      });
      elapsed += 40;
    }
    return steps;
  }

  // ── CALCULATED recipe ──
  const effectiveBloomTime = brewMode === "iced" ? Math.max(bloomTime, 45) : bloomTime;
  const brewWater  = brewMode === "iced" ? Math.round(water * 0.52) : water;
  const bloomAmount = Math.round(coffee * 2.2);
  const remaining  = brewWater - bloomAmount;
  const pour1 = Math.round(remaining * 0.38);
  const pour2 = Math.round(remaining * 0.34);
  const pour3 = remaining - pour1 - pour2;

  let cumulative = 0;

  cumulative += bloomAmount;
  steps.push({ step: 1, label: "Bloom", amount: bloomAmount,
    totalWater: cumulative, timestamp: "0:00", duration: effectiveBloomTime });
  elapsed = effectiveBloomTime;

  cumulative += pour1;
  steps.push({ step: 2, label: "السكبة الأولى", amount: pour1,
    totalWater: cumulative, timestamp: formatTimestamp(elapsed), duration: 40 });
  elapsed += 40;

  cumulative += pour2;
  steps.push({ step: 3, label: "السكبة الثانية", amount: pour2,
    totalWater: cumulative, timestamp: formatTimestamp(elapsed), duration: 40 });
  elapsed += 40;

  cumulative += pour3;
  steps.push({ step: 4, label: "السكبة الثالثة", amount: pour3,
    totalWater: Math.min(cumulative, brewWater),
    timestamp: formatTimestamp(elapsed), duration: 35 });

  return steps;
}

// ─────────────────────────────────────────────────────────────
// MAIN CALCULATION BUILDER
// ─────────────────────────────────────────────────────────────
export function buildBrewCalculation(
  coffee: number,
  water: number,
  ratio: number,
  brewMode: BrewMode,
  bloomTime: number,
  recommendation?: BrewRecommendation,
  beanId?: string,
  beanProfile?: BeanProfile,
): BrewCalculation {
  const recipe = buildBrewRecipe(coffee, water, brewMode, bloomTime, beanId);
  const lastStep = recipe[recipe.length - 1];
  const totalSeconds = lastStep.timestamp
    .split(":").reduce((acc, t, i) => acc + (i === 0 ? +t * 60 : +t), 0)
    + lastStep.duration;

  const finalRec = recommendation && brewMode === "iced"
    ? { ...recommendation, waterTemp: "89°C", waterTempRange: [89, 89] as [number, number] }
    : recommendation;

  const brewTime = getBrewTime(
    beanProfile?.roast || "",
    beanProfile?.processing || "",
    brewMode,
    water,
  );

  return {
    coffee,
    water,
    ratio,
    brewMode,
    brewWater: brewMode === "iced" ? Math.round(water * 0.52) : water,
    iceWater:  brewMode === "iced" ? Math.round(water * 0.48) : undefined,
    recipe,
    bloomTime,
    totalBrewTime: beanId && PRESET_RECIPES[beanId]
      ? (brewMode === "iced" && PRESET_RECIPES[beanId].icedRecipe
          ? PRESET_RECIPES[beanId].icedRecipe!.totalTime
          : PRESET_RECIPES[beanId].totalTime)
      : brewTime,
    recommendation: finalRec,
  };
}
