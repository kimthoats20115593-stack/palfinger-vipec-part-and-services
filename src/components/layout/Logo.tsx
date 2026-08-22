import Image from "next/image";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={clsx(
        "group flex items-center gap-x-1.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 sm:gap-x-3",
        light ? "flex-wrap gap-y-1.5" : "flex-nowrap"
      )}
      aria-label="PALFINGER VIPEC — Trang chủ"
    >
      <span
        className={clsx(
          "flex shrink-0 items-center rounded-md dark:bg-white dark:px-1.5 dark:py-0.5 sm:dark:px-2 sm:dark:py-1",
          light && "bg-white px-1.5 py-0.5 sm:px-2 sm:py-1"
        )}
      >
        <Image
          src="/logo-vipec.png"
          alt="VIPEC"
          width={2400}
          height={458}
          priority
          className="h-5 w-auto shrink-0 sm:h-7"
        />
      </span>
      <span
        className={clsx(
          "h-4 w-px shrink-0 sm:h-5",
          light ? "bg-white/25" : "bg-steel-300 dark:bg-white/25"
        )}
        aria-hidden="true"
      />
      <Image
        src="/logo-palfinger.png"
        alt="PALFINGER"
        width={2562}
        height={549}
        priority
        className="h-7 w-auto shrink-0 sm:h-9"
      />
    </Link>
  );
}
