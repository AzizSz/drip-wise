"use client";
import { Thermometer, Layers, Clock, Lightbulb } from "lucide-react";
import type { BrewRecommendation } from "@/lib/types";

interface Props {
  rec: BrewRecommendation;
}

export function RecommendationCard({ rec }: Props) {
  return (
    <div className="recommendation-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center">
          <span className="text-accent-400 text-xs">✦</span>
        </div>
        <h3 className="font-semibold text-accent-400 text-sm tracking-wide uppercase">Smart Recommendation</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-900/80 rounded-xl p-3 space-y-1 text-center">
          <div className="text-accent-500 font-bold text-lg">{rec.ratio}</div>
          <div className="text-ink-400 text-xs">Ratio</div>
        </div>
        <div className="bg-surface-900/80 rounded-xl p-3 space-y-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <Thermometer size={14} className="text-orange-400" />
            <span className="text-ink-100 font-bold text-sm">{rec.waterTemp}</span>
          </div>
          <div className="text-ink-400 text-xs">Water Temp</div>
        </div>
        <div className="bg-surface-900/80 rounded-xl p-3 space-y-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <Layers size={14} className="text-sky-400" />
            <span className="text-ink-100 font-bold text-sm">{rec.grindSize}</span>
          </div>
          <div className="text-ink-400 text-xs">Grind</div>
        </div>
        <div className="bg-surface-900/80 rounded-xl p-3 space-y-1 text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock size={14} className="text-emerald-400" />
            <span className="text-ink-100 font-bold text-sm">{rec.bloomTime}s</span>
          </div>
          <div className="text-ink-400 text-xs">Bloom</div>
        </div>
      </div>

      <div className="flex gap-3 bg-accent-500/5 border border-accent-500/20 rounded-xl p-3">
        <Lightbulb size={16} className="text-accent-400 shrink-0 mt-0.5" />
        <p className="text-ink-200 text-sm leading-relaxed">{rec.flavorTip}</p>
      </div>
    </div>
  );
}
