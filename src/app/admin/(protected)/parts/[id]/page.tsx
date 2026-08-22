import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updatePart } from "@/lib/admin-actions";
import { PartForm } from "@/components/admin/PartForm";

export default async function EditPartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [part, categories, craneModels] = await Promise.all([
    prisma.part.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.craneModel.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!part) notFound();

  const action = updatePart.bind(null, id);
  const specs = Array.isArray(part.specs)
    ? (part.specs as unknown as { label: string; value: string }[])
    : null;

  return (
    <div>
      <Link
        href="/admin/parts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Quay lại danh sách
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-navy-900">Sửa phụ tùng: {part.nameVi}</h1>
      <div className="max-w-3xl rounded-xl border border-steel-200 bg-white p-6 sm:p-8">
        <PartForm
          action={action}
          categories={categories}
          craneModels={craneModels}
          defaultValues={{ ...part, specs }}
          submitLabel="Lưu thay đổi"
        />
      </div>
    </div>
  );
}
