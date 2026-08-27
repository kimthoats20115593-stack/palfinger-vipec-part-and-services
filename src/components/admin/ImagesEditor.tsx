"use client";

import { useState } from "react";
import { Plus, X, GripVertical, ImageOff } from "lucide-react";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { ImageRotateControl } from "@/components/admin/ImageRotateControl";

const inputClasses =
  "min-h-10 w-full rounded-md border border-steel-200 px-3 py-2 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900";

export function ImagesEditor({ defaultValue }: { defaultValue?: string[] }) {
  const [rows, setRows] = useState<string[]>(
    defaultValue && defaultValue.length > 0 ? defaultValue : [""]
  );

  function updateRow(index: number, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? value : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, ""]);
  }

  function removeRow(index: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : [""]));
  }

  function addUploadedUrl(url: string) {
    setRows((prev) => {
      const firstEmpty = prev.findIndex((row) => row.trim() === "");
      if (firstEmpty !== -1) {
        return prev.map((row, i) => (i === firstEmpty ? url : row));
      }
      return [...prev, url];
    });
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-900">
        Ảnh sản phẩm
      </label>
      <p className="mb-3 text-xs text-steel-500">
        Nên có ít nhất 3–8 ảnh (không giới hạn số lượng). Ảnh đầu tiên sẽ dùng làm ảnh đại
        diện trên danh sách phụ tùng. Kéo thả để đổi thứ tự.
      </p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", String(i))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const from = Number(e.dataTransfer.getData("text/plain"));
              if (Number.isNaN(from) || from === i) return;
              setRows((prev) => {
                const next = [...prev];
                const [moved] = next.splice(from, 1);
                next.splice(i, 0, moved);
                return next;
              });
            }}
            className="flex items-center gap-2"
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-steel-300" aria-hidden="true" />
            <span className="flex h-10 w-7 shrink-0 items-center justify-center text-xs font-semibold text-steel-400">
              {i + 1}
            </span>
            {row.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row}
                alt=""
                className="h-10 w-10 shrink-0 rounded border border-steel-200 object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-dashed border-steel-200 text-steel-300">
                <ImageOff className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
            <input
              name="imageUrl"
              value={row}
              onChange={(e) => updateRow(i, e.target.value)}
              placeholder="https://..."
              className={inputClasses}
            />
            <ImageRotateControl url={row} onRotated={(newUrl) => updateRow(i, newUrl)} />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-steel-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Xóa ảnh"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-start gap-4">
        <ImageUploadButton onUploaded={addUploadedUrl} multiple label="Tải ảnh lên từ máy" />
        <button
          type="button"
          onClick={addRow}
          className="inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-red-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Hoặc dán link ảnh
        </button>
      </div>
    </div>
  );
}
