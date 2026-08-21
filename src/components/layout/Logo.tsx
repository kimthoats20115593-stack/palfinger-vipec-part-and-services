import { Link } from "@/i18n/navigation";
import clsx from "clsx";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
      aria-label="PALFINGER VIPEC — Trang chủ"
    >
      <span
        className={clsx(
          "font-display text-xl font-bold italic tracking-tight",
          light ? "text-white" : "text-navy-900"
        )}
      >
        VIPEC
      </span>
      <span
        className={clsx("h-6 w-px shrink-0", light ? "bg-white/25" : "bg-steel-300")}
        aria-hidden="true"
      />
      <span className="rounded bg-yellow-500 px-2.5 py-1 font-display text-sm font-bold italic tracking-tight text-navy-950">
        PALFINGER
      </span>
    </Link>
  );
}
