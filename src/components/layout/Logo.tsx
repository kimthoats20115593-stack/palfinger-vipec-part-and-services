import { Link } from "@/i18n/navigation";
import clsx from "clsx";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
      aria-label="PALFINGER VIPEC — Trang chủ"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-orange-500 font-display text-lg font-bold text-white"
        aria-hidden="true"
      >
        PV
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={clsx(
            "font-display text-base font-bold tracking-wide",
            light ? "text-white" : "text-navy-900"
          )}
        >
          PALFINGER VIPEC
        </span>
        <span
          className={clsx(
            "text-[10px] font-semibold uppercase tracking-[0.18em]",
            light ? "text-steel-300" : "text-steel-500"
          )}
        >
          Genuine Crane Parts &amp; Service
        </span>
      </span>
    </Link>
  );
}
