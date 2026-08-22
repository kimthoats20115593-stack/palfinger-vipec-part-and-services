import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { ButtonLink } from "@/components/ui/Button";

export function ServicesPreview() {
  const t = useTranslations("home");

  return (
    <section className="bg-white py-20 dark:bg-navy-950">
      <Container>
        <SectionHeading
          title={t("servicesTitle")}
          subtitle={t("servicesSubtitle")}
          align="center"
        />
        <div className="mt-10">
          <ServicesGrid limit={3} />
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/services" variant="ghost">
            {t("servicesCta")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
