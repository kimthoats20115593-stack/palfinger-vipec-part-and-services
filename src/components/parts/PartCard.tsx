import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/localize";
import { PartIcon, type PartIconVariant } from "@/components/illustrations/PartIcon";

type PartCardData = {
  id: string;
  sku: string;
  nameVi: string;
  nameEn: string;
  craneModel: string;
  image: string;
  category: { nameVi: string; nameEn: string };
};

export function PartCard({ part }: { part: PartCardData }) {
  const locale = useLocale();
  const t = useTranslations("parts");
  const name = localize(locale, part.nameVi, part.nameEn);
  const categoryName = localize(locale, part.category.nameVi, part.category.nameEn);
  const iconVariant = (part.image || "gear") as PartIconVariant;

  return (
    <Link
      href={`/parts/${part.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-steel-100 bg-white transition-shadow hover:shadow-lg hover:shadow-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-steel-50">
        <PartIcon variant={iconVariant} className="h-16 w-16 text-navy-800" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-1 text-[11px] font-bold uppercase tracking-wide text-orange-600">
          {categoryName}
        </span>
        <h3 className="mb-1 text-base font-bold text-navy-900">{name}</h3>
        <p className="mb-3 text-xs text-steel-500">
          {t("sku")}: {part.sku} · {part.craneModel}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
          {t("requestQuote")}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
