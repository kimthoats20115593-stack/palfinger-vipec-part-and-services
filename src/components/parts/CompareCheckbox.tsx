"use client";

import { useSyncExternalStore } from "react";
import { Scale } from "lucide-react";
import { subscribe, getSnapshot, getServerSnapshot, toggleCompare } from "@/lib/compareStore";

export function CompareCheckbox({ id, label }: { id: string; label: string }) {
  const compareIds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const checked = compareIds.includes(id);

  return (
    <label
      className="flex min-h-11 cursor-pointer items-center gap-1.5 text-xs font-semibold text-steel-600 hover:text-navy-900 dark:text-steel-300 dark:hover:text-white"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          toggleCompare(id);
        }}
        onClick={(e) => e.stopPropagation()}
        className="h-4 w-4 rounded border-steel-300 text-red-500 focus:ring-red-500"
        aria-label={label}
      />
      <Scale className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </label>
  );
}
