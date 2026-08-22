import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteCraneModel } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminCraneModelsPage() {
  const craneModels = await prisma.craneModel.findMany({
    include: { _count: { select: { parts: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Model cẩu</h1>
        <Link
          href="/admin/crane-models/new"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red-500 px-5 text-sm font-semibold text-white hover:bg-red-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Thêm model cẩu
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-steel-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steel-200 text-left text-xs font-bold uppercase tracking-wide text-steel-500">
              <th className="px-5 py-3">Tên (VI)</th>
              <th className="px-5 py-3">Tải trọng</th>
              <th className="px-5 py-3">Số phụ tùng</th>
              <th className="px-5 py-3">Nguồn</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {craneModels.map((cm) => (
              <tr key={cm.id} className="border-b border-steel-100 last:border-0">
                <td className="px-5 py-3 font-semibold text-navy-900">{cm.nameVi}</td>
                <td className="px-5 py-3 text-steel-600">{cm.tonnage ?? "—"}</td>
                <td className="px-5 py-3 text-steel-600">{cm._count.parts}</td>
                <td className="px-5 py-3 text-xs text-steel-500">
                  {cm.externalId ? "Đồng bộ VIPEC" : "Nhập tay"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/crane-models/${cm.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-steel-500 hover:bg-steel-100 hover:text-navy-900"
                      aria-label="Sửa"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteCraneModel.bind(null, cm.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {craneModels.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-steel-500">
                  Chưa có model cẩu nào. Bấm &quot;Đồng bộ dữ liệu VIPEC&quot; ở Tổng quan để lấy dữ liệu thật.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
