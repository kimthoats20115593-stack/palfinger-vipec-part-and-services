"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

type InquiryType = "QUOTE" | "CONTACT";
type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "min-h-11 w-full rounded-md border border-steel-200 bg-white px-4 py-2.5 text-sm text-steel-900 placeholder:text-steel-400 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900";
const labelClasses = "mb-1.5 block text-sm font-semibold text-navy-900";

export function InquiryForm({
  type,
  partId,
  partLabel,
}: {
  type: InquiryType;
  partId?: string;
  partLabel?: string;
}) {
  const t = useTranslations("quote");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      type,
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      partId: partId || "",
      message: String(data.get("message") || ""),
    };

    if (!payload.name || !payload.phone || !payload.email || !payload.message) {
      setStatus("error");
      setErrorMsg(t("formErrorRequired"));
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-orange-600" aria-hidden="true" />
        <h3 className="text-lg font-bold text-navy-900">{t("formSuccessTitle")}</h3>
        <p className="text-sm text-steel-700">{t("formSuccessDesc")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {partLabel && (
        <div className="rounded-md bg-steel-50 px-4 py-3 text-sm text-steel-700">
          <span className="font-semibold text-navy-900">{t("formPart")}: </span>
          {partLabel}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>
            {t("formName")} *
          </label>
          <input id="name" name="name" required autoComplete="name" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClasses}>
            {t("formPhone")} *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClasses}>
            {t("formEmail")} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClasses}>
            {t("formCompany")}
          </label>
          <input id="company" name="company" autoComplete="organization" className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          {t("formMessage")} *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t("formMessagePlaceholder")}
          className={inputClasses}
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2.5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{errorMsg || t("formErrorDesc")}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-orange-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {status === "submitting" ? t("formSubmitting") : t("formSubmit")}
      </button>
    </form>
  );
}
