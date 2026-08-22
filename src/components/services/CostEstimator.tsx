"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/lib/site";

const RATES = {
  fuelLitersPerKmOneWay: 0.1,
  tollPerStation: 100_000,
  technicianCount: 2,
  wagePerPersonPerDay: 800_000,
  mealsPerPersonPerDay: 1,
  mealRate: 140_000,
  hotelRatePerNight: 300_000,
  vehicleFeePerDay: 700_000,
  cleaningFee: 100_000,
};

const inputClasses =
  "min-h-11 w-full rounded-md border border-steel-200 bg-white px-4 py-2.5 text-sm text-steel-900 placeholder:text-steel-400 focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:focus:border-white";
const labelClasses = "mb-1.5 block text-sm font-semibold text-navy-900 dark:text-white";

function num(value: string, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function formatVnd(value: number, locale: string): string {
  const formatted = new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  return `${formatted} VNĐ`;
}

export function CostEstimator() {
  const t = useTranslations("estimator");
  const locale = useLocale();
  const printRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [ticketNo, setTicketNo] = useState("");
  const [issueDate, setIssueDate] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [machineType, setMachineType] = useState("");
  const [description, setDescription] = useState("");
  const [fuelPrice, setFuelPrice] = useState("20000");
  const [distance, setDistance] = useState("50");
  const [tolls, setTolls] = useState("1");
  const [days, setDays] = useState("1");
  const [hotelDistance, setHotelDistance] = useState("5");

  useEffect(() => {
    function initTicket() {
      const now = new Date();
      setTicketNo(`DT${now.getFullYear()}${String(now.getTime()).slice(-5)}`);
      setIssueDate(
        now.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      );
    }
    initTicket();
  }, [locale]);

  const estimate = useMemo(() => {
    const distanceKm = num(distance);
    const tollStations = num(tolls);
    const dayCount = Math.max(num(days, 1), 1);
    const hotelDistanceKm = num(hotelDistance);
    const fuelPriceVnd = num(fuelPrice);

    const fuel = distanceKm * 2 * RATES.fuelLitersPerKmOneWay * fuelPriceVnd;
    const tollCost = tollStations * RATES.tollPerStation;
    const labor = RATES.technicianCount * RATES.wagePerPersonPerDay * dayCount;
    const mealCount = RATES.technicianCount * RATES.mealsPerPersonPerDay * dayCount;
    const meals = mealCount * RATES.mealRate;
    const nights = Math.max(dayCount - 1, 0);
    const hotel = nights * RATES.hotelRatePerNight;
    const hotelTransport = nights > 0 ? hotelDistanceKm * 2 * RATES.fuelLitersPerKmOneWay * fuelPriceVnd : 0;
    const vehicleFee = RATES.vehicleFeePerDay * dayCount;
    const cleaning = RATES.cleaningFee;

    const total = fuel + tollCost + labor + meals + hotel + hotelTransport + vehicleFee + cleaning;

    return {
      fuel,
      tollCost,
      labor,
      meals,
      mealCount,
      hotel,
      nights,
      hotelTransport,
      vehicleFee,
      cleaning,
      total,
    };
  }, [distance, tolls, days, hotelDistance, fuelPrice]);

  const lines = [
    { label: t("lineFuel"), value: estimate.fuel },
    { label: t("lineTolls"), value: estimate.tollCost },
    { label: t("lineLabor", { count: RATES.technicianCount }), value: estimate.labor },
    { label: t("lineMeals", { count: estimate.mealCount }), value: estimate.meals },
    { label: t("lineHotel", { count: estimate.nights }), value: estimate.hotel },
    { label: t("lineHotelTransport"), value: estimate.hotelTransport },
    { label: t("lineVehicle"), value: estimate.vehicleFee },
    { label: t("lineCleaning"), value: estimate.cleaning },
  ];

  async function handleExportPdf() {
    if (!printRef.current || exporting) return;
    setExporting(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas-pro"),
      ]);
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`bao-gia-dich-vu-${ticketNo || "vipec"}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="relative bg-steel-50 py-16 dark:bg-navy-900/40">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            {t("eyebrow")}
          </p>
          <h2 className="text-2xl font-bold text-navy-900 dark:text-white">{t("title")}</h2>
          <p className="mt-3 text-sm leading-relaxed text-steel-600 dark:text-steel-300">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="space-y-6 rounded-2xl border border-steel-200 bg-white p-6 dark:border-navy-700 dark:bg-navy-950 lg:col-span-3">
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy-900 dark:text-white">
                {t("sectionAJob")}
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>{t("customerName")}</label>
                  <input
                    className={inputClasses}
                    placeholder={t("customerNamePlaceholder")}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClasses}>{t("phone")}</label>
                  <input
                    type="tel"
                    className={inputClasses}
                    placeholder={t("phonePlaceholder")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClasses}>{t("machineType")}</label>
                  <input
                    className={inputClasses}
                    placeholder={t("machineTypePlaceholder")}
                    value={machineType}
                    onChange={(e) => setMachineType(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClasses}>{t("fuelPrice")}</label>
                  <input
                    type="number"
                    min={0}
                    className={inputClasses}
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClasses}>{t("description")}</label>
                  <textarea
                    rows={2}
                    className={inputClasses}
                    placeholder={t("descriptionPlaceholder")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy-900 dark:text-white">
                {t("sectionBTravel")}
              </h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>{t("distance")}</label>
                  <input
                    type="number"
                    min={0}
                    className={inputClasses}
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClasses}>{t("tolls")}</label>
                  <input
                    type="number"
                    min={0}
                    className={inputClasses}
                    value={tolls}
                    onChange={(e) => setTolls(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClasses}>{t("days")}</label>
                  <input
                    type="number"
                    min={1}
                    className={inputClasses}
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClasses}>{t("hotelDistance")}</label>
                  <input
                    type="number"
                    min={0}
                    className={inputClasses}
                    value={hotelDistance}
                    onChange={(e) => setHotelDistance(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-steel-500 dark:text-steel-400">
                    {t("hotelDistanceHint")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-navy-800 bg-navy-950 p-6 text-white">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-steel-300">
                {t("summaryTitle")}
              </h3>
              <p className="mb-6 font-display text-3xl font-bold text-yellow-400">
                {formatVnd(estimate.total, locale)}
              </p>
              <ul className="mb-6 space-y-2.5 border-t border-navy-800 pt-5 text-sm">
                {lines.map((line) => (
                  <li key={line.label} className="flex items-center justify-between gap-3">
                    <span className="text-steel-300">{line.label}</span>
                    <span className="shrink-0 font-semibold text-white">
                      {formatVnd(line.value, locale)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={exporting}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-red-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Download className="h-4 w-4" aria-hidden="true" />
                  )}
                  {exporting ? t("exportingPdf") : t("exportPdf")}
                </button>
                <Link
                  href="/quote"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-white/20 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {t("requestSchedule")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          ref={printRef}
          className="w-[794px] bg-white p-12 text-[#14181d]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <div className="flex items-center justify-between border-b border-[#e6e9ec] pb-5">
            <Logo />
            <div className="text-right text-xs text-[#3a434d]">
              <p className="font-display text-sm font-bold text-[#071527]">
                {siteConfig.legalName}
              </p>
              <p className="mt-0.5">
                Hotline: {siteConfig.hotline} &nbsp;|&nbsp; {siteConfig.email}
              </p>
            </div>
          </div>

          <div className="mt-7">
            <h1 className="font-display text-3xl font-bold text-[#b81523]">
              {t("pdfDocTitle")}
            </h1>
            <p className="mt-1.5 text-xs text-[#6b7680]">
              {t("pdfTicketNo")}: <span className="font-bold text-[#14181d]">{ticketNo}</span>
              &nbsp;&nbsp;&nbsp;
              {t("pdfDate")}: <span className="font-bold text-[#14181d]">{issueDate}</span>
            </p>
          </div>

          <div className="mt-7">
            <div className="bg-[#071527] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white">
              {t("pdfSectionA")}
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-[#e6e9ec]">
                  <td className="w-1/2 py-2.5 text-[#6b7680]">{t("pdfCustomer")}</td>
                  <td className="py-2.5 font-semibold text-[#14181d]">
                    {customerName || t("pdfCustomerFallback")}
                  </td>
                </tr>
                <tr className="border-b border-[#e6e9ec]">
                  <td className="py-2.5 text-[#6b7680]">{t("pdfPhoneLabel")}</td>
                  <td className="py-2.5 font-semibold text-[#14181d]">{phone || "—"}</td>
                </tr>
                <tr className="border-b border-[#e6e9ec]">
                  <td className="py-2.5 text-[#6b7680]">{t("pdfMachineLabel")}</td>
                  <td className="py-2.5 font-semibold text-[#14181d]">{machineType || "—"}</td>
                </tr>
                <tr className="border-b border-[#e6e9ec]">
                  <td className="py-2.5 text-[#6b7680]">{t("pdfDescLabel")}</td>
                  <td className="py-2.5 font-semibold text-[#14181d]">{description || "—"}</td>
                </tr>
                <tr>
                  <td className="py-2.5 text-[#6b7680]">{t("pdfFuelPriceLabel")}</td>
                  <td className="py-2.5 font-semibold text-[#14181d]">
                    {formatVnd(num(fuelPrice), locale)}/L
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-7">
            <div className="bg-[#071527] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white">
              {t("pdfSectionB")}
            </div>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {lines.map((line) => (
                  <tr key={line.label} className="border-b border-[#e6e9ec]">
                    <td className="py-2.5 text-[#3a434d]">{line.label}</td>
                    <td className="py-2.5 text-right font-semibold text-[#14181d]">
                      {formatVnd(line.value, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-lg bg-[#b81523] px-5 py-4">
            <span className="text-sm font-bold uppercase tracking-wide text-white">
              {t("pdfTotal")}
            </span>
            <span className="text-xl font-bold text-white">{formatVnd(estimate.total, locale)}</span>
          </div>

          <p className="mt-6 text-[11px] italic leading-relaxed text-[#6b7680]">* {t("note")}</p>

          <div className="mt-16 grid grid-cols-2 gap-6 text-center text-xs font-bold uppercase tracking-wide text-[#14181d]">
            <div>
              <p>{t("pdfSignCustomer")}</p>
              <div className="mt-20 border-t border-[#cdd3d9]" />
              <p className="mt-2 text-[11px] font-normal normal-case italic text-[#6b7680]">
                {t("pdfSignHint")}
              </p>
            </div>
            <div>
              <p>{t("pdfSignCompany")}</p>
              <div className="mt-20 border-t border-[#cdd3d9]" />
              <p className="mt-2 text-[11px] font-normal normal-case italic text-[#6b7680]">
                {t("pdfSignHint")}
              </p>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-[#e6e9ec] pt-4 text-[10px] text-[#6b7680]">
            <p>
              {siteConfig.legalName} &nbsp;|&nbsp; {siteConfig.website}
            </p>
            <p>{t("pdfPage", { page: 1 })}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
