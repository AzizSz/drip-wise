import Link from "next/link";
import { Coffee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
      <Coffee size={48} className="mx-auto" style={{ color: "var(--surface-600)" }} />
      <p className="text-ink-200 text-lg font-medium">
        الصفحة هذي ما فيها قهوة ☕
      </p>
      <p className="text-ink-400 text-sm">الرابط غلط أو الصفحة ما موجودة.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 btn-primary"
      >
        ارجع للرئيسية
      </Link>
    </div>
  );
}
