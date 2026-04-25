"use client";
import { Flame, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrewMode } from "@/lib/types";

interface Props {
  value: BrewMode;
  onChange: (m: BrewMode) => void;
}

export function BrewModeToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center bg-surface-900 rounded-xl p-1 w-fit border border-surface-600">
      <button
        onClick={() => onChange("hot")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          value === "hot"
            ? "bg-accent-500 text-white"
            : "text-ink-300 hover:text-ink-100"
        )}
      >
        <Flame size={15} />
        Hot
      </button>
      <button
        onClick={() => onChange("iced")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
          value === "iced"
            ? "bg-sky-500 text-white"
            : "text-ink-300 hover:text-ink-100"
        )}
      >
        <Snowflake size={15} />
        Iced
      </button>
    </div>
  );
}
