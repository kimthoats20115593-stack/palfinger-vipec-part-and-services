import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const address = locale === "vi" ? siteConfig.addressVi : siteConfig.addressEn;

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="py-16">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-lg font-bold text-navy-900">{t("officeTitle")}</h2>
            <ul className="mb-8 space-y-4 text-sm text-steel-700">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
                {address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
                <a href={`tel:${siteConfig.hotlineHref}`} className="hover:text-orange-600">
                  {siteConfig.hotline}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-orange-600" aria-hidden="true" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-orange-600">
                  {siteConfig.email}
                </a>
              </li>
            </ul>

            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-navy-900">
              <Clock className="h-5 w-5 text-orange-600" aria-hidden="true" />
              {t("hoursTitle")}
            </h2>
            <ul className="mb-8 space-y-2 text-sm text-steel-700">
              <li>{t("hoursWeekday")}</li>
              <li>{t("hoursSaturday")}</li>
              <li className="font-semibold text-orange-600">{t("hoursEmergency")}</li>
            </ul>

            <div className="overflow-hidden rounded-xl border border-steel-100">
              <iframe
                src={siteConfig.mapEmbedUrl}
                title="Bản đồ văn phòng PALFINGER VIPEC"
                width="100%"
                height="240"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-steel-100 bg-white p-6 shadow-sm sm:p-10">
              <h2 className="mb-6 text-lg font-bold text-navy-900">{t("formTitle")}</h2>
              <InquiryForm type="CONTACT" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
