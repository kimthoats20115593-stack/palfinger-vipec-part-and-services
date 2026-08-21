"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  confirmMessage = "Bạn có chắc muốn xóa mục này?",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="flex h-9 w-9 items-center justify-center rounded-md text-steel-500 hover:bg-red-50 hover:text-red-600"
        aria-label="Xóa"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
