import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/localize";
import { formatVnd } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { PartIcon, type PartIconVariant } from "@/components/illustrations/PartIcon";
import { PartCard } from "@/components/parts/PartCard";
import { PartGallery } from "@/components/parts/PartGallery";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const dynamic = "force-dynamic";

const zaloHref = `https://zalo.me/${siteConfig.hotlineHref.replace("+", "")}`;

async function getPart(id: string) {
  return prisma.part.findUnique({
    where: { id },
    include: { category: true, craneModel: true, images: { orderBy: { order: "asc" } } },
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
  const detail = localize(locale, part.detailVi ?? "", part.detailEn ?? "");
  const galleryImages =
    part.images.length > 0 ? part.images.map((img) => img.url) : part.photoUrl ? [part.photoUrl] : [];

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
          <PartGallery
            images={galleryImages}
            alt={name}
            fallback={
              <PartIcon
                variant={(part.image || "gear") as PartIconVariant}
                className="h-40 w-40 text-navy-800 dark:text-steel-300"
              />
            }
          />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                {categoryName}
              </span>
              {part.status && (
                <span className="rounded-full border border-steel-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-steel-600 dark:border-navy-700 dark:text-steel-300">
                  {part.status}
                </span>
              )}
            </div>
            <h1 className="mb-3 text-3xl font-bold text-navy-900 dark:text-white">{name}</h1>

            {(part.price || part.stockQty !== null) && (
              <div className="mb-4 flex items-center gap-4">
                {part.price && (
                  <span className="font-display text-2xl font-bold text-navy-900 dark:text-white">
                    {formatVnd(part.price, locale)}
                  </span>
                )}
                {part.stockQty !== null && (
                  <span
                    className={
                      part.stockQty > 0
                        ? "text-sm font-semibold text-green-700 dark:text-green-400"
                        : "text-sm font-semibold text-red-600 dark:text-red-400"
                    }
                  >
                    {part.stockQty > 0
                      ? `${t("inStock")}${part.unit ? ` · ${part.stockQty} ${part.unit}` : ` (${part.stockQty})`}`
                      : t("outOfStock")}
                  </span>
                )}
              </div>
            )}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${siteConfig.hotlineHref}`}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-red-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {t("callToOrder")}
              </a>
              <a
                href={zaloHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-steel-200 px-6 text-sm font-semibold text-navy-900 transition-colors hover:border-[#0068ff] hover:text-[#0068ff] dark:border-navy-700 dark:text-white"
              >
                {t("zaloConsult")}
              </a>
            </div>

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

            <div className="rounded-xl border border-steel-100 bg-steel-50/60 p-6 dark:border-navy-800 dark:bg-navy-900/60">
              <h2 className="mb-1 text-base font-bold text-navy-900 dark:text-white">
                {t("quoteFormTitle")}
              </h2>
              <p className="mb-4 text-xs text-steel-500 dark:text-steel-400">
                {t("quoteFormSubtitle")}
              </p>
              <InquiryForm type="QUOTE" partId={part.id} partLabel={`${name} (${part.sku})`} />
            </div>
          </div>
        </div>

        {detail && (
          <div className="mt-16 border-t border-steel-100 pt-12 dark:border-navy-800">
            <h2 className="mb-6 text-2xl font-bold uppercase tracking-wide text-navy-900 dark:text-white">
              {t("productDetail")}
            </h2>
            <div className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-steel-700 dark:text-steel-300">
              {detail}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-navy-900 dark:text-white">
              <span className="h-6 w-1 rounded-full bg-red-500" aria-hidden="true" />
              {t("relatedParts")}
            </h2>
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
