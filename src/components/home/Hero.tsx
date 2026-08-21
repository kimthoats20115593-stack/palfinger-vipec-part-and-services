import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Wrench, Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CraneHero } from "@/components/illustrations/CraneHero";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-navy-900">
      <Container className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-orange-400">
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
            <Clock className="h-4 w-4 text-orange-400" aria-hidden="true" />
            {t("statResponse")}: 24h
          </div>
        </div>

        <div className="relative">
          <CraneHero className="w-full rounded-2xl shadow-2xl shadow-black/30" />
        </div>
      </Container>
    </section>
  );
}
