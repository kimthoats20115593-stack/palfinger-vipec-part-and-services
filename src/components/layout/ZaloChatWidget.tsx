"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, X, FileText, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

const zaloHref = `https://zalo.me/${siteConfig.hotlineHref.replace("+", "")}`;

export function ZaloChatWidget() {
  const t = useTranslations("chatWidget");
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6">
      {open && (
        <div className="absolute bottom-full right-0 mb-3 w-72 overflow-hidden rounded-2xl border border-steel-200 bg-white shadow-xl dark:border-navy-700 dark:bg-navy-900 sm:w-80">
          <div className="flex items-start justify-between gap-2 bg-navy-950 px-4 py-3.5">
            <div>
              <p className="font-display text-sm font-semibold text-white">{t("title")}</p>
              <p className="mt-1 text-xs leading-relaxed text-steel-300">{t("subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-steel-300 hover:bg-white/10 hover:text-white"
              aria-label={t("toggleClose")}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-2 p-3">
            <a
              href={zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-steel-200 p-3 transition-colors hover:border-[#0068ff] hover:bg-[#0068ff]/5 dark:border-navy-700 dark:hover:bg-[#0068ff]/10"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0068ff] text-sm font-bold text-white">
                Zalo
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-navy-900 dark:text-white">
                  {t("zaloTitle")}
                </span>
                <span className="block truncate text-xs text-steel-500 dark:text-steel-300">
                  {t("zaloSubtitle")}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-steel-400" aria-hidden="true" />
            </a>

            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl border border-steel-200 p-3 transition-colors hover:border-red-500 hover:bg-red-50 dark:border-navy-700 dark:hover:bg-red-500/10"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-navy-900 dark:text-white">
                  {t("formTitle")}
                </span>
                <span className="block truncate text-xs text-steel-500 dark:text-steel-300">
                  {t("formSubtitle")}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-steel-400" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t("toggleClose") : t("toggleOpen")}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0068ff] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 dark:focus-visible:outline-white"
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
