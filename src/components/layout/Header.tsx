"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Phone } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import clsx from "clsx";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/parts", label: t("parts") },
    { href: "/news", label: t("news") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-steel-100 bg-white/95 backdrop-blur dark:border-navy-800 dark:bg-navy-950/95">
      <div className="hidden border-b border-steel-100 bg-navy-950 text-steel-200 dark:border-navy-800 md:block">
        <Container className="flex h-9 items-center justify-end gap-6 text-xs">
          <a
            href={`tel:${siteConfig.hotlineHref}`}
            className="flex items-center gap-1.5 font-semibold text-white hover:text-red-400"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {t("hotline")}: {siteConfig.hotline}
          </a>
          <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
            {siteConfig.email}
          </a>
        </Container>
      </div>

      <Container className="flex h-18 items-center justify-between gap-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 dark:focus-visible:outline-white",
                  active
                    ? "text-red-600"
                    : "text-navy-900 hover:text-red-600 dark:text-white dark:hover:text-red-400"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <LocaleSwitcher />
          <ButtonLink href="/quote" variant="primary">
            {t("quote")}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-md text-navy-900 dark:text-white"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-steel-100 bg-white dark:border-navy-800 dark:bg-navy-950 lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="min-h-11 rounded-md px-3 py-2.5 text-base font-semibold text-navy-900 hover:bg-steel-50 dark:text-white dark:hover:bg-navy-900"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-steel-100 pt-4 dark:border-navy-800">
              <LocaleSwitcher />
              <ButtonLink href="/quote" variant="primary" className="flex-1">
                {t("quote")}
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
