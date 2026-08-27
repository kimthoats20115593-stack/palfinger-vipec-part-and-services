import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteLubricant, toggleLubricantPublished } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PublishToggleButton } from "@/components/admin/PublishToggleButton";

const typeLabels: Record<string, string> = {
  ENGINE_OIL: "Nhớt động cơ",
  HYDRAULIC_OIL: "Nhớt thủy lực",
  GEAR_OIL: "Nhớt hộp số / cầu",
  GREASE: "Mỡ bôi trơn",
  OTHER: "Khác",
};

export default async function AdminLubricantsPage() {
  const lubricants = await prisma.lubricant.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Dầu nhớt mỡ</h1>
        <Link
          href="/admin/lubricants/new"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red-500 px-5 text-sm font-semibold text-white hover:bg-red-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-steel-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steel-200 text-left text-xs font-bold uppercase tracking-wide text-steel-500">
              <th className="px-5 py-3">Tên (VI)</th>
              <th className="px-5 py-3">Loại</th>
              <th className="px-5 py-3">Hãng</th>
              <th className="px-5 py-3"></th>
              <th className="px-5 py-3">Hiển thị</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {lubricants.map((lb) => (
              <tr key={lb.id} className="border-b border-steel-100 last:border-0">
                <td className="px-5 py-3 font-semibold text-navy-900">{lb.nameVi}</td>
                <td className="px-5 py-3 text-steel-600">{typeLabels[lb.type]}</td>
                <td className="px-5 py-3 text-steel-600">{lb.brand ?? "—"}</td>
                <td className="px-5 py-3">
                  {lb.featured && (
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-label="Nổi bật" />
                  )}
                </td>
                <td className="px-5 py-3">
                  <PublishToggleButton
                    published={lb.published}
                    action={toggleLubricantPublished.bind(null, lb.id, !lb.published)}
                  />
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/lubricants/${lb.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-steel-500 hover:bg-steel-100 hover:text-navy-900"
                      aria-label="Sửa"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteLubricant.bind(null, lb.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {lubricants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-steel-500">
                  Chưa có sản phẩm nào. Bấm &quot;Đồng bộ dữ liệu VIPEC&quot; ở Tổng quan để lấy dữ liệu thật.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
