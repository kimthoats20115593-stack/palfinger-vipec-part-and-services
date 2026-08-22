import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateCraneModel } from "@/lib/admin-actions";
import { CraneModelForm } from "@/components/admin/CraneModelForm";

export default async function EditCraneModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const craneModel = await prisma.craneModel.findUnique({ where: { id } });
  if (!craneModel) notFound();

  const action = updateCraneModel.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/crane-models"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Quay lại danh sách
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-navy-900">Sửa model cẩu: {craneModel.nameVi}</h1>
      <div className="max-w-2xl rounded-xl border border-steel-200 bg-white p-6 sm:p-8">
        <CraneModelForm action={action} defaultValues={craneModel} submitLabel="Lưu thay đổi" />
      </div>
    </div>
  );
}
