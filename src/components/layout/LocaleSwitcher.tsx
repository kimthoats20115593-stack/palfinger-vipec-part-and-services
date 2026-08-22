"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import clsx from "clsx";

export function LocaleSwitcher({ light = false }: { light?: boolean }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border p-0.5 text-xs font-bold",
        light ? "border-white/20" : "border-steel-300 dark:border-navy-700"
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            aria-pressed={active}
            onClick={() => router.replace(pathname, { locale: loc })}
            className={clsx(
              "min-h-8 rounded-full px-3 py-1.5 uppercase tracking-wide transition-colors",
              active
                ? "bg-red-500 text-white"
                : light
                ? "text-steel-200 hover:text-white"
                : "text-steel-600 hover:text-navy-900 dark:text-steel-300 dark:hover:text-white"
            )}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
