import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { CostEstimator } from "@/components/services/CostEstimator";
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

  const steps = [
    { title: t("process1Title"), desc: t("process1Desc") },
    { title: t("process2Title"), desc: t("process2Desc") },
    { title: t("process3Title"), desc: t("process3Desc") },
    { title: t("process4Title"), desc: t("process4Desc") },
  ];

  return (
    <>
      <section className="border-b border-navy-800 bg-navy-900 py-16">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
              {t("eyebrow")}
            </p>
            <h1 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">{t("title")}</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-steel-200">
              {t("subtitle")}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/30">
            <Image
              src="/services-technician.jpg"
              alt={t("heroImageAlt")}
              width={1600}
              height={1067}
              priority
              className="w-full"
            />
          </div>
        </Container>
      </section>

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
              <div key={step.title} className="relative rounded-xl border border-navy-700 bg-navy-900 p-6">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="mb-1.5 text-sm font-semibold text-white">{step.title}</p>
                <p className="text-xs leading-relaxed text-steel-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CostEstimator />

      <section className="py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white">{t("ctaTitle")}</h2>
          <ButtonLink href="/quote" variant="primary">
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
