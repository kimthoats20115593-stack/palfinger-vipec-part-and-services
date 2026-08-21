import { useTranslations } from "next-intl";
import { BadgeCheck, Users, MapPinned, Handshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const items = [
  { icon: BadgeCheck, titleKey: "why1Title", descKey: "why1Desc" },
  { icon: Users, titleKey: "why2Title", descKey: "why2Desc" },
  { icon: MapPinned, titleKey: "why3Title", descKey: "why3Desc" },
  { icon: Handshake, titleKey: "why4Title", descKey: "why4Desc" },
];

export function WhyUs() {
  const t = useTranslations("home");

  return (
    <section className="bg-steel-50 py-20">
      <Container>
        <SectionHeading title={t("whyTitle")} align="center" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.titleKey} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-base font-bold text-navy-900">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm leading-relaxed text-steel-700">
                  {t(item.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
