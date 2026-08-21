import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { InquiryForm } from "@/components/forms/InquiryForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quote" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ partId?: string; part?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quote");
  const sp = await searchParams;

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <Container className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-steel-100 bg-white p-6 shadow-sm sm:p-10">
            <InquiryForm type="QUOTE" partId={sp.partId} partLabel={sp.part} />
          </div>
        </Container>
      </section>
    </>
  );
}
