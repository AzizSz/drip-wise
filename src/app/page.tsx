"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Copy, Share2, ArrowLeft, Droplets, Coffee, BookmarkPlus, Check } from "lucide-react";
import { RatioSelector } from "@/components/ratio-selector";
import { BrewModeToggle } from "@/components/brew-mode-toggle";
import { BeanProfilePanel } from "@/components/bean-profile-panel";
import { RecommendationCard } from "@/components/recommendation-card";
import type { BrewMode, RatioOption, BeanProfile } from "@/lib/types";
import {
  calcFromWater, calcFromCoffee, getBeanRecommendation, buildBrewCalculation,
} from "@/lib/calculator";
import { encodeShareUrl, saveLastCalc, saveBean, getSettings } from "@/lib/storage";

const RATIO_MAP: Record<Exclude<RatioOption, "custom">, number> = {
  "1:10": 10, "1:12": 12, "1:13": 13, "1:14": 14,
  "1:15": 15, "1:16": 16, "1:17": 17,
};

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
      <div>
        <h1 className="text-2xl font-bold text-ink-100">حاسبة V60</h1>
        <p className="text-ink-400 text-sm mt-0.5">أدخل كمية الماء أو القهوة للبدء</p>
        <p className="text-xs mt-2" style={{ color: "var(--ink-500)" }}>
          بنيت هذي الأداة عشاني أنا — وبعدين قررت أشاركها 🤙
        </p>
      </div>

      <BrewModeToggle value={brewMode} onChange={setBrewMode} />

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
        </div>
      )}
    </div>
  );
}
