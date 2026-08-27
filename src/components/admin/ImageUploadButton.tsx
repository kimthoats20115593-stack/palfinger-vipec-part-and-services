"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { compressImageClient } from "@/lib/compressImageClient";

export function ImageUploadButton({
  onUploaded,
  multiple = false,
  label = "Tải ảnh lên",
}: {
  onUploaded: (url: string) => void;
  multiple?: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setBusy(true);

    const files = Array.from(fileList);
    let failed = 0;

    for (const rawFile of files) {
      try {
        const file = await compressImageClient(rawFile);
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        if (!res.ok) throw new Error("upload_failed");
        const data = (await res.json()) as { url: string };
        onUploaded(data.url);
      } catch {
        failed += 1;
      }
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    if (failed > 0) {
      setError(
        failed === files.length
          ? "Tải ảnh lên thất bại, vui lòng thử lại."
          : `${failed} ảnh tải lên thất bại, vui lòng thử lại với ảnh đó.`
      );
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1.5">
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-md border border-steel-200 px-3 py-2 text-sm font-semibold text-navy-900 hover:border-navy-900 disabled:opacity-60 dark:border-navy-700 dark:text-white"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Upload className="h-4 w-4" aria-hidden="true" />
        )}
        {busy ? "Đang tải lên..." : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
