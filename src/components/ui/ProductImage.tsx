"use client";

import { useState } from "react";
import Image from "next/image";
import type { ReactNode } from "react";

export function ProductImage({
  src,
  alt,
  fallbackIcon,
  imageClassName,
  width = 600,
  height = 600,
}: {
  src?: string | null;
  alt: string;
  fallbackIcon: ReactNode;
  imageClassName?: string;
  width?: number;
  height?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <>{fallbackIcon}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      onError={() => setFailed(true)}
      className={imageClassName}
    />
  );
}
