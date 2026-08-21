export function localize(locale: string, vi: string, en: string): string {
  return locale === "en" ? en : vi;
}
