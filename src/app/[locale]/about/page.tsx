import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Users2, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CraneShowcase } from "@/components/illustrations/CraneShowcase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("intro") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const capabilities = [t("cap1"), t("cap2"), t("cap3"), t("cap4")];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("intro")} />

      <section className="py-16">
        <Container className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-steel-100 p-8 dark:border-navy-800">
            <Target className="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
            <h2 className="mb-3 mt-4 text-xl font-bold text-navy-900 dark:text-white">
              {t("missionTitle")}
            </h2>
            <p className="text-base leading-relaxed text-steel-700 dark:text-steel-300">{t("missionDesc")}</p>
          </div>
          <div className="rounded-xl border border-steel-100 p-8 dark:border-navy-800">
            <Eye className="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
            <h2 className="mb-3 mt-4 text-xl font-bold text-navy-900 dark:text-white">
              {t("visionTitle")}
            </h2>
            <p className="text-base leading-relaxed text-steel-700 dark:text-steel-300">{t("visionDesc")}</p>
          </div>
        </Container>
      </section>

      <section className="bg-steel-50 py-16 dark:bg-navy-900">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-navy-900 dark:text-white">
              {t("capabilitiesTitle")}
            </h2>
            <ul className="space-y-4">
              {capabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                    aria-hidden="true"
                  />
                  <span className="text-base leading-relaxed text-steel-700 dark:text-steel-300">{cap}</span>
                </li>
              ))}
            </ul>
          </div>
          <CraneShowcase
            src="https://vipec-vp.vn/wp-content/uploads/2025/10/2-4.png"
            alt={t("showcaseImageAlt")}
            priority
            className="w-full shadow-xl shadow-navy-900/10 dark:shadow-black/30"
          />
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Users2 className="h-10 w-10 text-red-600 dark:text-red-400" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white">{t("teamTitle")}</h2>
          <p className="max-w-2xl text-base leading-relaxed text-steel-700 dark:text-steel-300">
            {t("teamDesc")}
          </p>
          <div className="mt-4 w-full overflow-hidden rounded-2xl shadow-xl shadow-navy-900/10 dark:shadow-black/30">
            <Image
              src="/about-team.jpg"
              alt={t("teamImageAlt")}
              width={1800}
              height={1013}
              className="w-full"
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-steel-100 bg-steel-50 py-10 dark:border-navy-800 dark:bg-navy-900">
        <Container>
          <div className="mx-auto max-w-2xl rounded-lg border border-steel-200 bg-white p-6 text-center dark:border-navy-700 dark:bg-navy-950">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-steel-500 dark:text-steel-400">
              {t("noteTitle")}
            </p>
            <p className="text-sm text-steel-600 dark:text-steel-300">{t("noteDesc")}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
