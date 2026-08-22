import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Wrench, Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <Container className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-yellow-400">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {t("heroEyebrow")}
          </p>
          <h1 className="whitespace-pre-line text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-steel-200">
            {t("heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/quote" variant="primary">
              {t("heroCtaPrimary")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href="/parts"
              variant="ghost"
              className="border-white/25 text-white hover:bg-white/10"
            >
              <Wrench className="h-4 w-4" aria-hidden="true" />
              {t("heroCtaSecondary")}
            </ButtonLink>
          </div>
          <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-steel-300">
            <Clock className="h-4 w-4 text-yellow-400" aria-hidden="true" />
            {t("statResponse")}: 48h
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-800 to-navy-900 shadow-2xl shadow-black/30">
          <div
            className="pointer-events-none absolute -right-8 -top-6 h-40 w-40 rounded-full bg-white/5"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-10 top-12 h-24 w-24 rounded-full bg-white/5"
            aria-hidden="true"
          />
          <div className="relative flex items-end justify-center px-6 pt-10 sm:px-10">
            <Image
              src="https://vipec-vp.vn/wp-content/uploads/2025/10/1-4.png"
              alt={t("heroImageAlt")}
              width={1920}
              height={1080}
              priority
              className="w-full max-w-xl drop-shadow-2xl"
            />
          </div>
          <div className="relative mt-2 border-t-4 border-navy-700 bg-navy-950 py-9">
            <div
              className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-navy-600/50"
              aria-hidden="true"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
