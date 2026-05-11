"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Thermometer, Layers, Coffee, Droplets, Snowflake } from "lucide-react";
import { RecipeSteps } from "@/components/recipe-steps";
import { BrewTimer } from "@/components/brew-timer";
import { RecommendationCard } from "@/components/recommendation-card";
import { getLastCalc } from "@/lib/storage";
import type { BrewCalculation } from "@/lib/types";

function RecipeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [calc, setCalc] = useState<BrewCalculation | null>(null);

  useEffect(() => {
    const saved = getLastCalc();
    if (saved) setCalc(saved);
  }, [searchParams]);

  if (!calc) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-5 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-600 flex items-center justify-center mx-auto">
          <Coffee size={28} className="text-ink-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-ink-200">ما فيه وصفة بعد</h2>
          <p className="text-ink-400 text-sm leading-relaxed max-w-xs mx-auto">
            اذهب للحاسبة، اختر الكميات والريشيو، ثم اضغط "عرض الوصفة"
          </p>
        </div>
        <button onClick={() => router.push("/")} className="btn-primary inline-flex items-center gap-2 mx-auto">
          <ArrowRight size={16} />
          الحاسبة
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2">
          <ArrowRight size={18} />
        </button>
        <div>
          <h1>وصفة التحضير</h1>
          <p className="text-ink-400 text-sm">
            {calc.coffee}غ قهوة · {calc.brewMode === "iced" ? `${calc.brewWater}مل + ${calc.iceWater}مل ثلج` : `${calc.water}مل ماء`}
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-3 text-center">
          <div className="text-accent-400 font-bold">{calc.coffee}غ</div>
          <div className="text-ink-400 text-xs">قهوة</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-sky-400 font-bold flex items-center justify-center gap-1">
            <Droplets size={13} />{calc.brewWater}مل
          </div>
          <div className="text-ink-400 text-xs">{calc.brewMode === "iced" ? "ماء التحضير" : "ماء"}</div>
        </div>
        {calc.brewMode === "iced" && (
          <div className="card p-3 text-center">
            <div className="text-cyan-400 font-bold flex items-center justify-center gap-1">
              <Snowflake size={13} />{calc.iceWater}مل
            </div>
            <div className="text-ink-400 text-xs">ثلج</div>
          </div>
        )}
        <div className="card p-3 text-center">
          <div className="text-ink-100 font-bold">{calc.totalBrewTime}</div>
          <div className="text-ink-400 text-xs">الوقت الكلي</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-ink-100 font-bold">1:{calc.ratio}</div>
          <div className="text-ink-400 text-xs">النسبة</div>
        </div>
      </div>

      {/* Recommendation */}
      {calc.recommendation && (
        <div className="space-y-3">
          <RecommendationCard rec={calc.recommendation} />
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 flex items-center gap-3">
              <Thermometer size={18} className="text-orange-400" />
              <div>
                <div className="text-ink-100 font-semibold">{calc.recommendation.waterTemp}</div>
                <div className="text-ink-400 text-xs">حرارة الماء</div>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <Layers size={18} className="text-sky-400" />
              <div>
                <div className="text-ink-100 font-semibold">{calc.recommendation.grindSize}</div>
                <div className="text-ink-400 text-xs">حجم الطحن</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer */}
      <div>
        <h2 className="text-sm font-semibold text-ink-200 uppercase tracking-wide mb-3">مؤقت التحضير</h2>
        <BrewTimer steps={calc.recipe} />
      </div>

      {/* Steps */}
      <div>
        <h2 className="text-sm font-semibold text-ink-200 uppercase tracking-wide mb-3">خطوات السكب</h2>
        <RecipeSteps steps={calc.recipe} />
      </div>

      {/* Iced note */}
      {calc.brewMode === "iced" && (
        <div className="bg-sky-950/30 border border-sky-800/30 rounded-xl p-4 flex items-start gap-3">
          <Snowflake size={18} className="text-sky-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sky-300 font-medium text-sm">تعليمات التحضير المثلج</p>
            <p className="text-sky-500/80 text-xs mt-1">
              ضع {calc.iceWater}مل من الثلج في كوب التقديم قبل التحضير.
              اسكب {calc.brewWater}مل من الماء مباشرة فوق الثلج.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecipePage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-ink-400">جاري التحميل…</div>
      </div>
    }>
      <RecipeContent />
    </Suspense>
  );
}
