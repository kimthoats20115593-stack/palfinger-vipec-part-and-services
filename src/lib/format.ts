export function formatVnd(value: number, locale: string): string {
  const formatted = new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
  return `${formatted} VNĐ`;
}
