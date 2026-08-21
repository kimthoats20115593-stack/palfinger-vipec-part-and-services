import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { PartsShowcase } from "@/components/home/PartsShowcase";
import { WhyUs } from "@/components/home/WhyUs";
import { NewsPreview } from "@/components/home/NewsPreview";
import { CtaBanner } from "@/components/home/CtaBanner";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <StatsBar />
      <ServicesPreview />
      <PartsShowcase />
      <WhyUs />
      <NewsPreview />
      <CtaBanner />
    </>
  );
}
