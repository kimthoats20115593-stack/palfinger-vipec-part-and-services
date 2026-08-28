"use client";

import { useState } from "react";
import { Film } from "lucide-react";
import { ImageUploadButton } from "@/components/admin/ImageUploadButton";
import { VideoUploadButton } from "@/components/admin/VideoUploadButton";

type MediaItem = { url: string; type: "image" | "video" };

/**
 * Separate from the single cover image field: this lets an admin batch-upload
 * extra photos and videos to use inside the article body, then insert the
 * matching Markdown snippet into contentVi/contentEn with one click instead
 * of hand-typing `![alt](url)`. Nothing here is saved directly -- once
 * inserted, the URL simply lives inside the content text like any other
 * Markdown.
 */
export function NewsMediaEditor({
  onInsert,
}: {
  onInsert: (snippet: string, target: "vi" | "en") => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);

  function addImage(url: string) {
    setItems((prev) => [...prev, { url, type: "image" }]);
  }
  function addVideo(url: string) {
    setItems((prev) => [...prev, { url, type: "video" }]);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-900">
        Ảnh / video khác chèn trong bài viết
      </label>
      <p className="mb-3 text-xs text-steel-500">
        Khác với ảnh bìa ở trên. Tải lên (chọn được nhiều ảnh cùng lúc), rồi bấm &quot;Chèn vào
        VI/EN&quot; để tự động thêm vào cuối phần Nội dung tương ứng — không cần tự gõ cú pháp.
      </p>
      <div className="flex flex-wrap items-start gap-4">
        <ImageUploadButton onUploaded={addImage} multiple label="Tải ảnh lên (chọn nhiều)" />
        <VideoUploadButton onUploaded={addVideo} label="Tải video lên" />
      </div>

      {items.length > 0 && (
        <div className="mt-3 space-y-2">
          {items.map((item, i) => (
            <div
              key={item.url + i}
              className="flex items-center gap-2 rounded-md border border-steel-200 p-2"
            >
              {item.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded border border-steel-200 object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-steel-200 bg-steel-50 text-steel-500">
                  <Film className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
              <input
                readOnly
                value={item.url}
                className="min-h-9 flex-1 rounded-md border border-steel-200 bg-steel-50 px-2 py-1 text-xs text-steel-500"
              />
              <button
                type="button"
                onClick={() =>
                  onInsert(
                    item.type === "image" ? `![](${item.url})` : `[Xem video](${item.url})`,
                    "vi"
                  )
                }
                className="shrink-0 rounded-md border border-steel-200 px-2.5 py-2 text-xs font-semibold text-navy-900 hover:border-navy-900"
              >
                Chèn vào VI
              </button>
              <button
                type="button"
                onClick={() =>
                  onInsert(
                    item.type === "image" ? `![](${item.url})` : `[Watch video](${item.url})`,
                    "en"
                  )
                }
                className="shrink-0 rounded-md border border-steel-200 px-2.5 py-2 text-xs font-semibold text-navy-900 hover:border-navy-900"
              >
                Chèn vào EN
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
