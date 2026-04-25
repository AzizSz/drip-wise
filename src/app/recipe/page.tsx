"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Thermometer, Layers, Coffee, Droplets, Snowflake } from "lucide-react";
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
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4">
        <Coffee size={48} className="text-surface-600 mx-auto" />
        <h2 className="text-xl font-semibold text-ink-200">No recipe yet</h2>
        <p className="text-ink-400">Go to the calculator and calculate a brew to see your recipe here.</p>
        <button onClick={() => router.push("/")} className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Calculator
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Brew Recipe</h1>
          <p className="text-ink-400 text-sm">
            {calc.coffee}g coffee · {calc.brewMode === "iced" ? `${calc.brewWater}ml + ${calc.iceWater}ml ice` : `${calc.water}ml water`}
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-3 text-center">
          <div className="text-accent-400 font-bold">{calc.coffee}g</div>
          <div className="text-ink-400 text-xs">Coffee</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-sky-400 font-bold flex items-center justify-center gap-1">
            <Droplets size={13} />{calc.brewWater}ml
          </div>
          <div className="text-ink-400 text-xs">{calc.brewMode === "iced" ? "Brew water" : "Water"}</div>
        </div>
        {calc.brewMode === "iced" && (
          <div className="card p-3 text-center">
            <div className="text-cyan-400 font-bold flex items-center justify-center gap-1">
              <Snowflake size={13} />{calc.iceWater}ml
            </div>
            <div className="text-ink-400 text-xs">Ice</div>
          </div>
        )}
        <div className="card p-3 text-center">
          <div className="text-ink-100 font-bold">{calc.totalBrewTime}</div>
          <div className="text-ink-400 text-xs">Total time</div>
        </div>
        <div className="card p-3 text-center">
          <div className="text-ink-100 font-bold">1:{calc.ratio}</div>
          <div className="text-ink-400 text-xs">Ratio</div>
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
                <div className="text-ink-400 text-xs">Water temperature</div>
              </div>
            </div>
            <div className="card p-4 flex items-center gap-3">
              <Layers size={18} className="text-sky-400" />
              <div>
                <div className="text-ink-100 font-semibold">{calc.recommendation.grindSize}</div>
                <div className="text-ink-400 text-xs">Grind size</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer */}
      <div>
        <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wide mb-3">Brew Timer</h2>
        <BrewTimer steps={calc.recipe} />
      </div>

      {/* Steps */}
      <div>
        <h2 className="text-sm font-semibold text-ink-400 uppercase tracking-wide mb-3">Pour Steps</h2>
        <RecipeSteps steps={calc.recipe} />
      </div>

      {/* Iced note */}
      {calc.brewMode === "iced" && (
        <div className="bg-sky-950/30 border border-sky-800/30 rounded-xl p-4 flex items-start gap-3">
          <Snowflake size={18} className="text-sky-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sky-300 font-medium text-sm">Iced Brew Instructions</p>
            <p className="text-sky-500/80 text-xs mt-1">
              Place {calc.iceWater}ml of ice in your serving glass before brewing.
              Brew {calc.brewWater}ml of water directly onto the ice.
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
        <div className="text-ink-400">Loading recipe…</div>
      </div>
    }>
      <RecipeContent />
    </Suspense>
  );
}
