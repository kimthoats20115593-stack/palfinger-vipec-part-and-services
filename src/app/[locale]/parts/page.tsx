import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { PartsExplorer } from "@/components/parts/PartsExplorer";
import { LubricantsExplorer } from "@/components/lubricants/LubricantsExplorer";
import { ButtonLink } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";

export const dynamic = "force-dynamic";

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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string; model?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("parts");
  const sp = await searchParams;
  const activeTab = sp.tab === "lubricants" ? "lubricants" : "models";

  const tabClasses = (active: boolean) =>
    clsx(
      "min-h-11 rounded-full px-5 py-2 text-sm font-semibold transition-colors",
      active
        ? "bg-navy-900 text-white dark:bg-white dark:text-navy-900"
        : "text-steel-600 hover:bg-steel-100 dark:text-steel-300 dark:hover:bg-navy-800"
    );

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16">
        <Container>
          <div className="mb-8 inline-flex gap-1 rounded-full border border-steel-200 p-1 dark:border-navy-700">
            <Link href="/parts" className={tabClasses(activeTab === "models")}>
              {t("tabModels")}
            </Link>
            <Link href="/parts?tab=lubricants" className={tabClasses(activeTab === "lubricants")}>
              {t("tabLubricants")}
            </Link>
          </div>

          {activeTab === "models" ? <PartsTabContent /> : <LubricantsTabContent />}
        </Container>
      </section>

      <section className="border-t border-steel-100 bg-steel-50 py-16 dark:border-navy-800 dark:bg-navy-900">
        <Container className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white">{t("notListedTitle")}</h2>
          <p className="max-w-xl text-sm leading-relaxed text-steel-700 dark:text-steel-300">
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

async function PartsTabContent() {
  const [parts, categories, craneModels] = await Promise.all([
    prisma.part.findMany({
      where: { published: true },
      include: { category: true, craneModel: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.craneModel.findMany({ orderBy: { order: "asc" } }),
  ]);

  return <PartsExplorer parts={parts} categories={categories} craneModels={craneModels} />;
}

async function LubricantsTabContent() {
  const lubricants = await prisma.lubricant.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return <LubricantsExplorer lubricants={lubricants} />;
}
