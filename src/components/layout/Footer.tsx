import { useTranslations, useLocale } from "next-intl";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const address = locale === "vi" ? siteConfig.addressVi : siteConfig.addressEn;

  const links = [
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/parts", label: t("nav.parts") },
    { href: "/news", label: t("nav.news") },
    { href: "/quote", label: t("nav.quote") },
  ];

  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-steel-300">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">{t("footer.tagline")}</p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
            {t("footer.linksTitle")}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="min-h-11 inline-flex items-center hover:text-red-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
            {t("footer.contactTitle")}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
              <a href={`tel:${siteConfig.hotlineHref}`} className="hover:text-red-400">
                {siteConfig.hotline}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-red-400">
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">
            {t("contact.hoursTitle")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>{t("contact.hoursWeekday")}</li>
            <li>{t("contact.hoursSaturday")}</li>
            <li className="font-semibold text-red-400">{t("contact.hoursEmergency")}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-navy-800">
        <Container className="flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. {t("footer.rights")}
          </p>
          <p className="text-steel-500">{t("footer.disclaimer")}</p>
        </Container>
      </div>
    </footer>
  );
}
