import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/localize";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { PartIcon, type PartIconVariant } from "@/components/illustrations/PartIcon";
import { PartCard } from "@/components/parts/PartCard";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const dynamic = "force-dynamic";

async function getPart(id: string) {
  return prisma.part.findUnique({
    where: { id },
    include: { category: true, craneModel: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const part = await getPart(id);
  if (!part) return {};
  const name = localize(locale, part.nameVi, part.nameEn);
  const desc = localize(locale, part.descriptionVi, part.descriptionEn);
  return { title: name, description: desc };
}

export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("parts");

  const part = await getPart(id);
  if (!part) notFound();

  const name = localize(locale, part.nameVi, part.nameEn);
  const description = localize(locale, part.descriptionVi, part.descriptionEn);
  const categoryName = localize(locale, part.category.nameVi, part.category.nameEn);
  const craneModelName = part.craneModel
    ? localize(locale, part.craneModel.nameVi, part.craneModel.nameEn)
    : t("universalModel");
  const specs = Array.isArray(part.specs)
    ? (part.specs as unknown as { label: string; value: string }[])
    : [];

  const related = await prisma.part.findMany({
    where: { categoryId: part.categoryId, id: { not: part.id } },
    include: { category: true, craneModel: true },
    take: 3,
  });

  return (
    <section className="py-12">
      <Container>
        <Link
          href="/parts"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900 dark:text-steel-300 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t("backToCatalog")}
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-steel-50 dark:bg-navy-900">
            <PartIcon
              variant={(part.image || "gear") as PartIconVariant}
              className="h-40 w-40 text-navy-800 dark:text-steel-300"
            />
          </div>

          <div>
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
              {categoryName}
            </span>
            <h1 className="mb-4 text-3xl font-bold text-navy-900 dark:text-white">{name}</h1>
            <dl className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-steel-100 bg-steel-50 p-5 text-sm dark:border-navy-800 dark:bg-navy-900">
              <div>
                <dt className="font-semibold text-steel-500 dark:text-steel-400">{t("sku")}</dt>
                <dd className="text-navy-900 dark:text-white">{part.sku}</dd>
              </div>
              <div>
                <dt className="font-semibold text-steel-500 dark:text-steel-400">{t("craneModel")}</dt>
                <dd className="text-navy-900 dark:text-white">{craneModelName}</dd>
              </div>
            </dl>
            <p className="mb-8 text-sm leading-relaxed text-steel-700 dark:text-steel-300">{description}</p>

            {specs.length > 0 && (
              <div className="mb-8 overflow-hidden rounded-lg border border-steel-100 dark:border-navy-800">
                <h2 className="border-b border-steel-100 bg-steel-50 px-4 py-2.5 text-sm font-bold text-navy-900 dark:border-navy-800 dark:bg-navy-900 dark:text-white">
                  {t("specsTitle")}
                </h2>
                <dl className="divide-y divide-steel-100 dark:divide-navy-800">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                      <dt className="text-steel-600 dark:text-steel-400">{spec.label}</dt>
                      <dd className="text-right font-semibold text-navy-900 dark:text-white">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="rounded-xl border border-steel-100 bg-white p-6 dark:border-navy-800 dark:bg-navy-900">
              <h2 className="mb-4 text-base font-bold text-navy-900 dark:text-white">
                {t("requestQuote")}
              </h2>
              <InquiryForm type="QUOTE" partId={part.id} partLabel={`${name} (${part.sku})`} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 text-xl font-bold text-navy-900 dark:text-white">{t("relatedParts")}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PartCard key={p.id} part={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
