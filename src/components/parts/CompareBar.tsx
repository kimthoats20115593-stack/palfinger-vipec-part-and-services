"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Scale, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { subscribe, getSnapshot, getServerSnapshot, clearCompare } from "@/lib/compareStore";

export function CompareBar() {
  const t = useTranslations("parts");
  const compareIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (compareIds.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-40 flex justify-center px-4 lg:bottom-6">
      <div className="flex items-center gap-4 rounded-full border border-steel-200 bg-white px-5 py-3 shadow-lg dark:border-navy-700 dark:bg-navy-900">
        <span className="flex items-center gap-2 text-sm font-semibold text-navy-900 dark:text-white">
          <Scale className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden="true" />
          {t("compareBarSelected", { count: compareIds.length })}
        </span>
        <Link
          href="/parts/compare"
          className="min-h-9 rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600"
        >
          {t("compareBarView")}
        </Link>
        <button
          type="button"
          onClick={clearCompare}
          className="flex h-9 w-9 items-center justify-center rounded-full text-steel-400 hover:bg-steel-100 hover:text-steel-700 dark:hover:bg-navy-800 dark:hover:text-white"
          aria-label={t("compareBarClear")}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
