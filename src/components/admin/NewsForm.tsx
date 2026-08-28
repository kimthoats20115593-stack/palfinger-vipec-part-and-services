"use client";

import { useState } from "react";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { AutoTranslateButton } from "@/components/admin/AutoTranslateButton";
import { SingleImageField } from "@/components/admin/SingleImageField";
import { NewsMediaEditor } from "@/components/admin/NewsMediaEditor";

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
  coverImage?: string | null;
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
  const [contentVi, setContentVi] = useState(defaultValues?.contentVi ?? "");
  const [contentEn, setContentEn] = useState(defaultValues?.contentEn ?? "");

  function insertMedia(snippet: string, target: "vi" | "en") {
    const setter = target === "vi" ? setContentVi : setContentEn;
    setter((prev) => (prev.trim() ? `${prev.trimEnd()}\n\n${snippet}\n\n` : `${snippet}\n\n`));
  }

  return (
    <AdminFormShell action={action} redirectTo="/admin/news" className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="titleVi" className={labelClasses}>Tiêu đề (VI) *</label>
          <input id="titleVi" name="titleVi" required defaultValue={defaultValues?.titleVi} className={inputClasses} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label htmlFor="titleEn" className="text-sm font-semibold text-navy-900">Tiêu đề (EN) *</label>
            <AutoTranslateButton sourceId="titleVi" targetId="titleEn" />
          </div>
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

      <SingleImageField
        name="coverImage"
        label="Ảnh bìa (không bắt buộc — để trống sẽ dùng ảnh minh họa mặc định)"
        defaultValue={defaultValues?.coverImage === "default" ? "" : defaultValues?.coverImage}
      />

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
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="excerptEn" className={labelClasses}>Tóm tắt (EN) *</label>
            <AutoTranslateButton sourceId="excerptVi" targetId="excerptEn" />
          </div>
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

      <NewsMediaEditor onInsert={insertMedia} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contentVi" className={labelClasses}>Nội dung (VI) *</label>
          <textarea
            id="contentVi"
            name="contentVi"
            required
            rows={10}
            value={contentVi}
            onChange={(e) => setContentVi(e.target.value)}
            className={inputClasses}
          />
          <p className="mt-1 text-xs text-steel-500">
            Dùng dòng trống để tách đoạn văn. Hỗ trợ Markdown: <code>### Tiêu đề</code>,{" "}
            <code>**đậm**</code>, danh sách &quot;-&quot;, chèn ảnh bằng{" "}
            <code>![mô tả](URL ảnh)</code> và chèn video bằng{" "}
            <code>[Xem video](URL video)</code> — hoặc dùng nút &quot;Chèn vào VI/EN&quot; ở
            trên thay vì tự gõ.
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="contentEn" className={labelClasses}>Nội dung (EN) *</label>
            <AutoTranslateButton sourceId="contentVi" targetId="contentEn" />
          </div>
          <textarea
            id="contentEn"
            name="contentEn"
            required
            rows={10}
            value={contentEn}
            onChange={(e) => setContentEn(e.target.value)}
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
          className="h-5 w-5 rounded border-steel-300 text-red-500 focus:ring-red-500"
        />
        Đăng công khai trên website
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
