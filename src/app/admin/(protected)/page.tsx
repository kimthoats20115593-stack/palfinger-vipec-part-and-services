import Link from "next/link";
import { Wrench, Truck, Droplet, Newspaper, Inbox, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { VipecSyncPanel } from "@/components/admin/VipecSyncPanel";

export default async function AdminDashboardPage() {
  const [craneModelsCount, partsCount, lubricantsCount, newsCount, newInquiries] =
    await Promise.all([
      prisma.craneModel.count(),
      prisma.part.count(),
      prisma.lubricant.count(),
      prisma.newsPost.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
    ]);

  const cards = [
    { href: "/admin/crane-models", label: "Model cẩu", value: craneModelsCount, icon: Truck },
    { href: "/admin/parts", label: "Phụ tùng", value: partsCount, icon: Wrench },
    { href: "/admin/lubricants", label: "Dầu nhớt mỡ", value: lubricantsCount, icon: Droplet },
    { href: "/admin/news", label: "Bài viết tin tức", value: newsCount, icon: Newspaper },
    {
      href: "/admin/inquiries",
      label: "Yêu cầu mới chưa xử lý",
      value: newInquiries,
      icon: Inbox,
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-navy-900">Tổng quan</h1>
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-steel-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-red-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="font-display text-3xl font-bold text-navy-900">{card.value}</p>
              <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-steel-600 group-hover:text-red-600">
                {card.label}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </p>
            </Link>
          );
        })}
      </div>

      <VipecSyncPanel />
    </div>
  );
}
