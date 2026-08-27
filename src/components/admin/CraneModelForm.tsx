import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { SingleImageField } from "@/components/admin/SingleImageField";

const inputClasses =
  "min-h-11 w-full rounded-md border border-steel-200 px-4 py-2.5 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900";
const labelClasses = "mb-1.5 block text-sm font-semibold text-navy-900";

type CraneModelDefaults = {
  slug?: string;
  nameVi?: string;
  nameEn?: string;
  tonnage?: string | null;
  image?: string | null;
};

export function CraneModelForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: CraneModelDefaults;
  submitLabel: string;
}) {
  return (
    <AdminFormShell action={action} redirectTo="/admin/crane-models" className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nameVi" className={labelClasses}>Tên model (VI) *</label>
          <input
            id="nameVi"
            name="nameVi"
            required
            defaultValue={defaultValues?.nameVi}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="nameEn" className={labelClasses}>Tên model (EN)</label>
          <input
            id="nameEn"
            name="nameEn"
            defaultValue={defaultValues?.nameEn}
            placeholder="Để trống sẽ dùng tên tiếng Việt"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="tonnage" className={labelClasses}>Tải trọng</label>
          <input
            id="tonnage"
            name="tonnage"
            defaultValue={defaultValues?.tonnage ?? ""}
            placeholder="VD: 3.3 tấn"
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="slug" className={labelClasses}>Đường dẫn (slug)</label>
          <input
            id="slug"
            name="slug"
            defaultValue={defaultValues?.slug}
            placeholder="Để trống sẽ tự tạo từ tên"
            className={inputClasses}
          />
        </div>
      </div>

      <SingleImageField name="image" label="Ảnh model cẩu" defaultValue={defaultValues?.image} />

      <button
        type="submit"
        className="min-h-11 rounded-md bg-red-500 px-8 text-sm font-semibold text-white hover:bg-red-600"
      >
        {submitLabel}
      </button>
    </AdminFormShell>
  );
}
