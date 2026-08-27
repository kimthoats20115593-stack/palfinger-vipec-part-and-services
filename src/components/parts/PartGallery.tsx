"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PartGallery({
  images,
  alt,
  fallback,
}: {
  images: string[];
  alt: string;
  fallback: React.ReactNode;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-steel-50 dark:bg-navy-900">
        {fallback}
      </div>
    );
  }

  const current = images[active];

  return (
    <div>
      <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-steel-50 dark:bg-navy-900">
        <Image
          key={current}
          src={current}
          alt={alt}
          width={700}
          height={700}
          className="h-full w-full object-contain p-8"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-navy-950/90 dark:text-white"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-navy-950/90 dark:text-white"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-navy-950/70 px-2.5 py-1 text-xs font-semibold text-white">
              {active + 1}/{images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={
                "aspect-square overflow-hidden rounded-lg border-2 bg-steel-50 transition-colors dark:bg-navy-900 " +
                (i === active
                  ? "border-red-500"
                  : "border-transparent hover:border-steel-300 dark:hover:border-navy-600")
              }
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === active}
            >
              <Image
                src={src}
                alt=""
                width={120}
                height={120}
                className="h-full w-full object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
