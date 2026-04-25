"use client";
import { cn } from "@/lib/utils";
import type { RatioOption } from "@/lib/types";

const RATIOS: RatioOption[] = ["1:10", "1:12", "1:13", "1:14", "1:15", "1:16", "1:17"];

interface Props {
  value: RatioOption;
  customValue: number;
  onChange: (r: RatioOption) => void;
  onCustomChange: (v: number) => void;
}

export function RatioSelector({ value, customValue, onChange, onCustomChange }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {RATIOS.map((r) => (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
              value === r
                ? "bg-accent-500 text-white border-accent-500"
                : "bg-surface-800 text-ink-300 border-surface-600 hover:border-accent-500 hover:text-ink-100"
            )}
          >
            {r}
          </button>
        ))}
        <button
          onClick={() => onChange("custom")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
            value === "custom"
              ? "bg-accent-500 text-white border-accent-500"
              : "bg-surface-800 text-ink-300 border-surface-600 hover:border-accent-500 hover:text-ink-100"
          )}
        >
          Custom
        </button>
      </div>

      {value === "custom" && (
        <div className="flex items-center gap-3 animate-slide-down">
          <span className="text-ink-300 text-sm">1 :</span>
          <input
            type="number"
            min={8}
            max={20}
            step={0.5}
            value={customValue}
            onChange={(e) => onCustomChange(Number(e.target.value))}
            className="input-field w-24 text-center"
            placeholder="14"
          />
          <span className="text-ink-400 text-xs">(8–20)</span>
        </div>
      )}
    </div>
  );
}
