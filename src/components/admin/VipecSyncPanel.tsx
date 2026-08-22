"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { triggerVipecSync } from "@/lib/admin-actions";
import type { SyncSummary } from "@/lib/vipecSync";

export function VipecSyncPanel() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SyncSummary | null>(null);

  function handleSync() {
    startTransition(async () => {
      const summary = await triggerVipecSync();
      setResult(summary);
    });
  }

  return (
    <div className="rounded-xl border border-steel-200 bg-white p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-bold text-navy-900">Đồng bộ dữ liệu VIPEC</h2>
          <p className="mt-1 text-sm text-steel-600">
            Lấy model cẩu và sản phẩm dầu nhớt mỡ mới nhất từ vipec-vp.vn. Chỉ tạo mới, không ghi
            đè nội dung bạn đã chỉnh sửa.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSync}
          disabled={isPending}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} aria-hidden="true" />
          {isPending ? "Đang đồng bộ..." : "Đồng bộ ngay"}
        </button>
      </div>

      {result && (
        <div className="mt-4 rounded-md bg-steel-50 p-4 text-sm text-steel-700">
          <p>
            Model cẩu: <strong>+{result.craneModels.created}</strong> mới,{" "}
            {result.craneModels.skipped} đã có sẵn.
          </p>
          <p>
            Dầu nhớt mỡ: <strong>+{result.lubricants.created}</strong> mới,{" "}
            {result.lubricants.skipped} đã có sẵn.
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-red-600">
              {result.errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
