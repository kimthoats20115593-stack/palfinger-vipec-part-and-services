import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createCraneModel } from "@/lib/admin-actions";
import { CraneModelForm } from "@/components/admin/CraneModelForm";

export default function NewCraneModelPage() {
  return (
    <div>
      <Link
        href="/admin/crane-models"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Quay lại danh sách
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-navy-900">Thêm model cẩu mới</h1>
      <div className="max-w-2xl rounded-xl border border-steel-200 bg-white p-6 sm:p-8">
        <CraneModelForm action={createCraneModel} submitLabel="Tạo model cẩu" />
      </div>
    </div>
  );
}
