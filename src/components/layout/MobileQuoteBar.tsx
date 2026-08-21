"use client";

import { useTranslations } from "next-intl";
import { Phone, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function MobileQuoteBar() {
  const t = useTranslations("nav");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-steel-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
      <a
        href={`tel:${siteConfig.hotlineHref}`}
        className="flex min-h-14 items-center justify-center gap-2 border-r border-steel-200 text-sm font-semibold text-navy-900"
      >
        <Phone className="h-4 w-4" aria-hidden="true" />
        {t("hotline")}
      </a>
      <Link
        href="/quote"
        className="flex min-h-14 items-center justify-center gap-2 bg-orange-500 text-sm font-semibold text-white"
      >
        <FileText className="h-4 w-4" aria-hidden="true" />
        {t("quote")}
      </Link>
    </div>
  );
}
