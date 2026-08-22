"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { X, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/localize";
import { subscribe, getSnapshot, getServerSnapshot, removeFromCompare } from "@/lib/compareStore";
import { PartIcon, type PartIconVariant } from "@/components/illustrations/PartIcon";

type Spec = { label: string; value: string };
type PartData = {
  id: string;
  sku: string;
  nameVi: string;
  nameEn: string;
  image: string;
  specs: Spec[] | null;
  category: { nameVi: string; nameEn: string };
  craneModel: { nameVi: string; nameEn: string } | null;
};

export function ComparePageClient() {
  const locale = useLocale();
  const t = useTranslations("parts");
  const compareIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [parts, setParts] = useState<PartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareIds.length === 0) return;

    let cancelled = false;

    async function loadParts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/parts?ids=${compareIds.join(",")}`);
        const data = await res.json();
        const order = new Map(compareIds.map((id, i) => [id, i]));
        const sorted = [...(data.parts as PartData[])].sort(
          (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
        );
        if (!cancelled) setParts(sorted);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadParts();
    return () => {
      cancelled = true;
    };
  }, [compareIds]);

  if (compareIds.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-steel-300 p-12 text-center dark:border-navy-700">
        <p className="mb-4 text-sm text-steel-600 dark:text-steel-300">{t("compareEmpty")}</p>
        <Link
          href="/parts"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-500 px-6 text-sm font-semibold text-white hover:bg-red-600"
        >
          {t("compareBackToCatalog")}
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-steel-400" aria-hidden="true" />
      </div>
    );
  }

  const allLabels = Array.from(
    new Set(parts.flatMap((p) => (p.specs ?? []).map((s) => s.label)))
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-steel-200 p-3 text-left align-bottom text-xs font-bold uppercase tracking-wide text-steel-500 dark:border-navy-800 dark:text-steel-400">
              {t("compareSpecColumn")}
            </th>
            {parts.map((part) => {
              const name = localize(locale, part.nameVi, part.nameEn);
              const craneModelName = part.craneModel
                ? localize(locale, part.craneModel.nameVi, part.craneModel.nameEn)
                : t("universalModel");
              return (
                <th
                  key={part.id}
                  className="min-w-[200px] border-b border-steel-200 p-3 text-left align-bottom dark:border-navy-800"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/parts/${part.id}`} className="group">
                      <div className="mb-2 flex h-20 w-20 items-center justify-center rounded-lg bg-steel-50 dark:bg-navy-900">
                        <PartIcon
                          variant={(part.image || "gear") as PartIconVariant}
                          className="h-10 w-10 text-navy-800 dark:text-steel-300"
                        />
                      </div>
                      <p className="text-sm font-bold text-navy-900 group-hover:text-red-600 dark:text-white">
                        {name}
                      </p>
                      <p className="text-xs text-steel-500 dark:text-steel-400">
                        {part.sku} · {craneModelName}
                      </p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(part.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-steel-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Xóa khỏi so sánh"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {allLabels.length === 0 ? (
            <tr>
              <td
                colSpan={parts.length + 1}
                className="p-6 text-center text-sm text-steel-500 dark:text-steel-400"
              >
                {t("compareNoSpecs")}
              </td>
            </tr>
          ) : (
            allLabels.map((label) => (
              <tr key={label}>
                <td className="border-b border-steel-100 p-3 text-xs font-semibold text-steel-600 dark:border-navy-800 dark:text-steel-300">
                  {label}
                </td>
                {parts.map((part) => {
                  const spec = (part.specs ?? []).find((s) => s.label === label);
                  return (
                    <td
                      key={part.id}
                      className="border-b border-steel-100 p-3 text-navy-900 dark:border-navy-800 dark:text-white"
                    >
                      {spec?.value ?? "—"}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
