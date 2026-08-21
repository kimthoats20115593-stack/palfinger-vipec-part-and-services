"use client";

import { useTransition } from "react";
import type { InquiryStatus } from "@prisma/client";

const statusLabels: Record<InquiryStatus, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  CLOSED: "Đã đóng",
};

export function InquiryStatusSelect({
  id,
  status,
  action,
}: {
  id: string;
  status: InquiryStatus;
  action: (id: string, status: InquiryStatus) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value as InquiryStatus;
        startTransition(() => {
          action(id, next);
        });
      }}
      className="min-h-9 rounded-md border border-steel-200 px-2.5 py-1 text-xs font-semibold text-navy-900 focus:border-navy-900 focus:outline-none disabled:opacity-60"
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
