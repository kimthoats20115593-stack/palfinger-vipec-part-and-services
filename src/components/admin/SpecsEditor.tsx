"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type Spec = { label: string; value: string };

const inputClasses =
  "min-h-10 w-full rounded-md border border-steel-200 px-3 py-2 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900";

export function SpecsEditor({ defaultValue }: { defaultValue?: Spec[] }) {
  const [rows, setRows] = useState<Spec[]>(
    defaultValue && defaultValue.length > 0 ? defaultValue : [{ label: "", value: "" }]
  );

  function updateRow(index: number, field: "label" | "value", newValue: string) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: newValue } : row))
    );
  }

  function addRow() {
    setRows((prev) => [...prev, { label: "", value: "" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-900">
        Thông số kỹ thuật
      </label>
      <p className="mb-3 text-xs text-steel-500">
        Dùng cho mục &quot;So sánh phụ tùng&quot; trên website. Ví dụ: Áp suất làm việc / 350 bar.
      </p>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2">
            <input
              name="specLabel"
              value={row.label}
              onChange={(e) => updateRow(i, "label", e.target.value)}
              placeholder="Tên thông số"
              className={inputClasses}
            />
            <input
              name="specValue"
              value={row.value}
              onChange={(e) => updateRow(i, "value", e.target.value)}
              placeholder="Giá trị"
              className={inputClasses}
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-steel-400 hover:bg-red-50 hover:text-red-600"
              aria-label="Xóa dòng"
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
        Thêm thông số
      </button>
    </div>
  );
}
