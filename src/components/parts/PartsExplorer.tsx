"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { localize } from "@/lib/localize";
import { PartCard } from "@/components/parts/PartCard";

type Category = { id: string; slug: string; nameVi: string; nameEn: string };
type Part = {
  id: string;
  sku: string;
  nameVi: string;
  nameEn: string;
  craneModel: string;
  image: string;
  categoryId: string;
  category: { nameVi: string; nameEn: string };
};

export function PartsExplorer({
  parts,
  categories,
}: {
  parts: Part[];
  categories: Category[];
}) {
  const locale = useLocale();
  const t = useTranslations("parts");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parts.filter((part) => {
      const matchesCategory = categoryId === "all" || part.categoryId === categoryId;
      if (!matchesCategory) return false;
      if (!q) return true;
      const name = localize(locale, part.nameVi, part.nameEn).toLowerCase();
      return (
        name.includes(q) ||
        part.sku.toLowerCase().includes(q) ||
        part.craneModel.toLowerCase().includes(q)
      );
    });
  }, [parts, query, categoryId, locale]);

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
            className="min-h-11 w-full rounded-md border border-steel-200 bg-white py-3 pl-11 pr-4 text-sm text-steel-900 placeholder:text-steel-400 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
          />
        </div>
        <label htmlFor="parts-category" className="sr-only">
          {t("allCategories")}
        </label>
        <select
          id="parts-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="min-h-11 rounded-md border border-steel-200 bg-white px-4 text-sm font-medium text-steel-900 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 sm:w-64"
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
        <p className="rounded-lg border border-dashed border-steel-300 p-10 text-center text-sm text-steel-600">
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
