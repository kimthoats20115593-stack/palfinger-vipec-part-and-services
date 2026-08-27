"use client";

import { useState } from "react";
import { RotateCcw, RotateCw, Loader2 } from "lucide-react";
import { rotateImageClient } from "@/lib/rotateImageClient";

export function ImageRotateControl({
  url,
  onRotated,
}: {
  url: string;
  onRotated: (newUrl: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function rotate(direction: 1 | -1) {
    if (!url.trim() || busy) return;
    setBusy(true);
    setError(false);
    try {
      const blob = await rotateImageClient(url, direction);
      const body = new FormData();
      body.set("file", new File([blob], "rotated.jpg", { type: "image/jpeg" }));
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (!res.ok) throw new Error("upload_failed");
      const data = (await res.json()) as { url: string };
      onRotated(data.url);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin text-steel-400" aria-hidden="true" />
      ) : (
        <>
          <button
            type="button"
            onClick={() => rotate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-steel-500 hover:bg-steel-100 hover:text-navy-900 dark:text-steel-300 dark:hover:bg-navy-800"
            aria-label="Xoay trái"
            title="Xoay trái 90°"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => rotate(1)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-steel-500 hover:bg-steel-100 hover:text-navy-900 dark:text-steel-300 dark:hover:bg-navy-800"
            aria-label="Xoay phải"
            title="Xoay phải 90°"
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      )}
      {error && <span className="text-[10px] text-red-600">Lỗi xoay ảnh</span>}
    </div>
  );
}
