import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import {
  LayoutDashboard,
  Wrench,
  Truck,
  Droplet,
  Newspaper,
  Inbox,
  LogOut,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/crane-models", label: "Model cẩu", icon: Truck },
  { href: "/admin/parts", label: "Phụ tùng", icon: Wrench },
  { href: "/admin/lubricants", label: "Dầu nhớt mỡ", icon: Droplet },
  { href: "/admin/news", label: "Tin tức", icon: Newspaper },
  { href: "/admin/inquiries", label: "Yêu cầu liên hệ", icon: Inbox },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-steel-200 bg-navy-950 text-steel-200 md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-navy-800 px-6">
          <span className="font-display text-sm font-bold tracking-wide text-white">
            PALFINGER VIPEC
          </span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold hover:bg-navy-900 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-navy-800 p-4">
          <a
            href="/vi"
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold hover:bg-navy-900 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Xem website
          </a>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold hover:bg-navy-900 hover:text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-steel-200 bg-white px-6 md:hidden">
          <span className="font-display text-sm font-bold text-navy-900">
            PALFINGER VIPEC — Quản trị
          </span>
        </header>
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
