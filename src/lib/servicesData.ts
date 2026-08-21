import {
  Wrench,
  CalendarCheck,
  Settings2,
  Truck,
  ClipboardCheck,
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
  { icon: Settings2, titleKey: "s3Title", descKey: "s3Desc" },
  { icon: Truck, titleKey: "s4Title", descKey: "s4Desc" },
  { icon: ClipboardCheck, titleKey: "s5Title", descKey: "s5Desc" },
  { icon: PackageSearch, titleKey: "s6Title", descKey: "s6Desc" },
];
