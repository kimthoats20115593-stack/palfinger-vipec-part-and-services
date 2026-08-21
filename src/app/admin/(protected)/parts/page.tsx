import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deletePart } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminPartsPage() {
  const parts = await prisma.part.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Phụ tùng</h1>
        <Link
          href="/admin/parts/new"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red-500 px-5 text-sm font-semibold text-white hover:bg-red-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Thêm phụ tùng
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-steel-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steel-200 text-left text-xs font-bold uppercase tracking-wide text-steel-500">
              <th className="px-5 py-3">SKU</th>
              <th className="px-5 py-3">Tên (VI)</th>
              <th className="px-5 py-3">Danh mục</th>
              <th className="px-5 py-3">Dòng cẩu</th>
              <th className="px-5 py-3"></th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} className="border-b border-steel-100 last:border-0">
                <td className="px-5 py-3 font-mono text-xs text-steel-600">{part.sku}</td>
                <td className="px-5 py-3 font-semibold text-navy-900">{part.nameVi}</td>
                <td className="px-5 py-3 text-steel-600">{part.category.nameVi}</td>
                <td className="px-5 py-3 text-steel-600">{part.craneModel}</td>
                <td className="px-5 py-3">
                  {part.featured && (
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-label="Nổi bật" />
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/parts/${part.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-steel-500 hover:bg-steel-100 hover:text-navy-900"
                      aria-label="Sửa"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deletePart.bind(null, part.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {parts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-steel-500">
                  Chưa có phụ tùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
