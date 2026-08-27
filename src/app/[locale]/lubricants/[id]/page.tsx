import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, Droplet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/localize";
import { siteConfig } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { PartGallery } from "@/components/parts/PartGallery";
import { ProductContactActions } from "@/components/products/ProductContactActions";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { LubricantCard } from "@/components/lubricants/LubricantCard";

export const dynamic = "force-dynamic";

const zaloHref = `https://zalo.me/${siteConfig.hotlineHref.replace("+", "")}`;

const typeKeys: Record<string, string> = {
  ENGINE_OIL: "typeEngineOil",
  HYDRAULIC_OIL: "typeHydraulicOil",
  GEAR_OIL: "typeGearOil",
  GREASE: "typeGrease",
  OTHER: "typeOther",
};

async function getLubricant(id: string) {
  return prisma.lubricant.findFirst({
    where: { id, published: true },
    include: { images: { orderBy: { order: "asc" } } },
  });
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
  const detail = localize(locale, lubricant.detailVi ?? "", lubricant.detailEn ?? "");
  const galleryImages =
    lubricant.images.length > 0
      ? lubricant.images.map((img) => img.url)
      : lubricant.image
        ? [lubricant.image]
        : [];

  const related = await prisma.lubricant.findMany({
    where: { type: lubricant.type, id: { not: lubricant.id }, published: true },
    take: 3,
  });

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
          <PartGallery
            images={galleryImages}
            alt={name}
            fallback={
              <Droplet className="h-40 w-40 text-navy-800 dark:text-steel-300" aria-hidden="true" />
            }
          />

          <div>
            <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
              {typeLabel}
            </span>
            <h1 className="mb-3 text-3xl font-bold text-navy-900 dark:text-white">{name}</h1>

            <ProductContactActions
              lubricantId={lubricant.id}
              productLabel={name}
              callLabel={t("callToOrder")}
              zaloLabel={t("zaloConsult")}
              zaloHref={zaloHref}
              modalTitle={t("quoteFormTitle")}
              modalSubtitle={t("quoteFormSubtitle")}
            />

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
              <p className="mb-6 text-sm leading-relaxed text-steel-700 dark:text-steel-300">
                {description}
              </p>
            )}
          </div>
        </div>

        {detail && (
          <div className="mt-16 border-t border-steel-100 pt-12 dark:border-navy-800">
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-navy-900 dark:text-white">
              {t("productDetail")}
            </h2>
            <MarkdownContent content={detail} className="max-w-3xl" />
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-navy-900 dark:text-white">
              <span className="h-6 w-1 rounded-full bg-red-500" aria-hidden="true" />
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((lb) => (
                <LubricantCard key={lb.id} lubricant={lb} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
