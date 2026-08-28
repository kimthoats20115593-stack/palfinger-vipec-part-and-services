"use client";

import { useRef, useState } from "react";
import { Loader2, Video } from "lucide-react";

const MAX_VIDEO_MB = 25;

export function VideoUploadButton({
  onUploaded,
  label = "Tải video lên",
}: {
  onUploaded: (url: string) => void;
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
    let tooLarge = 0;

    for (const file of files) {
      if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
        tooLarge += 1;
        continue;
      }
      try {
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
    if (tooLarge > 0 || failed > 0) {
      const parts: string[] = [];
      if (tooLarge > 0) parts.push(`${tooLarge} video vượt quá ${MAX_VIDEO_MB}MB`);
      if (failed > 0) parts.push(`${failed} video tải lên thất bại`);
      setError(parts.join(", ") + ". Thử nén video nhỏ hơn rồi tải lại.");
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
          <Video className="h-4 w-4" aria-hidden="true" />
        )}
        {busy ? "Đang tải lên..." : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-[11px] text-steel-400">Tối đa {MAX_VIDEO_MB}MB mỗi video.</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
