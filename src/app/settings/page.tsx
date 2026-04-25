"use client";
import { useState, useEffect } from "react";
import { Check, RotateCcw } from "lucide-react";
import { getSettings, saveSettings, DEFAULT_SETTINGS } from "@/lib/storage";
import type { AppSettings, RatioOption, BrewMode } from "@/lib/types";
import { cn } from "@/lib/utils";

const RATIO_OPTIONS: RatioOption[] = ["1:10", "1:12", "1:13", "1:14", "1:15", "1:16", "1:17"];

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function resetAll() {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-100">Settings</h1>
          <p className="text-ink-400 text-sm mt-0.5">Stored in your browser</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
            <Check size={14} />
            Saved
          </div>
        )}
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-ink-100">Default Ratio</h2>
        <div className="flex flex-wrap gap-2">
          {RATIO_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => update("preferredRatio", r)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                settings.preferredRatio === r
                  ? "bg-accent-500 text-white border-accent-500"
                  : "bg-surface-800 text-ink-300 border-surface-600 hover:border-accent-500"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-ink-100">Default Brew Mode</h2>
        <div className="flex gap-2">
          {(["hot", "iced"] as BrewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => update("defaultBrewMode", m)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-medium border transition-all",
                settings.defaultBrewMode === m
                  ? m === "hot" ? "bg-accent-500 text-white border-accent-500" : "bg-sky-500 text-white border-sky-500"
                  : "bg-surface-800 text-ink-300 border-surface-600 hover:border-accent-500"
              )}
            >
              {m === "hot" ? "☕ Hot" : "🧊 Iced"}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold text-ink-100">Language</h2>
        <div className="flex gap-2">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => update("language", l)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-medium border transition-all",
                settings.language === l
                  ? "bg-accent-500 text-white border-accent-500"
                  : "bg-surface-800 text-ink-300 border-surface-600 hover:border-accent-500"
              )}
            >
              {l === "en" ? "🇺🇸 English" : "🇸🇦 العربية"}
            </button>
          ))}
        </div>
        {settings.language === "ar" && (
          <p className="text-xs text-ink-400">
            Note: Full Arabic UI coming soon. RTL layout is supported.
          </p>
        )}
      </div>

      <div className="card p-5 space-y-2">
        <h2 className="font-semibold text-ink-100">About DripWise</h2>
        <p className="text-ink-400 text-sm leading-relaxed">
          A smart V60 pour over calculator with bean profiling, brew recommendations, and step-by-step recipes. No backend — all data stays in your browser.
        </p>
        <div className="pt-2 flex items-center gap-2 text-xs text-ink-500">
          <span>v1.0.0</span>
          <span>·</span>
          <span>Pure client-side</span>
          <span>·</span>
          <span>PWA ready</span>
        </div>
      </div>

      <button
        onClick={resetAll}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-700/40 rounded-xl transition-all"
      >
        <RotateCcw size={15} />
        Reset all settings
      </button>
    </div>
  );
}
