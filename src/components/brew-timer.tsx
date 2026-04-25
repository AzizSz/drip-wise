"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrewRecipeStep } from "@/lib/types";
import { formatTimestamp } from "@/lib/calculator";

interface Props {
  steps: BrewRecipeStep[];
}

export function BrewTimer({ steps }: Props) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalDuration = steps.reduce((acc, s) => acc + s.duration, 0);

  const stepStartTimes = steps.map((_, i) =>
    steps.slice(0, i).reduce((acc, s) => acc + s.duration, 0)
  );

  const activeStepIndex = stepStartTimes.findLastIndex((t) => elapsed >= t);

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e >= totalDuration) { setRunning(false); return totalDuration; }
          return e + 1;
        });
      }, 1000);
    } else {
      clear();
    }
    return clear;
  }, [running, totalDuration, clear]);

  function reset() {
    setRunning(false);
    setElapsed(0);
    clear();
  }

  function skipStep() {
    const next = Math.min(activeStepIndex + 1, steps.length - 1);
    setElapsed(stepStartTimes[next]);
  }

  const stepElapsed = elapsed - stepStartTimes[activeStepIndex];
  const stepDuration = steps[activeStepIndex]?.duration ?? 1;
  const stepProgress = Math.min(stepElapsed / stepDuration, 1);

  return (
    <div className="card p-5 space-y-4">
      {/* Main clock */}
      <div className="text-center">
        <div className="text-5xl font-mono font-bold text-ink-100 tabular-nums">
          {formatTimestamp(elapsed)}
        </div>
        <div className="text-ink-400 text-sm mt-1">
          {elapsed >= totalDuration
            ? "Brew complete! ☕"
            : `Step ${activeStepIndex + 1} of ${steps.length}: ${steps[activeStepIndex]?.label}`}
        </div>
      </div>

      {/* Step progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-ink-400">
          <span>Step progress</span>
          <span>{Math.round(stepProgress * 100)}%</span>
        </div>
        <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-500 rounded-full transition-all duration-1000"
            style={{ width: `${stepProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Overall progress */}
      <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-700 to-accent-400 rounded-full transition-all duration-1000"
          style={{ width: `${(elapsed / totalDuration) * 100}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center hover:bg-surface-600 transition-all"
          title="Reset"
        >
          <RotateCcw size={16} className="text-ink-300" />
        </button>

        <button
          onClick={() => setRunning(!running)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg",
            running
              ? "bg-surface-600 hover:bg-surface-500"
              : "bg-accent-500 hover:bg-accent-400"
          )}
        >
          {running
            ? <Pause size={22} className="text-white" />
            : <Play size={22} className="text-white ml-0.5" />
          }
        </button>

        <button
          onClick={skipStep}
          disabled={activeStepIndex >= steps.length - 1}
          className="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center hover:bg-surface-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Skip step"
        >
          <SkipForward size={16} className="text-ink-300" />
        </button>
      </div>

      {/* Step chips */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i < activeStepIndex
                ? "bg-accent-500 w-6"
                : i === activeStepIndex
                ? "bg-accent-400 w-8"
                : "bg-surface-600 w-6"
            )}
          />
        ))}
      </div>
    </div>
  );
}
