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

type PartDefaults = {
  sku?: string;
  nameVi?: string;
  nameEn?: string;
  craneModel?: string;
  descriptionVi?: string;
  descriptionEn?: string;
  image?: string;
  featured?: boolean;
  categoryId?: string;
};

export function PartForm({
  action,
  categories,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  defaultValues?: PartDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="sku" className={labelClasses}>Mã SKU *</label>
          <input id="sku" name="sku" required defaultValue={defaultValues?.sku} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="craneModel" className={labelClasses}>Dòng cẩu tương thích *</label>
          <input
            id="craneModel"
            name="craneModel"
            required
            defaultValue={defaultValues?.craneModel}
            className={inputClasses}
          />
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
          <label htmlFor="nameEn" className={labelClasses}>Tên phụ tùng (EN) *</label>
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
          <label htmlFor="descriptionVi" className={labelClasses}>Mô tả (VI) *</label>
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
          <label htmlFor="descriptionEn" className={labelClasses}>Mô tả (EN) *</label>
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
          <label htmlFor="image" className={labelClasses}>Biểu tượng minh họa</label>
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

      <button
        type="submit"
        className="min-h-11 rounded-md bg-red-500 px-8 text-sm font-semibold text-white hover:bg-red-600"
      >
        {submitLabel}
      </button>
    </form>
  );
}
