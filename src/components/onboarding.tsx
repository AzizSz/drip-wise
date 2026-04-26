"use client";
import { useState, useEffect } from "react";
import { Droplets, SlidersHorizontal, Leaf, X } from "lucide-react";

const STORAGE_KEY = "dripwise_welcomed";

const SLIDES = [
  {
    icon: <Droplets size={40} className="text-sky-400" />,
    title: "اكتب كمية الماء أو القهوة",
    subtitle: "الحاسبة تحسب الثاني تلقائياً",
  },
  {
    icon: <SlidersHorizontal size={40} className="text-accent-400" />,
    title: "اختار الريشيو اللي يناسبك",
    subtitle: "1:13 قوي — 1:15 متوازن — 1:17 خفيف",
  },
  {
    icon: <Leaf size={40} className="text-emerald-400" />,
    title: "أضف بيانات البن (اختياري)",
    subtitle: "يعطيك توصية ذكية للريشيو والحرارة والطحنة",
  },
];

export function WelcomeModal() {
  const [visible, setVisible] = useState(false);
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  function close() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  function goToSlide(next: number) {
    setFading(true);
    setTimeout(() => {
      setSlide(next);
      setFading(false);
    }, 150);
  }

  function handleNext() {
    if (slide < SLIDES.length - 1) goToSlide(slide + 1);
    else close();
  }

  if (!visible) return null;

  const current = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="card-premium w-full max-w-sm p-6 space-y-6 relative">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 left-4 text-ink-500 hover:text-ink-300 transition-colors"
          aria-label="إغلاق"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center pt-1">
          <p className="font-bold text-lg text-ink-100">أهلاً في DripWise ☕</p>
        </div>

        {/* Slide content */}
        <div
          className="flex flex-col items-center gap-3 py-2 transition-opacity duration-150"
          style={{ opacity: fading ? 0 : 1 }}
        >
          <div className="w-20 h-20 rounded-2xl bg-surface-800 border border-surface-600 flex items-center justify-center">
            {current.icon}
          </div>
          <p className="font-semibold text-ink-100 text-center text-base">{current.title}</p>
          <p className="text-sm text-ink-400 text-center leading-relaxed">{current.subtitle}</p>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="transition-all duration-200 rounded-full"
              style={{
                width: i === slide ? "20px" : "8px",
                height: "8px",
                background: i === slide ? "var(--accent-500)" : "var(--surface-600)",
              }}
              aria-label={`الشريحة ${i + 1}`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button onClick={handleNext} className={isLast ? "btn-primary w-full text-sm" : "btn-secondary w-full text-sm"}>
            {isLast ? "ابدأ الحين ←" : "التالي"}
          </button>
          <div className="text-center">
            <button
              onClick={close}
              className="text-xs text-ink-500 hover:text-ink-300 transition-colors"
            >
              تخطى
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickPresetsProps {
  water: string;
  setWater: (v: string) => void;
  setLastEdited: (v: "water" | "coffee") => void;
}

const PRESETS = [
  { label: "☕ كوب (250مل)", value: "250" },
  { label: "☕☕ كوبين (500مل)", value: "500" },
  { label: "🥤 كبير (350مل)", value: "350" },
];

export function QuickPresets({ water, setWater, setLastEdited }: QuickPresetsProps) {
  if (water !== "") return null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-500 text-center">جرب مثال سريع</p>
      <div className="flex gap-2 justify-center flex-wrap">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            onClick={() => { setWater(p.value); setLastEdited("water"); }}
            className="text-xs bg-surface-700 text-ink-300 border border-surface-600 rounded-full px-3 py-1.5 hover:border-accent-500/50 hover:text-ink-100 transition-all"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
