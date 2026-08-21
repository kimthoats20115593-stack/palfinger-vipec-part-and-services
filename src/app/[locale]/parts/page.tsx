import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PartsExplorer } from "@/components/parts/PartsExplorer";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "parts" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function PartsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("parts");

  const [parts, categories] = await Promise.all([
    prisma.part.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16">
        <Container>
          <PartsExplorer parts={parts} categories={categories} />
        </Container>
      </section>

      <section className="border-t border-steel-100 bg-steel-50 py-16">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-bold text-navy-900">{t("notListedTitle")}</h2>
          <p className="max-w-xl text-sm leading-relaxed text-steel-700">
            {t("notListedDesc")}
          </p>
          <ButtonLink href="/quote" variant="primary">
            {t("requestQuote")}
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
