import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createPart } from "@/lib/admin-actions";
import { PartForm } from "@/components/admin/PartForm";

export default async function NewPartPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <Link
        href="/admin/parts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Quay lại danh sách
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-navy-900">Thêm phụ tùng mới</h1>
      <div className="max-w-3xl rounded-xl border border-steel-200 bg-white p-6 sm:p-8">
        <PartForm action={createPart} categories={categories} submitLabel="Tạo phụ tùng" />
      </div>
    </div>
  );
}
