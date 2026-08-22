import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/localize";
import { PartIcon, type PartIconVariant } from "@/components/illustrations/PartIcon";
import { CompareCheckbox } from "@/components/parts/CompareCheckbox";

type PartCardData = {
  id: string;
  sku: string;
  nameVi: string;
  nameEn: string;
  image: string;
  craneModel?: { nameVi: string; nameEn: string } | null;
  category: { nameVi: string; nameEn: string };
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

  return (
    <Link
      href={`/parts/${part.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-steel-100 bg-white transition-shadow hover:shadow-lg hover:shadow-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 dark:focus-visible:outline-white dark:border-navy-800 dark:bg-navy-900"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-steel-50 dark:bg-navy-950">
        <PartIcon variant={iconVariant} className="h-16 w-16 text-navy-800 dark:text-steel-300" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-1 text-[11px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
          {categoryName}
        </span>
        <h3 className="mb-1 text-base font-bold text-navy-900 dark:text-white">{name}</h3>
        <p className="mb-3 text-xs text-steel-500 dark:text-steel-400">
          {t("sku")}: {part.sku} · {craneModelName}
        </p>
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
