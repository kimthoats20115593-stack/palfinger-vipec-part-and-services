const inputClasses =
  "min-h-11 w-full rounded-md border border-steel-200 px-4 py-2.5 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900";
const labelClasses = "mb-1.5 block text-sm font-semibold text-navy-900";

type NewsDefaults = {
  slug?: string;
  titleVi?: string;
  titleEn?: string;
  excerptVi?: string;
  excerptEn?: string;
  contentVi?: string;
  contentEn?: string;
  published?: boolean;
};

export function NewsForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: NewsDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="titleVi" className={labelClasses}>Tiêu đề (VI) *</label>
          <input id="titleVi" name="titleVi" required defaultValue={defaultValues?.titleVi} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="titleEn" className={labelClasses}>Tiêu đề (EN) *</label>
          <input id="titleEn" name="titleEn" required defaultValue={defaultValues?.titleEn} className={inputClasses} />
        </div>
      </div>

      <div>
        <label htmlFor="slug" className={labelClasses}>Slug (URL) *</label>
        <input
          id="slug"
          name="slug"
          required
          pattern="[a-z0-9-]+"
          title="Chỉ dùng chữ thường, số và dấu gạch ngang"
          defaultValue={defaultValues?.slug}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="excerptVi" className={labelClasses}>Tóm tắt (VI) *</label>
          <textarea
            id="excerptVi"
            name="excerptVi"
            required
            rows={2}
            defaultValue={defaultValues?.excerptVi}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="excerptEn" className={labelClasses}>Tóm tắt (EN) *</label>
          <textarea
            id="excerptEn"
            name="excerptEn"
            required
            rows={2}
            defaultValue={defaultValues?.excerptEn}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contentVi" className={labelClasses}>Nội dung (VI) *</label>
          <textarea
            id="contentVi"
            name="contentVi"
            required
            rows={10}
            defaultValue={defaultValues?.contentVi}
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-steel-500">Dùng dòng trống để tách đoạn văn.</p>
        </div>
        <div>
          <label htmlFor="contentEn" className={labelClasses}>Nội dung (EN) *</label>
          <textarea
            id="contentEn"
            name="contentEn"
            required
            rows={10}
            defaultValue={defaultValues?.contentEn}
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-steel-500">Use a blank line to separate paragraphs.</p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-navy-900">
        <input
          type="checkbox"
          name="published"
          defaultChecked={defaultValues?.published ?? true}
          className="h-5 w-5 rounded border-steel-300 text-orange-500 focus:ring-orange-500"
        />
        Đăng công khai trên website
      </label>

      <button
        type="submit"
        className="min-h-11 rounded-md bg-orange-500 px-8 text-sm font-semibold text-white hover:bg-orange-600"
      >
        {submitLabel}
      </button>
    </form>
  );
}
