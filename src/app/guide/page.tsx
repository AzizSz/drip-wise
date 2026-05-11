"use client";
import { useRouter } from "next/navigation";

const RATIOS = [
  {
    ratio: "1:10", num: 10, label: "على طريقة Espresso", strength: 10, color: "bg-red-500",
    description: "مركّز جداً يكاد يكون لزجاً. نكهات مكثفة، يناسب المشروبات اللبنية أو الكؤوس التجريبية.",
    bestFor: ["تحميص داكن", "خلطات Espresso", "مشروبات باللبن"],
    avoid: ["تحميص فاتح", "حبوب زهرية/فاكهة"],
  },
  {
    ratio: "1:12", num: 12, label: "قوي", strength: 8, color: "bg-orange-500",
    description: "قوي ومكتمل القوام. كوب قوي يبرز الجسم والغنى دون أن يصبح طاغياً.",
    bestFor: ["تحميص داكن متوسط", "حبوب شوكولاتة/مكسرات", "الصباح الممطر"],
    avoid: ["تحميص فاتح جداً", "العطريات الرقيقة"],
  },
  {
    ratio: "1:13", num: 13, label: "جريء", strength: 7, color: "bg-amber-500",
    description: "كوب جريء ومُرضٍ. رائع للتحميص الداكن والحبوب منخفضة الحموضة حيث تريد العمق والقوام.",
    bestFor: ["تحميص داكن", "حبوب إندونيسيا", "معالجة طبيعية"],
    avoid: ["تحميص فاتح من مرتفعات عالية"],
  },
  {
    ratio: "1:14", num: 14, label: "متوازن ✓ افتراضي", strength: 6, color: "bg-accent-500",
    description: "نقطة الحلاوة لمعظم وصفات V60. حلاوة وحموضة وقوام متوازنة. نقطة بداية رائعة لأي حبة.",
    bestFor: ["تحميص متوسط", "كولومبيا", "غواتيمالا", "معالجة مغسولة"],
    avoid: ["لا شيء — إنه للجميع"],
  },
  {
    ratio: "1:15", num: 15, label: "فاتح ومضيء", strength: 5, color: "bg-lime-500",
    description: "قوام أخف مع وضوح معزز. يتيح للنكهات الرقيقة والعطريات التألق دون أن يكون مائياً.",
    bestFor: ["تحميص فاتح", "إثيوبيا", "كينيا", "معالجة عسلية"],
    avoid: ["تحميص داكن (قد يبدو ضعيفاً)"],
  },
  {
    ratio: "1:16", num: 16, label: "ناعم", strength: 4, color: "bg-emerald-500",
    description: "فاتح جداً وشبيه بالشاي. مثالي للقهوة المغسولة الفاتحة من المرتفعات العالية — يتيح لكل دقة التألق.",
    bestFor: ["Ethiopia Yirgacheffe", "Panama Geisha", "رواندا", "ارتفاع 2000م+"],
    avoid: ["تحميص داكن متوسط أو داكن"],
  },
  {
    ratio: "1:17", num: 17, label: "كالشاي", strength: 3, color: "bg-teal-500",
    description: "شفاف تقريباً في طابعه. لمن يريد تجربة قهوة فاتحة للغاية تشبه الشاي.",
    bestFor: ["تحميص فاتح للغاية", "صباح المناخ البارد", "تقييم التذوق"],
    avoid: ["معظم التحضير اليومي"],
  },
];

export default function GuidePage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1>دليل النسب</h1>
        <p className="text-ink-400 text-sm mt-0.5">فهم كيف تؤثر نسب الماء إلى القهوة على تحضيرك</p>
      </div>

      <div className="card p-4">
        <p className="text-ink-200 text-sm leading-relaxed">
          النسبة تصف كم غراماً من الماء تستخدم لكل غرام من القهوة.
          نسبة <span className="text-accent-400 font-semibold">1:15</span> تعني 1غ قهوة لكل 15مل ماء.
          النسب الأقل = أقوى وأكثر تركيزاً. النسب الأعلى = أفتح وأكثر رقةً.
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
                استخدم
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-ink-400">
                <span>القوة</span>
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
                <p className="text-xs text-emerald-400 font-medium mb-1.5">✓ الأفضل لـ</p>
                <ul className="space-y-1">
                  {r.bestFor.map((b) => (
                    <li key={b} className="text-xs text-ink-300">• {b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-red-400 font-medium mb-1.5">✗ تجنب مع</p>
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
        <h2 className="font-semibold text-ink-100">نصائح سريعة</h2>
        <ul className="space-y-2 text-sm text-ink-300">
          <li className="flex gap-2">
            <span className="text-accent-500">←</span>
            ابدأ بـ 1:14 أو 1:15 لأي حبة جديدة، ثم اضبط من هناك.
          </li>
          <li className="flex gap-2">
            <span className="text-accent-500">←</span>
            إذا بدا الكوب حامضاً أو ضعيفاً — جرّب نسبة أقل (قهوة أكثر) أو طحناً أدق.
          </li>
          <li className="flex gap-2">
            <span className="text-accent-500">←</span>
            إذا بدا الكوب مراً أو حارقاً — جرّب نسبة أعلى (قهوة أقل) أو طحناً أخشن.
          </li>
          <li className="flex gap-2">
            <span className="text-accent-500">←</span>
            الارتفاع يؤثر على الكثافة. حبوب المرتفعات العالية غالباً تستفيد من ماء أسخن قليلاً.
          </li>
        </ul>
      </div>
    </div>
  );
}
