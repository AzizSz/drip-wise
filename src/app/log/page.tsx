"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Trash2, Star, ArrowRight } from "lucide-react";
import { getBrewLog, deleteBrewLog, updateBrewLog } from "@/lib/storage";
import type { BrewLogEntry } from "@/lib/storage";

function formatDate(ts: number): string {
  const d = new Date(ts);
  const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${date} — ${h}:${m}`;
}

const ROAST_AR: Record<string, string> = {
  Light: "فاتح", "Medium-Light": "فاتح متوسط",
  Medium: "متوسط", "Medium-Dark": "داكن متوسط", Dark: "داكن",
};
const PROCESS_AR: Record<string, string> = {
  Washed: "مغسول", Natural: "طبيعي", Honey: "عسلي",
  Anaerobic: "لاهوائي", "Wet-Hulled": "مقشور رطب",
};

function LogCard({ entry, onDelete }: { entry: BrewLogEntry; onDelete: () => void }) {
  const router = useRouter();
  const [notes, setNotes] = useState(entry.notes || "");
  const [rating, setRating] = useState(entry.rating || 0);

  function handleRating(r: number) {
    setRating(r);
    updateBrewLog(entry.id, { rating: r });
  }

  function handleNotesBlur() {
    updateBrewLog(entry.id, { notes });
  }

  function handleUse() {
    const p = new URLSearchParams();
    p.set("c", String(entry.coffee));
    p.set("w", String(entry.water));
    p.set("r", String(entry.ratio));
    p.set("m", entry.brewMode);
    router.push(`/?${p.toString()}`);
  }

  function handleDelete() {
    if (confirm("حذف هذا السجل؟")) onDelete();
  }

  return (
    <div className="card p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs bg-surface-700 text-ink-300 px-2 py-0.5 rounded-full border border-surface-600">
            {entry.coffee}غ
          </span>
          <span className="text-xs bg-surface-700 text-ink-300 px-2 py-0.5 rounded-full border border-surface-600">
            {entry.water}مل
          </span>
          <span className="text-xs bg-accent-950 text-accent-400 border border-accent-600/30 px-2 py-0.5 rounded-full font-medium">
            1:{entry.ratio}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
            entry.brewMode === "iced"
              ? "bg-sky-950/40 text-sky-400 border-sky-800/40"
              : "bg-orange-950/40 text-orange-400 border-orange-800/40"
          }`}>
            {entry.brewMode === "iced" ? "🧊 بارد" : "☕ حار"}
          </span>
        </div>
        <span className="text-[10px] text-ink-500 shrink-0">{formatDate(entry.savedAt)}</span>
      </div>

      {/* Bean tags */}
      {(entry.beanOrigin || entry.beanProcessing || entry.beanRoast || entry.beanName) && (
        <div className="flex flex-wrap gap-1.5">
          {entry.beanName && (
            <span className="text-[10px] text-ink-300 bg-surface-800 border border-surface-600 px-2 py-0.5 rounded-full">
              {entry.beanName}
            </span>
          )}
          {entry.beanOrigin && (
            <span className="text-[10px] text-ink-400 bg-surface-800 border border-surface-600 px-2 py-0.5 rounded-full">
              {entry.beanOrigin}
            </span>
          )}
          {entry.beanProcessing && (
            <span className="text-[10px] text-ink-400 bg-surface-800 border border-surface-600 px-2 py-0.5 rounded-full">
              {PROCESS_AR[entry.beanProcessing] || entry.beanProcessing}
            </span>
          )}
          {entry.beanRoast && (
            <span className="text-[10px] text-ink-400 bg-surface-800 border border-surface-600 px-2 py-0.5 rounded-full">
              {ROAST_AR[entry.beanRoast] || entry.beanRoast}
            </span>
          )}
        </div>
      )}

      {/* Star rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => handleRating(s)}
            className="text-xl leading-none transition-colors"
          >
            <span className={s <= rating ? "text-amber-400" : "text-ink-500"}>
              {s <= rating ? "★" : "☆"}
            </span>
          </button>
        ))}
      </div>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleNotesBlur}
        placeholder="ملاحظاتك..."
        rows={2}
        className="input-field text-xs resize-none"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleUse}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-accent-400 hover:text-accent-300 border border-accent-600/30 hover:border-accent-500/50 bg-accent-950/40 rounded-xl transition-all"
        >
          استخدم هذي الوصفة
          <ArrowRight size={12} />
        </button>
        <button
          onClick={handleDelete}
          className="w-9 h-9 flex items-center justify-center bg-red-950/40 hover:bg-red-900/40 border border-red-800/30 rounded-xl transition-all"
        >
          <Trash2 size={13} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}

export default function LogPage() {
  const router = useRouter();
  const [log, setLog] = useState<BrewLogEntry[]>([]);

  useEffect(() => {
    setLog(getBrewLog());
  }, []);

  function handleDelete(id: string) {
    deleteBrewLog(id);
    setLog(getBrewLog());
  }

  function handleClearAll() {
    if (confirm("مسح كل السجلات؟")) {
      localStorage.removeItem("dripwise_brew_log");
      setLog([]);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList size={22} className="text-accent-400" />
          <h1 className="text-2xl font-bold text-ink-100">سجل التحضيرات</h1>
        </div>
        {log.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-red-400 hover:text-red-300 border border-red-800/40 hover:border-red-700/60 px-3 py-1.5 rounded-lg transition-all"
          >
            مسح الكل
          </button>
        )}
      </div>

      {log.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <ClipboardList size={48} className="text-surface-600" />
          <p className="text-ink-400">ما سجّلت أي وصفة بعد</p>
          <button onClick={() => router.push("/")} className="btn-primary text-sm flex items-center gap-2">
            اذهب للحاسبة
            <ArrowRight size={14} />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {log.map((entry) => (
            <LogCard key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
