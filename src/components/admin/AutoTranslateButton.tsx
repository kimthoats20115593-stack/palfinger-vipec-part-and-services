"use client";

import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";

/**
 * Reads the current value of the Vietnamese field (sourceId), sends it to
 * the free translation API, and fills the English field (targetId) with the
 * draft result. Both fields are plain uncontrolled inputs/textareas
 * identified by id, so this works without restructuring the surrounding
 * form into controlled state.
 */
export function AutoTranslateButton({
  sourceId,
  targetId,
}: {
  sourceId: string;
  targetId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    const source = document.getElementById(sourceId) as
      | HTMLTextAreaElement
      | HTMLInputElement
      | null;
    const target = document.getElementById(targetId) as
      | HTMLTextAreaElement
      | HTMLInputElement
      | null;
    if (!source || !target) return;
    const text = source.value.trim();
    if (!text) return;

    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("translate_failed");
      const data = (await res.json()) as { translated: string };
      target.value = data.translated;
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.focus();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="inline-flex items-center gap-1 text-xs font-semibold text-navy-900 hover:text-red-600 disabled:opacity-60 dark:text-white dark:hover:text-red-400"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Languages className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {busy ? "Đang dịch..." : "Dịch tự động"}
      </button>
      {error && <span className="text-[10px] text-red-600">Lỗi dịch, thử lại</span>}
    </span>
  );
}
