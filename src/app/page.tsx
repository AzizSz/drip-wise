"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Copy, Share2, ArrowLeft, Droplets, Coffee, BookmarkPlus, Check, Stethoscope, AlertTriangle, ClipboardList } from "lucide-react";
import { RatioSelector } from "@/components/ratio-selector";
import { BrewModeToggle } from "@/components/brew-mode-toggle";
import { BeanProfilePanel } from "@/components/bean-profile-panel";
import { RecommendationCard } from "@/components/recommendation-card";
import { WelcomeModal, QuickPresets } from "@/components/onboarding";
import type { BrewMode, RatioOption, BeanProfile } from "@/lib/types";
import {
  calcFromWater, calcFromCoffee, getBeanRecommendation, buildBrewCalculation,
} from "@/lib/calculator";
import { encodeShareUrl, saveLastCalc, saveBean, getSettings, saveBrewLog } from "@/lib/storage";
import { cn } from "@/lib/utils";

const RATIO_MAP: Record<Exclude<RatioOption, "custom">, number> = {
  "1:10": 10, "1:12": 12, "1:13": 13, "1:14": 14,
  "1:15": 15, "1:16": 16, "1:17": 17,
};

type Symptom = "مرّ" | "حامض جداً" | "خفيف/مويه" | "قوي جداً" | "عكر/مبهم" | "بلا نكهة" | "قابض/جافّ" | "حلو ومتوازن ✓";

const DIAGNOSES: Record<Symptom, { cause: string; fixes: string[]; color: string; bg: string; border: string }> = {
  "مرّ": {
    cause: "استخلاص زايد (Over-extraction)",
    fixes: ["خشّن الطحنة درجة", "قلل درجة الحرارة 1-2°C", "قصّر وقت التصفية", "جرب ريشيو أعلى (1:15 بدل 1:13)"],
    color: "text-red-400", bg: "bg-red-950/30", border: "border-red-800/40",
  },
  "حامض جداً": {
    cause: "استخلاص ناقص (Under-extraction)",
    fixes: ["نعّم الطحنة درجة", "ارفع درجة الحرارة 1-2°C", "طوّل وقت البلوم", "جرب ريشيو أقل (1:13 بدل 1:15)"],
    color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-800/40",
  },
  "خفيف/مويه": {
    cause: "القهوة ضعيفة — تركيز منخفض",
    fixes: ["زد كمية القهوة (جرب 1:13)", "نعّم الطحنة قليلاً", "تأكد من وزن القهوة بدقة"],
    color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-800/40",
  },
  "قوي جداً": {
    cause: "التركيز عالي",
    fixes: ["زد كمية الماء (جرب 1:16)", "خشّن الطحنة قليلاً"],
    color: "text-red-400", bg: "bg-red-950/30", border: "border-red-800/40",
  },
  "عكر/مبهم": {
    cause: "فاين زايد أو الفلتر ما انشطف",
    fixes: ["اشطف الفلتر قبل التحضير", "خشّن الطحنة", "تأكد الفلتر مضبوط في الـ V60"],
    color: "text-orange-400", bg: "bg-orange-950/30", border: "border-orange-800/40",
  },
  "بلا نكهة": {
    cause: "تحت-استخلاص أو قهوة قديمة",
    fixes: ["تحقق من تاريخ التحميص (أحسن خلال 2-4 أسابيع)", "نعّم الطحنة", "ارفع الحرارة"],
    color: "text-yellow-400", bg: "bg-yellow-950/30", border: "border-yellow-800/40",
  },
  "قابض/جافّ": {
    cause: "استخلاص زايد جداً أو حرارة عالية",
    fixes: ["خفّض الحرارة 2-3°C", "خشّن الطحنة", "قلل وقت التصفية"],
    color: "text-red-400", bg: "bg-red-950/30", border: "border-red-800/40",
  },
  "حلو ومتوازن ✓": {
    cause: "استخلاص مثالي! 🎉",
    fixes: ["سجّل وصفتك الحالية", "ما تحتاج تغيير شي"],
    color: "text-emerald-400", bg: "bg-emerald-950/30", border: "border-emerald-800/40",
  },
};

