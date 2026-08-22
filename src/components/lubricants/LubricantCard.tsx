import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Droplet } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/localize";
import { ProductImage } from "@/components/ui/ProductImage";

type LubricantCardData = {
  id: string;
  nameVi: string;
  nameEn: string;
  brand: string | null;
  image: string | null;
};

export function LubricantCard({ lubricant }: { lubricant: LubricantCardData }) {
  const locale = useLocale();
  const t = useTranslations("lubricants");
  const name = localize(locale, lubricant.nameVi, lubricant.nameEn);

  return (
    <Link
      href={`/lubricants/${lubricant.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-steel-100 bg-white transition-shadow hover:shadow-lg hover:shadow-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 dark:focus-visible:outline-white dark:border-navy-800 dark:bg-navy-900"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-steel-50 dark:bg-navy-950">
        <ProductImage
          src={lubricant.image}
          alt={name}
          width={300}
          height={300}
          imageClassName="h-full w-full object-contain p-4"
          fallbackIcon={
            <Droplet className="h-14 w-14 text-navy-800 dark:text-steel-300" aria-hidden="true" />
          }
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {lubricant.brand && (
          <span className="mb-1 text-[11px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
            {lubricant.brand}
          </span>
        )}
        <h3 className="mb-3 text-base font-bold text-navy-900 dark:text-white">{name}</h3>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-red-600">
          {t("requestQuote")}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
