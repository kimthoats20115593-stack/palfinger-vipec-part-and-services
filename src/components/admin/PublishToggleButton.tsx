"use client";

import { Eye, EyeOff } from "lucide-react";

export function PublishToggleButton({
  published,
  action,
}: {
  published: boolean;
  action: () => Promise<void>;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className={
          published
            ? "inline-flex h-9 items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-2.5 text-xs font-semibold text-green-700 hover:border-green-300"
            : "inline-flex h-9 items-center gap-1.5 rounded-md border border-steel-200 bg-steel-50 px-2.5 text-xs font-semibold text-steel-500 hover:border-steel-300"
        }
        title={published ? "Đang hiển thị công khai — bấm để ẩn" : "Đang ẩn — bấm để hiển thị lại"}
      >
        {published ? (
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {published ? "Đang hiện" : "Đang ẩn"}
      </button>
    </form>
  );
}
