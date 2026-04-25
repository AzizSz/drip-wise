"use client";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrewRecipeStep } from "@/lib/types";

interface Props {
  steps: BrewRecipeStep[];
  activeStep?: number;
}

const STEP_COLORS = [
  "text-sky-400 bg-sky-950/40 border-sky-700/40",
  "text-accent-400 bg-accent-950/40 border-accent-700/40",
  "text-violet-400 bg-violet-950/40 border-violet-700/40",
  "text-indigo-400 bg-indigo-950/40 border-indigo-700/40",
];

export function RecipeSteps({ steps, activeStep }: Props) {
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const colorClass = STEP_COLORS[i % STEP_COLORS.length];
        const isActive = activeStep === i;
        return (
          <div
            key={i}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all",
              isActive
                ? "bg-accent-500/8 border-accent-500/30"
                : "bg-surface-800/60 border-surface-600/40"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <div className={cn("w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0", colorClass)}>
                {step.step}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px h-4 bg-surface-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("font-semibold", isActive ? "text-accent-400" : "text-ink-100")}>
                  {step.label}
                </span>
                <span className="font-mono text-ink-400 text-sm shrink-0">
                  @ {step.timestamp}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sky-400 text-sm">
                  <Droplets size={13} />
                  <span className="font-medium">{step.amount} مل</span>
                </div>
                <span className="text-ink-500 text-xs">·</span>
                <span className="text-ink-400 text-xs">المجموع: {step.totalWater} مل</span>
                <span className="text-ink-500 text-xs">·</span>
                <span className="text-ink-400 text-xs">انتظار {step.duration}ث</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
