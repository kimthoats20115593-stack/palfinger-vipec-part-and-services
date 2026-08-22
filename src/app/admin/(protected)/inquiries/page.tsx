import { prisma } from "@/lib/prisma";
import { updateInquiryStatus } from "@/lib/admin-actions";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";

const typeLabels = { QUOTE: "Báo giá", CONTACT: "Liên hệ" };

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    include: { part: true, lubricant: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-navy-900">Yêu cầu liên hệ &amp; báo giá</h1>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="rounded-xl border border-steel-200 bg-white p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">
                  {typeLabels[inquiry.type]}
                </span>
                <span className="text-xs text-steel-500">
                  {new Date(inquiry.createdAt).toLocaleString("vi-VN")}
                </span>
              </div>
              <InquiryStatusSelect
                id={inquiry.id}
                status={inquiry.status}
                action={updateInquiryStatus}
              />
            </div>
            <div className="mb-3 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              <p>
                <span className="font-semibold text-navy-900">{inquiry.name}</span>
                {inquiry.company && ` · ${inquiry.company}`}
              </p>
              <p className="text-steel-600">
                {inquiry.phone} · {inquiry.email}
              </p>
            </div>
            {inquiry.part && (
              <p className="mb-2 text-xs text-steel-500">
                Phụ tùng quan tâm:{" "}
                <span className="font-semibold text-navy-900">
                  {inquiry.part.nameVi} ({inquiry.part.sku})
                </span>
              </p>
            )}
            {inquiry.lubricant && (
              <p className="mb-2 text-xs text-steel-500">
                Sản phẩm quan tâm:{" "}
                <span className="font-semibold text-navy-900">{inquiry.lubricant.nameVi}</span>
              </p>
            )}
            <p className="whitespace-pre-line rounded-md bg-steel-50 p-3 text-sm text-steel-700">
              {inquiry.message}
            </p>
          </div>
        ))}

        {inquiries.length === 0 && (
          <p className="rounded-xl border border-dashed border-steel-300 p-10 text-center text-steel-500">
            Chưa có yêu cầu nào.
          </p>
        )}
      </div>
    </div>
  );
}