const SYMPTOMS = Object.keys(DIAGNOSES) as Symptom[];

const EMPTY_BEAN: BeanProfile = { origin: "", altitude: "", processing: "", roast: "", flavorNotes: [] };

export default function HomePage() {
  const router = useRouter();
  const [water, setWater] = useState<string>("300");
  const [coffee, setCoffee] = useState<string>("");
  const [lastEdited, setLastEdited] = useState<"water" | "coffee">("water");
  const [ratio, setRatio] = useState<RatioOption>("1:14");
  const [customRatio, setCustomRatio] = useState(14);
  const [brewMode, setBrewMode] = useState<BrewMode>("hot");
  const [bean, setBean] = useState<BeanProfile>(EMPTY_BEAN);
  const [copied, setCopied] = useState(false);
  const [beanSaved, setBeanSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [diagnosisOpen, setDiagnosisOpen] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [showExtraction, setShowExtraction] = useState(false);
  const [pouredWater, setPouredWater] = useState("");
  const [cupYield, setCupYield] = useState("");
  const [cupCheckResult, setCupCheckResult] = useState<null | "low" | "good" | "high">(null);
  const [logSaved, setLogSaved] = useState(false);

  const ratioNum = ratio === "custom" ? customRatio : RATIO_MAP[ratio];

  useEffect(() => {
    setMounted(true);
    const settings = getSettings();
    setRatio(settings.preferredRatio);
    setBrewMode(settings.defaultBrewMode);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (lastEdited === "water" && water) {
      const w = parseFloat(water);
      if (!isNaN(w) && w > 0) setCoffee(String(calcFromWater(w, ratioNum)));
    }
  }, [water, ratioNum, lastEdited, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (lastEdited === "coffee" && coffee) {
      const c = parseFloat(coffee);
      if (!isNaN(c) && c > 0) setWater(String(calcFromCoffee(c, ratioNum)));
    }
  }, [coffee, ratioNum, lastEdited, mounted]);

  const hasBeanData = !!(bean.origin || bean.roast || bean.processing);
  const recommendation = hasBeanData ? getBeanRecommendation(bean) : undefined;

  const bloomTime = recommendation?.bloomTime ?? 45;
  const coffeeNum = parseFloat(coffee) || 0;
  const waterNum = parseFloat(water) || 0;

  const calculation = coffeeNum > 0 && waterNum > 0
    ? buildBrewCalculation(coffeeNum, waterNum, ratioNum, brewMode, bloomTime, recommendation)
    : null;

  function handleCopy() {
    if (!calculation) return;
    const text = brewMode === "iced"
      ? `قهوة: ${calculation.coffee}غ | ماء التحضير: ${calculation.brewWater}مل | ثلج: ${calculation.iceWater}مل | نسبة 1:${ratioNum}`
      : `قهوة: ${calculation.coffee}غ | ماء: ${calculation.water}مل | نسبة 1:${ratioNum}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleShare() {
    if (!coffeeNum) return;
    const url = encodeShareUrl({ coffee: coffeeNum, water: waterNum, ratio: ratioNum, mode: brewMode, bean: hasBeanData ? bean : undefined });
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGoToRecipe() {
    if (!calculation) return;
    saveLastCalc(calculation);
    router.push("/recipe");
  }

  function handleSaveBean() {
    if (!hasBeanData) return;
    saveBean(bean);
    setBeanSaved(true);
    setTimeout(() => setBeanSaved(false), 2000);
  }

  function applyRecommendedRatio() {
    if (!recommendation) return;
    const r = `1:${recommendation.ratioNumber}` as RatioOption;
    if (r in RATIO_MAP) setRatio(r);
    else { setRatio("custom"); setCustomRatio(recommendation.ratioNumber); }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <WelcomeModal />
      <div>
        <h1 className="text-2xl font-bold text-ink-100">حاسبة V60</h1>
        <p className="text-ink-400 text-sm mt-0.5">أدخل كمية الماء أو القهوة للبدء</p>
        <p className="text-xs mt-2" style={{ color: "var(--ink-500)" }}>
          بنيت هذي الأداة عشاني أنا — وبعدين قررت أشاركها 🤙
        </p>
      </div>

      <BrewModeToggle value={brewMode} onChange={setBrewMode} />

      <QuickPresets water={water} setWater={setWater} setLastEdited={setLastEdited} />

      <div className="card p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ink-300 uppercase tracking-wide flex items-center gap-1.5">
              <Droplets size={12} className="text-sky-400" />
              الماء (مل)
            </label>
            <input
              type="number"
              value={water}
              onChange={(e) => { setWater(e.target.value); setLastEdited("water"); }}
              className="input-field text-lg font-bold text-sky-300"
              placeholder="300"
              min={0}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ink-300 uppercase tracking-wide flex items-center gap-1.5">
              <Coffee size={12} className="text-accent-500" />
              القهوة (غ)
            </label>
            <input
              type="number"
              value={coffee}
              onChange={(e) => { setCoffee(e.target.value); setLastEdited("coffee"); }}
              className="input-field text-lg font-bold text-accent-400"
              placeholder="21.4"
              min={0}
            />
          </div>
        </div>

        {brewMode === "iced" && waterNum > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sky-950/30 border border-sky-800/30 rounded-xl p-3 text-center">
                <div className="text-sky-300 font-bold text-xl">{Math.round(waterNum * 0.5)} مل</div>
                <div className="text-sky-600 text-xs mt-0.5">ماء التحضير (50%)</div>
              </div>
              <div className="bg-cyan-950/30 border border-cyan-800/30 rounded-xl p-3 text-center">
                <div className="text-cyan-300 font-bold text-xl">{Math.round(waterNum * 0.5)} مل</div>
                <div className="text-cyan-700 text-xs mt-0.5">ثلج (50%)</div>
              </div>
            </div>
            <p className="text-xs text-ink-400 text-center leading-relaxed">
              الطحنة: أنعم درجة من الحار · وقت البلوم: 45-50 ث · الثلج يعوّض التبريد فوراً
            </p>
          </>
        )}
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-ink-300 uppercase tracking-wide">نسبة القهوة إلى الماء</h2>
        <RatioSelector
          value={ratio}
          customValue={customRatio}
          onChange={setRatio}
          onCustomChange={setCustomRatio}
        />
      </div>

      <BeanProfilePanel value={bean} onChange={setBean} />

      {recommendation && (
        <div className="space-y-3">
          <RecommendationCard rec={recommendation} />
          <button onClick={applyRecommendedRatio} className="w-full btn-secondary text-sm">
            تطبيق النسبة الموصى بها ({recommendation.ratio})
          </button>
        </div>
      )}

      {calculation && (
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink-100">تحضيرك</h2>
            <span className="text-xs bg-surface-700 text-ink-400 rounded-full px-2 py-1">
              نسبة 1:{ratioNum}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-900/80 rounded-xl p-3 text-center">
              <div className="text-accent-400 font-bold text-xl">{calculation.coffee}غ</div>
              <div className="text-ink-400 text-xs mt-0.5">قهوة</div>
            </div>
            <div className="bg-surface-900/80 rounded-xl p-3 text-center">
              <div className="text-sky-400 font-bold text-xl">{calculation.brewWater}مل</div>
              <div className="text-ink-400 text-xs mt-0.5">{brewMode === "iced" ? "ماء التحضير" : "ماء"}</div>
            </div>
            {brewMode === "iced" ? (
              <div className="bg-surface-900/80 rounded-xl p-3 text-center">
                <div className="text-cyan-400 font-bold text-xl">{calculation.iceWater}مل</div>
                <div className="text-ink-400 text-xs mt-0.5">ثلج</div>
              </div>
            ) : (
              <div className="bg-surface-900/80 rounded-xl p-3 text-center">
                <div className="text-ink-200 font-bold text-xl">{calculation.totalBrewTime}</div>
                <div className="text-ink-400 text-xs mt-0.5">وقت التحضير</div>
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={handleGoToRecipe} className="btn-primary flex items-center gap-2 flex-1">
              <Coffee size={16} />
              عرض الوصفة
              <ArrowLeft size={14} />
            </button>
            <button onClick={handleCopy} className="btn-secondary flex items-center gap-2">
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              {copied ? "تم النسخ!" : "نسخ"}
            </button>
            <button onClick={handleShare} className="btn-ghost flex items-center gap-2">
              <Share2 size={16} />
            </button>
          </div>

          {hasBeanData && (
            <button
              onClick={handleSaveBean}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm text-ink-400 hover:text-ink-100 border border-surface-600 hover:border-accent-500/50 rounded-xl transition-all"
            >
              {beanSaved ? <Check size={15} className="text-emerald-400" /> : <BookmarkPlus size={15} />}
              {beanSaved ? "تم حفظ الحبة!" : "حفظ ملف الحبة"}
            </button>
          )}
          <button
            onClick={() => {
              saveBrewLog({
                coffee: coffeeNum,
                water: waterNum,
                ratio: ratioNum,
                brewMode,
                beanName: bean.name || undefined,
                beanOrigin: bean.origin || undefined,
                beanProcessing: bean.processing || undefined,
                beanRoast: bean.roast || undefined,
              });
              setLogSaved(true);
              setTimeout(() => setLogSaved(false), 2000);
            }}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-ink-400 hover:text-ink-100 border border-surface-600 hover:border-accent-500/50 rounded-xl transition-all"
          >
            {logSaved ? <Check size={15} className="text-emerald-400" /> : <ClipboardList size={15} />}
            {logSaved ? "تم الحفظ ✓" : "سجّل هذي الوصفة"}
          </button>
        </div>
      )}
      <div className="card-premium overflow-hidden">
        <button
          onClick={() => setDiagnosisOpen(!diagnosisOpen)}
          className="w-full flex items-center justify-between p-5 hover:bg-surface-700/30 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center">
              <Stethoscope size={15} className="text-rose-400" />
            </div>
            <div>
              <p className="font-semibold text-ink-100">شخّص كوبك</p>
              <p className="text-xs text-ink-400">اختر الأعراض وعرف وش المشكلة</p>
            </div>
          </div>
          <span className="text-ink-400 text-lg">{diagnosisOpen ? "▲" : "▼"}</span>
        </button>

        {diagnosisOpen && (
          <div className="px-5 pb-5 space-y-4 border-t border-surface-600/50">
            <div className="pt-4 flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => {
                const active = selectedSymptoms.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSymptoms((prev) =>
                      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                    )}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      active
                        ? s === "حلو ومتوازن ✓"
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                          : "bg-rose-950/60 text-rose-300 border-rose-700/60"
                        : "bg-surface-800 text-ink-300 border-surface-600 hover:border-rose-700/40"
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {selectedSymptoms.length > 0 && (
              <div className="space-y-3">
                {selectedSymptoms.map((s) => {
                  const d = DIAGNOSES[s];
                  return (
                    <div key={s} className={`rounded-xl border p-4 space-y-2 ${d.bg} ${d.border}`}>
                      <div>
                        <p className={`text-sm font-semibold ${d.color}`}>{s}</p>
                        <p className="text-xs text-ink-400 mt-0.5">{d.cause}</p>
                      </div>
                      <ol className="space-y-1">
                        {d.fixes.map((fix, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-ink-200">
                            <span className={`shrink-0 font-bold ${d.color}`}>{i + 1}.</span>
                            {fix}
                          </li>
                        ))}
                      </ol>
                    </div>
                  );
                })}
                <button
                  onClick={() => setSelectedSymptoms([])}
                  className="text-xs text-ink-500 hover:text-ink-300 underline transition-colors"
                >
                  مسح الاختيارات
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {calculation && (
        <div className="card-premium overflow-hidden">
          <button
            onClick={() => { setShowExtraction(!showExtraction); setCupCheckResult(null); }}
            className="w-full flex items-center justify-between p-5 hover:bg-surface-700/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-800/40 flex items-center justify-center">
                <Droplets size={15} className="text-sky-400" />
              </div>
              <div>
                <p className="font-semibold text-ink-100">كيف طلعت قهوتك؟</p>
                <p className="text-xs text-ink-400">قيّم الاستخلاص بناءً على ما طلع في الكوب</p>
              </div>
            </div>
            <span className="text-ink-400 text-lg">{showExtraction ? "▲" : "▼"}</span>
          </button>

          {showExtraction && (
            <div className="px-5 pb-5 space-y-4 border-t border-surface-600/50">
              <div className="pt-4 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-300 uppercase tracking-wide">الماء اللي صببته (مل)</label>
                  <input
                    type="number"
                    value={pouredWater || String(waterNum)}
                    onChange={(e) => setPouredWater(e.target.value)}
                    className="input-field text-sm"
                    min={0}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-300 uppercase tracking-wide">طلع في الكوب (مل)</label>
                  <input
                    type="number"
                    value={cupYield}
                    onChange={(e) => setCupYield(e.target.value)}
                    placeholder="مثال: 240"
                    className="input-field text-sm"
                    min={0}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const pw = parseFloat(pouredWater || String(waterNum));
                  const cy = parseFloat(cupYield);
                  if (!pw || !cy) return;
                  const pct = (cy / pw) * 100;
                  if (pct < 72) setCupCheckResult("low");
                  else if (pct <= 88) setCupCheckResult("good");
                  else setCupCheckResult("high");
                }}
                className="btn-primary w-full text-sm"
              >
                تحقق
              </button>

              {cupCheckResult && (
                <div className="animate-slide-up space-y-3 pt-1">
                  {cupCheckResult === "low" && (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800/40 flex items-center justify-center">
                        <span className="text-red-400 text-2xl font-bold">✕</span>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-red-400">الاستخلاص ناقص</p>
                        <p className="text-xs text-ink-400 mt-1">القهوة امتصت ماء كثير — غالباً الطحنة ناعمة جداً</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["خشّن الطحنة", "ارفع الحرارة قليلاً", "اصب أبطأ"].map((p) => (
                          <span key={p} className="text-xs bg-surface-700 text-ink-200 px-3 py-1 rounded-full border border-surface-600">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {cupCheckResult === "good" && (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
                        <Check size={28} className="text-emerald-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-emerald-400">استخلاص ممتاز ✓</p>
                        <p className="text-xs text-ink-400 mt-1">قهوتك في النطاق المثالي — استمر على نفس الإعدادات</p>
                      </div>
                    </div>
                  )}

                  {cupCheckResult === "high" && (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-800/40 flex items-center justify-center">
                        <AlertTriangle size={28} className="text-amber-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-amber-400">الاستخلاص زايد</p>
                        <p className="text-xs text-ink-400 mt-1">ماء كثير طلع بسرعة — غالباً الطحنة خشنة</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["نعّم الطحنة", "قلل الحرارة قليلاً", "اصب أهدأ"].map((p) => (
                          <span key={p} className="text-xs bg-surface-700 text-ink-200 px-3 py-1 rounded-full border border-surface-600">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
