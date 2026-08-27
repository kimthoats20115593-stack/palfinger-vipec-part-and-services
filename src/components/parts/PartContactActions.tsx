"use client";

import { useEffect, useState } from "react";
import { Phone, X } from "lucide-react";
import { InquiryForm } from "@/components/forms/InquiryForm";

export function PartContactActions({
  partId,
  partLabel,
  callLabel,
  zaloLabel,
  zaloHref,
  modalTitle,
  modalSubtitle,
}: {
  partId: string;
  partLabel: string;
  callLabel: string;
  zaloLabel: string;
  zaloHref: string;
  modalTitle: string;
  modalSubtitle: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-md bg-red-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-600"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          {callLabel}
        </button>
        <a
          href={zaloHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-steel-200 px-6 text-sm font-semibold text-navy-900 transition-colors hover:border-[#0068ff] hover:text-[#0068ff] dark:border-navy-700 dark:text-white"
        >
          {zaloLabel}
        </a>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="part-contact-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl dark:bg-navy-900"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 id="part-contact-modal-title" className="text-base font-bold text-navy-900 dark:text-white">
                  {modalTitle}
                </h2>
                <p className="mt-1 text-xs text-steel-500 dark:text-steel-400">{modalSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng"
                className="shrink-0 rounded-md p-1.5 text-steel-500 hover:bg-steel-100 hover:text-navy-900 dark:text-steel-300 dark:hover:bg-navy-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <InquiryForm type="QUOTE" partId={partId} partLabel={partLabel} />
          </div>
        </div>
      )}
    </>
  );
}
