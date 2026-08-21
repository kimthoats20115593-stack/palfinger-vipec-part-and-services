import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");

  const steps = [t("process1"), t("process2"), t("process3"), t("process4")];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16">
        <Container>
          <ServicesGrid />
        </Container>
      </section>

      <section className="bg-navy-950 py-16">
        <Container>
          <h2 className="mb-10 text-center text-2xl font-bold text-white">
            {t("processTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step} className="relative rounded-xl border border-navy-700 bg-navy-900 p-6">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm font-semibold text-white">{step}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-navy-900">{t("ctaTitle")}</h2>
          <ButtonLink href="/quote" variant="primary">
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
