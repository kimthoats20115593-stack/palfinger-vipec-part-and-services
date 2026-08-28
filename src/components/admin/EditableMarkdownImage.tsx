"use client";

import { useRef, useState } from "react";
import { Loader2, RefreshCw, X } from "lucide-react";
import { compressImageClient } from "@/lib/compressImageClient";

/**
 * Used only inside the News content "Xem trước" panel (NewsForm) so an admin
 * can delete or swap an image right where it renders in the article, instead
 * of having to switch back to raw Markdown and find the matching line.
 */
export function EditableMarkdownImage({
  src,
  alt,
  onDelete,
  onReplace,
}: {
  src: string;
  alt?: string;
  onDelete: (src: string) => void;
  onReplace: (oldSrc: string, newSrc: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleReplaceFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const compressed = await compressImageClient(file);
      const body = new FormData();
      body.set("file", compressed);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      if (!res.ok) throw new Error("upload_failed");
      const data = (await res.json()) as { url: string };
      onReplace(src, data.url);
    } catch {
      // Silent failure -- the admin can just try the button again.
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <span className="relative my-6 block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="max-h-[420px] w-full rounded-xl border border-steel-100 object-cover"
      />
      <span className="absolute right-2 top-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          title="Thay ảnh khác"
          aria-label="Thay ảnh khác"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-navy-950/80 text-white shadow hover:bg-navy-900 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          onClick={() => onDelete(src)}
          title="Xoá ảnh này"
          aria-label="Xoá ảnh này"
          className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600/90 text-white shadow hover:bg-red-600"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleReplaceFile(e.target.files)}
      />
    </span>
  );
}
