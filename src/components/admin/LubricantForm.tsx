import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { ImagesEditor } from "@/components/admin/ImagesEditor";
import { AutoTranslateButton } from "@/components/admin/AutoTranslateButton";

const inputClasses =
  "min-h-11 w-full rounded-md border border-steel-200 px-4 py-2.5 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900";
const labelClasses = "mb-1.5 block text-sm font-semibold text-navy-900";

const typeOptions: { value: string; label: string }[] = [
  { value: "ENGINE_OIL", label: "Nhớt động cơ" },
  { value: "HYDRAULIC_OIL", label: "Nhớt thủy lực" },
  { value: "GEAR_OIL", label: "Nhớt hộp số / cầu" },
  { value: "GREASE", label: "Mỡ bôi trơn" },
  { value: "OTHER", label: "Khác" },
];

type LubricantDefaults = {
  slug?: string;
  nameVi?: string;
  nameEn?: string;
  brand?: string | null;
  type?: string;
  packaging?: string | null;
  image?: string | null;
  images?: { url: string }[];
  featured?: boolean;
  published?: boolean;
  descriptionVi?: string;
  descriptionEn?: string;
  detailVi?: string | null;
  detailEn?: string | null;
};

export function LubricantForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: LubricantDefaults;
  submitLabel: string;
}) {
  return (
    <AdminFormShell action={action} redirectTo="/admin/lubricants" className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nameVi" className={labelClasses}>Tên sản phẩm (VI) *</label>
          <input
            id="nameVi"
            name="nameVi"
            required
            defaultValue={defaultValues?.nameVi}
            className={inputClasses}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="nameEn" className="text-sm font-semibold text-navy-900">Tên sản phẩm (EN)</label>
            <AutoTranslateButton sourceId="nameVi" targetId="nameEn" />
          </div>
          <input
            id="nameEn"
            name="nameEn"
            defaultValue={defaultValues?.nameEn}
            placeholder="Để trống sẽ dùng tên tiếng Việt"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="type" className={labelClasses}>Loại *</label>
          <select
            id="type"
            name="type"
            required
            defaultValue={defaultValues?.type ?? "OTHER"}
            className={inputClasses}
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="brand" className={labelClasses}>Hãng</label>
          <input
            id="brand"
            name="brand"
            defaultValue={defaultValues?.brand ?? ""}
            placeholder="VD: Idemitsu"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="packaging" className={labelClasses}>Quy cách đóng gói</label>
          <input
            id="packaging"
            name="packaging"
            defaultValue={defaultValues?.packaging ?? ""}
            placeholder="VD: 18L/thùng"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="descriptionVi" className={labelClasses}>Mô tả (VI)</label>
          <textarea
            id="descriptionVi"
            name="descriptionVi"
            rows={4}
            defaultValue={defaultValues?.descriptionVi}
            className={inputClasses}
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="descriptionEn" className={labelClasses}>Mô tả (EN)</label>
            <AutoTranslateButton sourceId="descriptionVi" targetId="descriptionEn" />
          </div>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            rows={4}
            defaultValue={defaultValues?.descriptionEn}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="detailVi" className={labelClasses}>Chi tiết sản phẩm (VI)</label>
          <p className="mb-1.5 -mt-1 text-xs text-steel-500">
            Không bắt buộc. Hỗ trợ định dạng: <code>### Tiêu đề</code>, <code>**chữ**</code> in
            đậm, danh sách &quot;-&quot;, và bảng <code>| Cột 1 | Cột 2 |</code>.
          </p>
          <textarea
            id="detailVi"
            name="detailVi"
            rows={8}
            defaultValue={defaultValues?.detailVi ?? ""}
            className={inputClasses}
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="detailEn" className={labelClasses}>Chi tiết sản phẩm (EN)</label>
            <AutoTranslateButton sourceId="detailVi" targetId="detailEn" />
          </div>
          <p className="mb-1.5 -mt-1 text-xs text-steel-500">
            Optional. Supports Markdown: headings, bold, lists, tables.
          </p>
          <textarea
            id="detailEn"
            name="detailEn"
            rows={8}
            defaultValue={defaultValues?.detailEn ?? ""}
            className={inputClasses}
          />
        </div>
      </div>

      <ImagesEditor defaultValue={defaultValues?.images?.map((img) => img.url)} />

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaultValues?.featured}
            className="h-5 w-5 rounded border-steel-300 text-red-500 focus:ring-red-500"
          />
          Hiển thị nổi bật trên trang chủ
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
        <input
          type="checkbox"
          name="published"
          defaultChecked={defaultValues?.published ?? true}
          className="h-5 w-5 rounded border-steel-300 text-red-500 focus:ring-red-500"
        />
        Hiển thị công khai trên website (bỏ chọn để ẩn tạm, chỉ admin thấy được)
      </label>

      <button
        type="submit"
        className="min-h-11 rounded-md bg-red-500 px-8 text-sm font-semibold text-white hover:bg-red-600"
      >
        {submitLabel}
      </button>
    </AdminFormShell>
  );
}
