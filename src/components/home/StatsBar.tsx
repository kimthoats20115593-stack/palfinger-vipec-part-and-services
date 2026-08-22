import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";

export function StatsBar() {
  const t = useTranslations("home");

  const stats = [
    { value: "3.500+", label: t("statParts") },
    { value: "15+", label: t("statYears") },
    { value: "200+", label: t("statClients") },
    { value: "24h", label: t("statResponse") },
  ];

  return (
    <div className="border-b border-steel-100 bg-white dark:border-navy-800 dark:bg-navy-950">
      <Container className="grid grid-cols-2 divide-x divide-steel-100 dark:divide-navy-800 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-8 text-center">
            <p className="font-display text-3xl font-bold text-navy-900 dark:text-white sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-steel-500 dark:text-steel-400">
              {stat.label}
            </p>
          </div>
        ))}
      </Container>
    </div>
  );
}
