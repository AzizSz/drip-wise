"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Mountain, Thermometer, ArrowUpRight, Trash2, Bookmark } from "lucide-react";
import { BEAN_LIBRARY } from "@/lib/bean-library";
import { getSavedBeans, deleteBean } from "@/lib/storage";
import type { BeanLibraryEntry, SavedBean, Origin, ProcessingMethod, RoastLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const ROAST_COLORS: Record<RoastLevel | "", string> = {
  "": "text-ink-300",
  Light: "text-amber-300",
  "Medium-Light": "text-amber-400",
  Medium: "text-orange-400",
  "Medium-Dark": "text-orange-500",
  Dark: "text-red-400",
};

const PROCESS_COLORS: Record<ProcessingMethod | "", string> = {
  "": "text-ink-300",
  Washed: "text-sky-400",
  Natural: "text-red-400",
  Honey: "text-amber-400",
  Anaerobic: "text-violet-400",
  "Wet-Hulled": "text-emerald-400",
};

const ROAST_AR: Record<RoastLevel | "", string> = {
  "": "",
  Light: "فاتح",
  "Medium-Light": "فاتح متوسط",
  Medium: "متوسط",
  "Medium-Dark": "داكن متوسط",
  Dark: "داكن",
};

const PROCESS_AR: Record<ProcessingMethod | "", string> = {
  "": "",
  Washed: "مغسول",
  Natural: "طبيعي",
  Honey: "عسلي",
  Anaerobic: "لاهوائي",
  "Wet-Hulled": "مقشور رطب",
};

const FLAVOR_AR: Record<string, string> = {
  Floral: "زهري", Fruity: "فاكهة", Citrus: "حمضيات", Berry: "توت",
  Chocolate: "شوكولاتة", Nutty: "مكسرات", Caramel: "كراميل", Spicy: "بهارات",
  Earthy: "ترابي", Tropical: "استوائي", "Stone Fruit": "فاكهة حجرية", "Wine-like": "كالنبيذ",
};

function BeanCard({ bean, onUse, onDelete }: {
  bean: BeanLibraryEntry | SavedBean;
  onUse: () => void;
  onDelete?: () => void;
}) {
  const isLibrary = "description" in bean;
  return (
    <div className="card p-4 space-y-3 hover:border-surface-500 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-ink-100">{isLibrary ? bean.name : (bean.origin || "حبة مخصصة")}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {bean.origin && (
              <span className="flex items-center gap-1 text-xs text-ink-400">
                <MapPin size={10} />{bean.origin}
              </span>
            )}
            {bean.altitude && (
              <span className="flex items-center gap-1 text-xs text-ink-400">
                <Mountain size={10} />{bean.altitude}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {onDelete && (
            <button
              onClick={onDelete}
              className="w-7 h-7 rounded-lg bg-red-950/40 hover:bg-red-900/40 flex items-center justify-center transition-all"
            >
              <Trash2 size={12} className="text-red-400" />
            </button>
          )}
          <button
            onClick={onUse}
            className="w-7 h-7 rounded-lg bg-accent-500/15 hover:bg-accent-500/30 flex items-center justify-center transition-all"
          >
            <ArrowUpRight size={12} className="text-accent-400" />
          </button>
        </div>
      </div>

      {isLibrary && (bean as BeanLibraryEntry).description && (
        <p className="text-ink-400 text-xs leading-relaxed line-clamp-2">
          {(bean as BeanLibraryEntry).description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {bean.roast && (
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-900 border border-surface-600", ROAST_COLORS[bean.roast])}>
            {ROAST_AR[bean.roast]}
          </span>
        )}
        {bean.processing && (
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-900 border border-surface-600", PROCESS_COLORS[bean.processing])}>
            {PROCESS_AR[bean.processing]}
          </span>
        )}
        {(bean.flavorNotes || []).slice(0, 3).map((note) => (
          <span key={note} className="text-[10px] text-ink-300 px-2 py-0.5 rounded-full bg-surface-800 border border-surface-600">
            {FLAVOR_AR[note] || note}
          </span>
        ))}
        {(bean.flavorNotes || []).length > 3 && (
          <span className="text-[10px] text-ink-400 px-2 py-0.5">
            +{(bean.flavorNotes || []).length - 3} أكثر
          </span>
        )}
      </div>

      {isLibrary && (bean as BeanLibraryEntry).typicalRatio && (
        <div className="flex items-center gap-1 text-xs text-accent-500">
          <Thermometer size={11} />
          النسبة المعتادة: <span className="font-medium">{(bean as BeanLibraryEntry).typicalRatio}</span>
        </div>
      )}
    </div>
  );
}

export default function BeansPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterOrigin, setFilterOrigin] = useState<Origin | "">("");
  const [filterRoast, setFilterRoast] = useState<RoastLevel | "">("");
  const [tab, setTab] = useState<"library" | "saved">("library");
  const [savedBeans, setSavedBeans] = useState<SavedBean[]>(() => {
    if (typeof window === "undefined") return [];
    return getSavedBeans();
  });

  const filtered = BEAN_LIBRARY.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.name.toLowerCase().includes(q) || b.origin.toLowerCase().includes(q) || b.flavorNotes.some((n) => n.toLowerCase().includes(q));
    const matchOrigin = !filterOrigin || b.origin === filterOrigin;
    const matchRoast = !filterRoast || b.roast === filterRoast;
    return matchSearch && matchOrigin && matchRoast;
  });

  const origins = Array.from(new Set(BEAN_LIBRARY.map((b) => b.origin)));
  const roasts: RoastLevel[] = ["Light", "Medium-Light", "Medium", "Medium-Dark", "Dark"];

  function handleUse(bean: BeanLibraryEntry | SavedBean) {
    const params = new URLSearchParams();
    if (bean.origin) params.set("origin", bean.origin);
    if (bean.roast) params.set("roast", bean.roast);
    if (bean.processing) params.set("proc", bean.processing);
    if (bean.altitude) params.set("alt", bean.altitude);
    router.push(`/?${params.toString()}`);
  }

  function handleDeleteSaved(id: string) {
    deleteBean(id);
    setSavedBeans(getSavedBeans());
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-100">مكتبة الحبوب</h1>
        <p className="text-ink-400 text-sm mt-0.5">ملفات مرجعية للمناشئ الشهيرة</p>
      </div>

      <div className="flex gap-1 bg-surface-900 rounded-xl p-1 border border-surface-600 w-fit">
        <button
          onClick={() => setTab("library")}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
            tab === "library" ? "bg-accent-500 text-white" : "text-ink-300 hover:text-ink-100"
          )}
        >
          المكتبة ({BEAN_LIBRARY.length})
        </button>
        <button
          onClick={() => setTab("saved")}
          className={cn(
            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
            tab === "saved" ? "bg-accent-500 text-white" : "text-ink-300 hover:text-ink-100"
          )}
        >
          <Bookmark size={13} />
          المحفوظة ({savedBeans.length})
        </button>
      </div>

      {tab === "library" && (
        <>
          <div className="space-y-3">
            <div className="relative">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="ابحث عن الحبوب…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pr-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={filterOrigin}
                onChange={(e) => setFilterOrigin(e.target.value as Origin)}
                className="input-field w-auto text-sm"
              >
                <option value="">كل المناشئ</option>
                {origins.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <select
                value={filterRoast}
                onChange={(e) => setFilterRoast(e.target.value as RoastLevel)}
                className="input-field w-auto text-sm"
              >
                <option value="">كل التحميصات</option>
                {roasts.map((r) => <option key={r} value={r}>{ROAST_AR[r]}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-ink-400">لا توجد حبوب تطابق بحثك.</div>
            ) : (
              filtered.map((bean) => (
                <BeanCard key={bean.id} bean={bean} onUse={() => handleUse(bean)} />
              ))
            )}
          </div>
        </>
      )}

      {tab === "saved" && (
        <div className="space-y-3">
          {savedBeans.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Bookmark size={32} className="text-surface-600 mx-auto" />
              <p className="text-ink-400">لا توجد حبوب محفوظة بعد.</p>
              <p className="text-ink-500 text-sm">أكمل ملف حبة في الحاسبة واحفظها.</p>
            </div>
          ) : (
            savedBeans.map((bean) => (
              <BeanCard
                key={bean.id}
                bean={bean}
                onUse={() => handleUse(bean)}
                onDelete={() => handleDeleteSaved(bean.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
