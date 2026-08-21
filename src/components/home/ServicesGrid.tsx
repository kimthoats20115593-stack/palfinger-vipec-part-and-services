import { useTranslations } from "next-intl";
import { servicesData } from "@/lib/servicesData";

export function ServiceCard({
  service,
  namespace = "services",
}: {
  service: (typeof servicesData)[number];
  namespace?: string;
}) {
  const t = useTranslations(namespace);
  const Icon = service.icon;

  return (
    <div className="group rounded-xl border border-steel-100 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-navy-900/5">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900 text-orange-400 transition-colors group-hover:bg-orange-500 group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-navy-900">{t(service.titleKey)}</h3>
      <p className="text-sm leading-relaxed text-steel-700">{t(service.descKey)}</p>
    </div>
  );
}

export function ServicesGrid({ limit }: { limit?: number }) {
  const items = limit ? servicesData.slice(0, limit) : servicesData;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((service) => (
        <ServiceCard key={service.titleKey} service={service} />
      ))}
    </div>
  );
}
