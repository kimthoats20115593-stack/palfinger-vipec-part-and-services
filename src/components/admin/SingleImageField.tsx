"use client";

import { useState } from "react";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { ImageRotateControl } from "@/components/admin/ImageRotateControl";

const inputClasses =
  "min-h-11 w-full rounded-md border border-steel-200 px-4 py-2.5 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900";
const labelClasses = "mb-1.5 block text-sm font-semibold text-navy-900";

export function SingleImageField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <div>
      <label htmlFor={name} className={labelClasses}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        {value.trim() && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-11 w-11 shrink-0 rounded border border-steel-200 object-cover"
          />
        )}
        <input
          id={name}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://..."
          className={inputClasses}
        />
        {value.trim() && <ImageRotateControl url={value} onRotated={setValue} />}
      </div>
      <div className="mt-2">
        <ImageUploadButton onUploaded={setValue} label="Tải ảnh lên từ máy" />
      </div>
    </div>
  );
}
