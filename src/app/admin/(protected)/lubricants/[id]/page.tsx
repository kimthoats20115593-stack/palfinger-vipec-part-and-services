import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateLubricant } from "@/lib/admin-actions";
import { LubricantForm } from "@/components/admin/LubricantForm";

export default async function EditLubricantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lubricant = await prisma.lubricant.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!lubricant) notFound();

  const action = updateLubricant.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/lubricants"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Quay lại danh sách
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-navy-900">Sửa sản phẩm: {lubricant.nameVi}</h1>
      <div className="max-w-2xl rounded-xl border border-steel-200 bg-white p-6 sm:p-8">
        <LubricantForm action={action} defaultValues={lubricant} submitLabel="Lưu thay đổi" />
      </div>
    </div>
  );
}
