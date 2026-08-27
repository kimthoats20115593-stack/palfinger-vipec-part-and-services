import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/localize";
import { formatVnd } from "@/lib/format";
import { PartIcon, type PartIconVariant } from "@/components/illustrations/PartIcon";
import { CompareCheckbox } from "@/components/parts/CompareCheckbox";
import { ProductImage } from "@/components/ui/ProductImage";

type PartCardData = {
  id: string;
  sku: string;
  nameVi: string;
  nameEn: string;
  image: string;
  photoUrl?: string | null;
  craneModel?: { nameVi: string; nameEn: string } | null;
  category: { nameVi: string; nameEn: string };
  price?: number | null;
  status?: string | null;
  unit?: string | null;
  stockQty?: number | null;
  inStock?: boolean;
};

export function PartCard({ part }: { part: PartCardData }) {
  const locale = useLocale();
  const t = useTranslations("parts");
  const name = localize(locale, part.nameVi, part.nameEn);
  const categoryName = localize(locale, part.category.nameVi, part.category.nameEn);
  const craneModelName = part.craneModel
    ? localize(locale, part.craneModel.nameVi, part.craneModel.nameEn)
    : t("universalModel");
  const iconVariant = (part.image || "gear") as PartIconVariant;
  const hasStockInfo = part.stockQty !== null && part.stockQty !== undefined;
  const inStock = part.inStock ?? true;

  return (
    <Link
      href={`/parts/${part.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-steel-100 bg-white transition-shadow hover:shadow-lg hover:shadow-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 dark:focus-visible:outline-white dark:border-navy-800 dark:bg-navy-900"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-steel-50 dark:bg-navy-950">
        <ProductImage
          src={part.photoUrl}
          alt={name}
          width={400}
          height={300}
          imageClassName="h-full w-full object-contain p-4"
          fallbackIcon={
            <PartIcon variant={iconVariant} className="h-16 w-16 text-navy-800 dark:text-steel-300" />
          }
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
            {categoryName}
          </span>
          {part.status && (
            <span className="shrink-0 rounded-full border border-steel-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-steel-600 dark:border-navy-700 dark:text-steel-300">
              {part.status}
            </span>
          )}
        </div>
        <h3 className="mb-1 text-base font-bold text-navy-900 dark:text-white">{name}</h3>
        <p className="mb-3 text-xs text-steel-500 dark:text-steel-400">
          {t("sku")}: {part.sku} · {craneModelName}
        </p>

        {(part.price || hasStockInfo) && (
          <div className="mb-3 flex items-center justify-between gap-2">
            {part.price ? (
              <span className="font-display text-base font-bold text-navy-900 dark:text-white">
                {formatVnd(part.price, locale)}
              </span>
            ) : (
              <span />
            )}
            {hasStockInfo && (
              <span
                className={
                  inStock
                    ? "text-xs font-semibold text-green-700 dark:text-green-400"
                    : "text-xs font-semibold text-red-600 dark:text-red-400"
                }
              >
                {inStock
                  ? `${t("inStock")}${part.unit ? ` · ${part.stockQty} ${part.unit}` : ` (${part.stockQty})`}`
                  : t("outOfStock")}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
            {t("requestQuote")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
          <CompareCheckbox id={part.id} label={t("compare")} />
        </div>
      </div>
    </Link>
  );
}
