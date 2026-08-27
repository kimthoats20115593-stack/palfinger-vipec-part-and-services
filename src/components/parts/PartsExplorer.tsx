"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { localize } from "@/lib/localize";
import { PartCard } from "@/components/parts/PartCard";

type Category = { id: string; slug: string; nameVi: string; nameEn: string };
type CraneModel = { id: string; nameVi: string; nameEn: string };
type Part = {
  id: string;
  sku: string;
  nameVi: string;
  nameEn: string;
  image: string;
  photoUrl: string | null;
  categoryId: string;
  craneModelId: string | null;
  craneModel: { nameVi: string; nameEn: string } | null;
  category: { nameVi: string; nameEn: string };
  price: number | null;
  status: string | null;
  unit: string | null;
  stockQty: number | null;
};

export function PartsExplorer({
  parts,
  categories,
  craneModels,
}: {
  parts: Part[];
  categories: Category[];
  craneModels: CraneModel[];
}) {
  const locale = useLocale();
  const t = useTranslations("parts");
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [craneModelId, setCraneModelId] = useState<string>(
    searchParams.get("model") ?? "all"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parts.filter((part) => {
      if (categoryId !== "all" && part.categoryId !== categoryId) return false;
      if (craneModelId !== "all" && part.craneModelId !== craneModelId) return false;
      if (!q) return true;
      const name = localize(locale, part.nameVi, part.nameEn).toLowerCase();
      const craneModelName = part.craneModel
        ? localize(locale, part.craneModel.nameVi, part.craneModel.nameEn).toLowerCase()
        : "";
      return (
        name.includes(q) || part.sku.toLowerCase().includes(q) || craneModelName.includes(q)
      );
    });
  }, [parts, query, categoryId, craneModelId, locale]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-400"
            aria-hidden="true"
          />
          <label htmlFor="parts-search" className="sr-only">
            {t("searchPlaceholder")}
          </label>
          <input
            id="parts-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-h-11 w-full rounded-md border border-steel-200 bg-white py-3 pl-11 pr-4 text-sm text-steel-900 placeholder:text-steel-400 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:focus:border-white"
          />
        </div>
        <label htmlFor="parts-model" className="sr-only">
          {t("allModels")}
        </label>
        <select
          id="parts-model"
          value={craneModelId}
          onChange={(e) => setCraneModelId(e.target.value)}
          className="min-h-11 rounded-md border border-steel-200 bg-white px-4 text-sm font-medium text-steel-900 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:focus:border-white sm:w-56"
        >
          <option value="all">{t("allModels")}</option>
          {craneModels.map((cm) => (
            <option key={cm.id} value={cm.id}>
              {localize(locale, cm.nameVi, cm.nameEn)}
            </option>
          ))}
        </select>
        <label htmlFor="parts-category" className="sr-only">
          {t("allCategories")}
        </label>
        <select
          id="parts-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="min-h-11 rounded-md border border-steel-200 bg-white px-4 text-sm font-medium text-steel-900 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:focus:border-white sm:w-56"
        >
          <option value="all">{t("allCategories")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {localize(locale, cat.nameVi, cat.nameEn)}
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
          {filtered.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      )}
    </div>
  );
}
