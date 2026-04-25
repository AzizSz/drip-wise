import { ExternalLink, Coffee } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-ink-100">عن DripWise</h1>
        <p className="text-ink-400 text-sm">الشخص اللي وراه</p>
      </div>

      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-500/15 border border-accent-500/30 flex items-center justify-center shrink-0">
            <Coffee size={18} className="text-accent-400" />
          </div>
          <div>
            <p className="font-semibold text-ink-100">عبدالعزيز صالح</p>
            <p className="text-xs text-ink-400">الهفوف، المنطقة الشرقية</p>
          </div>
        </div>

        <p className="text-ink-200 text-sm leading-loose">
          DripWise بناه عبدالعزيز صالح — مختص تقني وعنده شغف بعالم القهوة المختصة.
        </p>
        <p className="text-ink-300 text-sm leading-loose">
          المشروع جاء من إحساس إن محبي الـ V60 في السعودية يحتاجون أداة بلغتهم تساعدهم يضبطون وصفتهم بدقة.
        </p>
        <p className="text-ink-400 text-sm leading-loose">
          مو شركة، مو منتج تجاري — مجرد أداة بناها شخص يحب القهوة بنفس القدر اللي تحبها.
        </p>
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-semibold text-ink-300 uppercase tracking-wide">تواصل</h2>
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/AzizSz"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-surface-900 border border-surface-600 hover:border-accent-500/50 transition-all group"
          >
            <ExternalLink size={16} className="text-ink-400 group-hover:text-ink-100 transition-colors" />
            <span className="text-ink-300 group-hover:text-ink-100 text-sm transition-colors">github.com/AzizSz</span>
          </a>
          <a
            href="https://x.com/27vli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-surface-900 border border-surface-600 hover:border-accent-500/50 transition-all group"
          >
            <ExternalLink size={16} className="text-ink-400 group-hover:text-ink-100 transition-colors" />
            <span className="text-ink-300 group-hover:text-ink-100 text-sm transition-colors">x.com/27vli</span>
          </a>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link href="/" className="text-xs text-ink-500 hover:text-ink-300 transition-colors">
          ← ارجع للحاسبة
        </Link>
      </div>
    </div>
  );
}
