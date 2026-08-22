import Image from "next/image";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
      aria-label="PALFINGER VIPEC — Trang chủ"
    >
      <span
        className={clsx(
          "flex shrink-0 items-center rounded-md dark:bg-white dark:px-2 dark:py-1",
          light && "bg-white px-2 py-1"
        )}
      >
        <Image
          src="/logo-vipec.png"
          alt="VIPEC"
          width={2400}
          height={458}
          priority
          className={clsx("w-auto shrink-0", light ? "h-6" : "h-7 sm:h-8")}
        />
      </span>
      <span
        className={clsx(
          "h-5 w-px shrink-0",
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
        className={clsx("w-auto shrink-0", light ? "h-6" : "h-7 sm:h-8")}
      />
    </Link>
  );
}
