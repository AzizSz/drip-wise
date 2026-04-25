"use client";
import { useRouter } from "next/navigation";

const RATIOS = [
  {
    ratio: "1:10", num: 10, label: "Espresso-style", strength: 10, color: "bg-red-500",
    description: "Very concentrated, almost syrupy. Intense flavors, works well for milk-based drinks or experimental cups.",
    bestFor: ["Dark roasts", "Espresso blends", "Milk drinks"],
    avoid: ["Light roasts", "Floral/fruity beans"],
  },
  {
    ratio: "1:12", num: 12, label: "Strong", strength: 8, color: "bg-orange-500",
    description: "Robust and full-bodied. A strong cup that highlights body and richness without becoming overwhelming.",
    bestFor: ["Medium-Dark roasts", "Chocolate/nutty beans", "Rainy mornings"],
    avoid: ["Very light roasts", "Delicate aromatics"],
  },
  {
    ratio: "1:13", num: 13, label: "Bold", strength: 7, color: "bg-amber-500",
    description: "A bold, satisfying cup. Great for dark roasts and low-acid beans where you want depth and body.",
    bestFor: ["Dark roasts", "Indonesian beans", "Natural process"],
    avoid: ["High-altitude light roasts"],
  },
  {
    ratio: "1:14", num: 14, label: "Balanced ✓ Default", strength: 6, color: "bg-accent-500",
    description: "The sweet spot for most V60 recipes. Balanced sweetness, acidity, and body. A great starting point for any bean.",
    bestFor: ["Medium roasts", "Colombia", "Guatemala", "Washed process"],
    avoid: ["Nothing — it's the all-rounder"],
  },
  {
    ratio: "1:15", num: 15, label: "Light & Bright", strength: 5, color: "bg-lime-500",
    description: "Lighter body with enhanced clarity. Lets delicate flavors and aromatics shine through without being watery.",
    bestFor: ["Light roasts", "Ethiopia", "Kenya", "Honey process"],
    avoid: ["Dark roasts (may taste weak)"],
  },
  {
    ratio: "1:16", num: 16, label: "Delicate", strength: 4, color: "bg-emerald-500",
    description: "Very light and tea-like. Perfect for the most delicate high-altitude washed coffees — lets every nuance sing.",
    bestFor: ["Ethiopia Yirgacheffe", "Panama Geisha", "Rwanda", "2000m+ altitude"],
    avoid: ["Medium-dark or dark roasts"],
  },
  {
    ratio: "1:17", num: 17, label: "Tea-like", strength: 3, color: "bg-teal-500",
    description: "Almost translucent in character. For those who want an extremely light, almost tea-like coffee experience.",
    bestFor: ["Extremely light roasts", "Cold climate mornings", "Cupping evaluation"],
    avoid: ["Most everyday brewing"],
  },
];

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">Ratio Guide</h1>
        <p className="text-ink-400 text-sm mt-0.5">Understanding how water-to-coffee ratios affect your brew</p>
      </div>

      <div className="card p-4">
        <p className="text-ink-200 text-sm leading-relaxed">
          The ratio describes how many grams of water you use per gram of coffee.
          A <span className="text-accent-400 font-semibold">1:15 ratio</span> means 1g coffee for every 15ml of water.
          Lower ratios = stronger, more concentrated. Higher ratios = lighter, more delicate.
        </p>
      </div>

      <div className="space-y-4">
        {RATIOS.map((r) => (
          <div key={r.ratio} className="card p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-ink-100">{r.ratio}</span>
                  <span className="text-sm text-ink-400">{r.label}</span>
                </div>
                <p className="text-ink-300 text-sm mt-1">{r.description}</p>
              </div>
              <button
                onClick={() => router.push(`/?ratio=${r.ratio}`)}
                className="btn-secondary text-xs shrink-0 px-3 py-1.5"
              >
                Use
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-ink-400">
                <span>Strength</span>
                <span>{r.strength}/10</span>
              </div>
              <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${r.color} transition-all`}
                  style={{ width: `${r.strength * 10}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-emerald-400 font-medium mb-1.5">✓ Best for</p>
                <ul className="space-y-1">
                  {r.bestFor.map((b) => (
                    <li key={b} className="text-xs text-ink-300">• {b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-red-400 font-medium mb-1.5">✗ Avoid with</p>
                <ul className="space-y-1">
                  {r.avoid.map((a) => (
                    <li key={a} className="text-xs text-ink-300">• {a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-ink-100">Quick Tips</h2>
        <ul className="space-y-2 text-sm text-ink-300">
          <li className="flex gap-2">
            <span className="text-accent-500">→</span>
            Start with 1:14 or 1:15 for any new bean, then adjust from there.
          </li>
          <li className="flex gap-2">
            <span className="text-accent-500">→</span>
            If the cup tastes sour or weak — try a lower ratio (more coffee) or finer grind.
          </li>
          <li className="flex gap-2">
            <span className="text-accent-500">→</span>
            If the cup tastes bitter or harsh — try a higher ratio (less coffee) or coarser grind.
          </li>
          <li className="flex gap-2">
            <span className="text-accent-500">→</span>
            Altitude affects density. High-altitude beans often benefit from slightly hotter water.
          </li>
        </ul>
      </div>
    </div>
  );
}
