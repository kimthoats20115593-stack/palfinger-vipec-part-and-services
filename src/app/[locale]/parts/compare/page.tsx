import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ComparePageClient } from "@/components/parts/ComparePageClient";
import { getTranslations } from "next-intl/server";

export default async function ComparePartsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("parts");

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("compareTitle")} subtitle={t("compareSubtitle")} />
      <section className="py-16">
        <Container>
          <ComparePageClient />
        </Container>
      </section>
    </>
  );
}
