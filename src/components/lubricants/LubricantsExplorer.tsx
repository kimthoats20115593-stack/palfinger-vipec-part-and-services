"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { localize } from "@/lib/localize";
import { LubricantCard } from "@/components/lubricants/LubricantCard";

type LubricantType = "ENGINE_OIL" | "HYDRAULIC_OIL" | "GEAR_OIL" | "GREASE" | "OTHER";
type Lubricant = {
  id: string;
  nameVi: string;
  nameEn: string;
  brand: string | null;
  type: LubricantType;
  image: string | null;
};

export function LubricantsExplorer({ lubricants }: { lubricants: Lubricant[] }) {
  const locale = useLocale();
  const t = useTranslations("lubricants");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");

  const typeOptions: { value: LubricantType; label: string }[] = [
    { value: "ENGINE_OIL", label: t("typeEngineOil") },
    { value: "HYDRAULIC_OIL", label: t("typeHydraulicOil") },
    { value: "GEAR_OIL", label: t("typeGearOil") },
    { value: "GREASE", label: t("typeGrease") },
    { value: "OTHER", label: t("typeOther") },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lubricants.filter((lb) => {
      if (type !== "all" && lb.type !== type) return false;
      if (!q) return true;
      const name = localize(locale, lb.nameVi, lb.nameEn).toLowerCase();
      return name.includes(q) || (lb.brand ?? "").toLowerCase().includes(q);
    });
  }, [lubricants, query, type, locale]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400"
            aria-hidden="true"
          />
          <label htmlFor="lubricants-search" className="sr-only">
            {t("searchPlaceholder")}
          </label>
          <input
            id="lubricants-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-h-11 w-full rounded-md border border-steel-200 bg-white py-3 pl-11 pr-4 text-sm text-steel-900 placeholder:text-steel-400 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:focus:border-white"
          />
        </div>
        <label htmlFor="lubricants-type" className="sr-only">
          {t("allTypes")}
        </label>
        <select
          id="lubricants-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="min-h-11 rounded-md border border-steel-200 bg-white px-4 text-sm font-medium text-steel-900 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:focus:border-white sm:w-64"
        >
          <option value="all">{t("allTypes")}</option>
          {typeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-steel-300 p-10 text-center text-sm text-steel-600 dark:border-navy-700 dark:text-steel-300">
          {t("noResults")}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((lb) => (
            <LubricantCard key={lb.id} lubricant={lb} />
          ))}
        </div>
      )}
    </div>
  );
}
