import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, Droplet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/localize";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { ProductImage } from "@/components/ui/ProductImage";

export const dynamic = "force-dynamic";

const typeKeys: Record<string, string> = {
  ENGINE_OIL: "typeEngineOil",
  HYDRAULIC_OIL: "typeHydraulicOil",
  GEAR_OIL: "typeGearOil",
  GREASE: "typeGrease",
  OTHER: "typeOther",
};

async function getLubricant(id: string) {
  return prisma.lubricant.findUnique({ where: { id } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const lubricant = await getLubricant(id);
  if (!lubricant) return {};
  const name = localize(locale, lubricant.nameVi, lubricant.nameEn);
  const desc = localize(locale, lubricant.descriptionVi, lubricant.descriptionEn);
  return { title: name, description: desc };
}

export default async function LubricantDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("lubricants");

  const lubricant = await getLubricant(id);
  if (!lubricant) notFound();

  const name = localize(locale, lubricant.nameVi, lubricant.nameEn);
  const description = localize(locale, lubricant.descriptionVi, lubricant.descriptionEn);
  const typeLabel = t(typeKeys[lubricant.type] ?? "typeOther");

  return (
    <section className="py-12">
      <Container>
        <Link
          href="/parts?tab=lubricants"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900 dark:text-steel-300 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t("backToCatalog")}
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-steel-50 dark:bg-navy-900">
            <ProductImage
              src={lubricant.image}
              alt={name}
              width={400}
              height={400}
              imageClassName="h-full w-full object-contain p-8"
              fallbackIcon={
                <Droplet className="h-32 w-32 text-navy-800 dark:text-steel-300" aria-hidden="true" />
              }
            />
          </div>

          <div>
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
              {typeLabel}
            </span>
            <h1 className="mb-4 text-3xl font-bold text-navy-900 dark:text-white">{name}</h1>
            <dl className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-steel-100 bg-steel-50 p-5 text-sm dark:border-navy-800 dark:bg-navy-900">
              <div>
                <dt className="font-semibold text-steel-500 dark:text-steel-400">{t("brand")}</dt>
                <dd className="text-navy-900 dark:text-white">{lubricant.brand ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-steel-500 dark:text-steel-400">{t("packaging")}</dt>
                <dd className="text-navy-900 dark:text-white">{lubricant.packaging ?? "—"}</dd>
              </div>
            </dl>
            {description && (
              <p className="mb-8 text-sm leading-relaxed text-steel-700 dark:text-steel-300">
                {description}
              </p>
            )}

            <div className="rounded-xl border border-steel-100 bg-white p-6 dark:border-navy-800 dark:bg-navy-900">
              <h2 className="mb-4 text-base font-bold text-navy-900 dark:text-white">
                {t("requestQuote")}
              </h2>
              <InquiryForm type="QUOTE" lubricantId={lubricant.id} partLabel={name} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
