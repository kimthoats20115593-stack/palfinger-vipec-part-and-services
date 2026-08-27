"use client";

import { useState } from "react";
import { Plus, X, GripVertical } from "lucide-react";

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

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-900">
        Ảnh sản phẩm (URL)
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
            <input
              name="imageUrl"
              value={row}
              onChange={(e) => updateRow(i, e.target.value)}
              placeholder="https://..."
              className={inputClasses}
            />
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
      <button
        type="button"
        onClick={addRow}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-red-600"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Thêm ảnh
      </button>
    </div>
  );
}
