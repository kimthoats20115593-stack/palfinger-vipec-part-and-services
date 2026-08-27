import { SpecsEditor } from "@/components/admin/SpecsEditor";
import { ImagesEditor } from "@/components/admin/ImagesEditor";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { AutoTranslateButton } from "@/components/admin/AutoTranslateButton";

const inputClasses =
  "min-h-11 w-full rounded-md border border-steel-200 px-4 py-2.5 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900";
const labelClasses = "mb-1.5 block text-sm font-semibold text-navy-900";

const iconOptions = [
  "cylinder",
  "valve",
  "gear",
  "hook",
  "cable",
  "boom",
  "pump",
  "control",
];

type Category = { id: string; nameVi: string };
type CraneModel = { id: string; nameVi: string };
type Spec = { label: string; value: string };

type PartDefaults = {
  sku?: string;
  nameVi?: string;
  nameEn?: string;
  craneModelId?: string | null;
  descriptionVi?: string;
  descriptionEn?: string;
  image?: string;
  images?: { url: string }[];
  featured?: boolean;
  published?: boolean;
  categoryId?: string;
  specs?: Spec[] | null;
  price?: number | null;
  status?: string | null;
  unit?: string | null;
  stockQty?: number | null;
  inStock?: boolean;
  detailVi?: string | null;
  detailEn?: string | null;
};

export function PartForm({
  action,
  categories,
  craneModels,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  craneModels: CraneModel[];
  defaultValues?: PartDefaults;
  submitLabel: string;
}) {
  return (
    <AdminFormShell action={action} redirectTo="/admin/parts" className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sku" className={labelClasses}>Mã SKU *</label>
          <input id="sku" name="sku" required defaultValue={defaultValues?.sku} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="craneModelId" className={labelClasses}>Model cẩu tương thích</label>
          <select
            id="craneModelId"
            name="craneModelId"
            defaultValue={defaultValues?.craneModelId ?? ""}
            className={inputClasses}
          >
            <option value="">Đa dòng / Universal</option>
            {craneModels.map((cm) => (
              <option key={cm.id} value={cm.id}>
                {cm.nameVi}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nameVi" className={labelClasses}>Tên phụ tùng (VI) *</label>
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
            <label htmlFor="nameEn" className="text-sm font-semibold text-navy-900">Tên phụ tùng (EN) *</label>
            <AutoTranslateButton sourceId="nameVi" targetId="nameEn" />
          </div>
          <input
            id="nameEn"
            name="nameEn"
            required
            defaultValue={defaultValues?.nameEn}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="descriptionVi" className={labelClasses}>Mô tả ngắn (VI) *</label>
          <p className="mb-1.5 -mt-1 text-xs text-steel-500">Hiện ngay đầu trang chi tiết, 1–3 câu.</p>
          <textarea
            id="descriptionVi"
            name="descriptionVi"
            required
            rows={4}
            defaultValue={defaultValues?.descriptionVi}
            className={inputClasses}
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="descriptionEn" className={labelClasses}>Mô tả ngắn (EN) *</label>
            <AutoTranslateButton sourceId="descriptionVi" targetId="descriptionEn" />
          </div>
          <p className="mb-1.5 -mt-1 text-xs text-steel-500">Shown at the top of the detail page, 1–3 sentences.</p>
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            required
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
            Không bắt buộc. Hỗ trợ định dạng: <code>### Tiêu đề</code> cho tiêu đề,{" "}
            <code>**chữ**</code> cho in đậm, dấu &quot;-&quot; hoặc &quot;*&quot; đầu dòng cho danh
            sách, và bảng dạng <code>| Cột 1 | Cột 2 |</code> — trang chi tiết sẽ tự hiển thị đẹp,
            không hiện ký hiệu thô.
          </p>
          <textarea
            id="detailVi"
            name="detailVi"
            rows={10}
            defaultValue={defaultValues?.detailVi ?? ""}
            placeholder={"VD:\n### Điểm nổi bật\n- Được ủy quyền bởi Cummins\n- Bảo vệ chống mài mòn tuyệt đối\n\n| Hạng mục | Thông tin |\n| --- | --- |\n| Thương hiệu | Cummins |"}
            className={inputClasses}
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="detailEn" className={labelClasses}>Chi tiết sản phẩm (EN)</label>
            <AutoTranslateButton sourceId="detailVi" targetId="detailEn" />
          </div>
          <p className="mb-1.5 -mt-1 text-xs text-steel-500">
            Optional. Supports Markdown: <code>### Heading</code>, <code>**bold**</code>,
            &quot;-&quot; lists, and <code>| Col 1 | Col 2 |</code> tables.
          </p>
          <textarea
            id="detailEn"
            name="detailEn"
            rows={10}
            defaultValue={defaultValues?.detailEn ?? ""}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="categoryId" className={labelClasses}>Danh mục *</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={defaultValues?.categoryId}
            className={inputClasses}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameVi}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image" className={labelClasses}>Biểu tượng minh họa (dự phòng)</label>
          <select id="image" name="image" defaultValue={defaultValues?.image || "gear"} className={inputClasses}>
            {iconOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-2.5">
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

      <ImagesEditor defaultValue={defaultValues?.images?.map((img) => img.url)} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div>
          <label htmlFor="price" className={labelClasses}>Giá (đã gồm VAT, VNĐ)</label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step={1000}
            defaultValue={defaultValues?.price ?? ""}
            placeholder="VD: 2409000"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="status" className={labelClasses}>Tình trạng</label>
          <input
            id="status"
            name="status"
            defaultValue={defaultValues?.status ?? ""}
            placeholder="VD: Mới"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="unit" className={labelClasses}>Đơn vị</label>
          <input
            id="unit"
            name="unit"
            defaultValue={defaultValues?.unit ?? ""}
            placeholder="VD: Cái, Bộ, Xô"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="stockQty" className={labelClasses}>Số lượng tồn (không bắt buộc)</label>
          <input
            id="stockQty"
            name="stockQty"
            type="number"
            min={0}
            defaultValue={defaultValues?.stockQty ?? ""}
            placeholder="VD: 35"
            className={inputClasses}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={defaultValues?.inStock ?? true}
          className="h-5 w-5 rounded border-steel-300 text-red-500 focus:ring-red-500"
        />
        Còn hàng (hiện badge &quot;Còn hàng&quot; trên trang chi tiết — không cần nhập số lượng cụ
        thể ở trên)
      </label>

      <SpecsEditor defaultValue={defaultValues?.specs ?? undefined} />

      <button
        type="submit"
        className="min-h-11 rounded-md bg-red-500 px-8 text-sm font-semibold text-white hover:bg-red-600"
      >
        {submitLabel}
      </button>
    </AdminFormShell>
  );
}
