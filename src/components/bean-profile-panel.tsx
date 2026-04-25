"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BeanProfile, FlavorNote, Origin, AltitudeRange, ProcessingMethod, RoastLevel } from "@/lib/types";

const ORIGINS: Origin[] = [
  "Ethiopia", "Kenya", "Colombia", "Brazil", "Yemen",
  "Guatemala", "Costa Rica", "Panama", "Rwanda", "Burundi",
  "Indonesia", "Mexico", "Peru", "Honduras", "El Salvador",
];
const ALTITUDES: AltitudeRange[] = ["Below 1000m", "1000-1400m", "1400-1700m", "1700-2000m", "2000m+"];
const PROCESSING: ProcessingMethod[] = ["Washed", "Natural", "Honey", "Anaerobic", "Wet-Hulled"];
const ROASTS: RoastLevel[] = ["Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"];
const FLAVOR_NOTES: FlavorNote[] = [
  "Floral", "Fruity", "Citrus", "Berry", "Chocolate",
  "Nutty", "Caramel", "Spicy", "Earthy", "Tropical", "Stone Fruit", "Wine-like",
];

const PROCESSING_AR: Record<ProcessingMethod, string> = {
  "": "",
  Washed: "مغسول",
  Natural: "طبيعي",
  Honey: "عسلي",
  Anaerobic: "لاهوائي",
  "Wet-Hulled": "مقشور رطب",
};

const ROAST_AR: Record<RoastLevel, string> = {
  "": "",
  Light: "فاتح",
  "Medium-Light": "فاتح متوسط",
  Medium: "متوسط",
  "Medium-Dark": "داكن متوسط",
  Dark: "داكن",
};

const FLAVOR_AR: Record<FlavorNote, string> = {
  Floral: "زهري",
  Fruity: "فاكهة",
  Citrus: "حمضيات",
  Berry: "توت",
  Chocolate: "شوكولاتة",
  Nutty: "مكسرات",
  Caramel: "كراميل",
  Spicy: "بهارات",
  Earthy: "ترابي",
  Tropical: "استوائي",
  "Stone Fruit": "فاكهة حجرية",
  "Wine-like": "كالنبيذ",
};

interface Props {
  value: BeanProfile;
  onChange: (b: BeanProfile) => void;
}

export function BeanProfilePanel({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const hasData = value.origin || value.roast || value.processing;

  function toggleFlavor(note: FlavorNote) {
    const current = value.flavorNotes || [];
    const next = current.includes(note)
      ? current.filter((n) => n !== note)
      : [...current, note];
    onChange({ ...value, flavorNotes: next });
  }

  return (
    <div className="card-premium overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface-700/30 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center">
            <Leaf size={15} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-ink-100">ملف الحبة</p>
            <p className="text-xs text-ink-400">
              {hasData
                ? [value.origin, value.roast ? ROAST_AR[value.roast] : "", value.processing ? PROCESSING_AR[value.processing] : ""].filter(Boolean).join(" · ")
                : "اختياري — يفعّل التوصيات الذكية"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasData && (
            <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 rounded-full px-2 py-0.5">
              نشط
            </span>
          )}
          {open
            ? <ChevronUp size={18} className="text-ink-400" />
            : <ChevronDown size={18} className="text-ink-400" />
          }
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 animate-slide-down border-t border-surface-600/50">
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Origin */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-300 uppercase tracking-wide">المنشأ</label>
              <select
                value={value.origin}
                onChange={(e) => onChange({ ...value, origin: e.target.value as Origin })}
                className="input-field text-sm"
              >
                <option value="">اختر المنشأ…</option>
                {ORIGINS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {/* Altitude */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-300 uppercase tracking-wide">الارتفاع</label>
              <select
                value={value.altitude}
                onChange={(e) => onChange({ ...value, altitude: e.target.value as AltitudeRange })}
                className="input-field text-sm"
              >
                <option value="">اختر الارتفاع…</option>
                {ALTITUDES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Processing */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-300 uppercase tracking-wide">طريقة المعالجة</label>
              <div className="flex flex-wrap gap-2">
                {PROCESSING.map((p) => (
                  <button
                    key={p}
                    onClick={() => onChange({ ...value, processing: value.processing === p ? "" : p as ProcessingMethod })}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      value.processing === p
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-700/60"
                        : "bg-surface-800 text-ink-300 border-surface-600 hover:border-emerald-700/60"
                    )}
                  >
                    {PROCESSING_AR[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Roast */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-ink-300 uppercase tracking-wide">درجة التحميص</label>
              <div className="flex flex-wrap gap-2">
                {ROASTS.map((r) => (
                  <button
                    key={r}
                    onClick={() => onChange({ ...value, roast: value.roast === r ? "" : r as RoastLevel })}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      value.roast === r
                        ? "bg-amber-950/60 text-amber-300 border-amber-700/60"
                        : "bg-surface-800 text-ink-300 border-surface-600 hover:border-amber-700/60"
                    )}
                  >
                    {ROAST_AR[r]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Flavor Notes */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-ink-300 uppercase tracking-wide">ملاحظات النكهة</label>
            <div className="flex flex-wrap gap-2">
              {FLAVOR_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => toggleFlavor(note)}
                  className={cn(
                    (value.flavorNotes || []).includes(note) ? "tag-active" : "tag-inactive"
                  )}
                >
                  {FLAVOR_AR[note]}
                </button>
              ))}
            </div>
          </div>

          {hasData && (
            <button
              onClick={() => onChange({ origin: "", altitude: "", processing: "", roast: "", flavorNotes: [] })}
              className="text-xs text-ink-400 hover:text-ink-100 underline transition-colors"
            >
              مسح ملف الحبة
            </button>
          )}
        </div>
      )}
    </div>
  );
}
