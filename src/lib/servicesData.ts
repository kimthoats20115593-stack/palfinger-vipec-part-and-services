import {
  Wrench,
  CalendarCheck,
  PackageSearch,
  type LucideIcon,
} from "lucide-react";

export type ServiceItem = {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
};

export const servicesData: ServiceItem[] = [
  { icon: Wrench, titleKey: "s1Title", descKey: "s1Desc" },
  { icon: CalendarCheck, titleKey: "s2Title", descKey: "s2Desc" },
  { icon: PackageSearch, titleKey: "s6Title", descKey: "s6Desc" },
];
