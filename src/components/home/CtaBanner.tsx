import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBanner() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-yellow-500 py-16">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #0b2545 0, #0b2545 2px, transparent 2px, transparent 18px)",
        }}
        aria-hidden="true"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-xl text-3xl font-bold text-navy-950 sm:text-4xl">
          {t("ctaTitle")}
        </h2>
        <p className="max-w-lg text-base text-navy-800">{t("ctaSubtitle")}</p>
        <ButtonLink href="/quote" variant="primary">
          {t("ctaButton")}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </ButtonLink>
      </Container>
    </section>
  );
}
