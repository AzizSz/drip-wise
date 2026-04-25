"use client";
import type { AppSettings, SavedBean, BeanProfile, BrewCalculation } from "./types";

const KEYS = {
  settings: "dripwise_settings",
  savedBeans: "dripwise_saved_beans",
  lastCalc: "dripwise_last_calc",
} as const;

export const DEFAULT_SETTINGS: AppSettings = {
  preferredRatio: "1:14",
  defaultBrewMode: "hot",
  language: "en",
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(KEYS.settings);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === "undefined") return;
  const current = getSettings();
  localStorage.setItem(KEYS.settings, JSON.stringify({ ...current, ...settings }));
}

export function getSavedBeans(): SavedBean[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.savedBeans);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBean(bean: BeanProfile): SavedBean {
  const saved = getSavedBeans();
  const newBean: SavedBean = {
    ...bean,
    id: `bean_${Date.now()}`,
    savedAt: Date.now(),
  };
  saved.push(newBean);
  localStorage.setItem(KEYS.savedBeans, JSON.stringify(saved));
  return newBean;
}

export function deleteBean(id: string): void {
  const saved = getSavedBeans().filter((b) => b.id !== id);
  localStorage.setItem(KEYS.savedBeans, JSON.stringify(saved));
}

export function saveLastCalc(calc: BrewCalculation): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.lastCalc, JSON.stringify(calc));
}

export function getLastCalc(): BrewCalculation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEYS.lastCalc);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// URL encoding for shareable recipes
export function encodeShareUrl(params: {
  coffee: number;
  water: number;
  ratio: number;
  mode: string;
  bean?: BeanProfile;
}): string {
  const p = new URLSearchParams();
  p.set("c", String(params.coffee));
  p.set("w", String(params.water));
  p.set("r", String(params.ratio));
  p.set("m", params.mode);
  if (params.bean?.origin) p.set("origin", params.bean.origin);
  if (params.bean?.roast) p.set("roast", params.bean.roast);
  if (params.bean?.processing) p.set("proc", params.bean.processing);
  if (params.bean?.altitude) p.set("alt", params.bean.altitude);
  if (params.bean?.flavorNotes?.length)
    p.set("fn", params.bean.flavorNotes.join(","));
  return `${window.location.origin}/recipe?${p.toString()}`;
}
