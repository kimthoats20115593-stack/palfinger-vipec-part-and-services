import Image from "next/image";
import clsx from "clsx";

export function CraneShowcase({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl bg-gradient-to-b from-navy-800 to-navy-900",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-6 h-40 w-40 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-10 top-12 h-24 w-24 rounded-full bg-white/5"
        aria-hidden="true"
      />
      <div className="relative flex items-end justify-center px-6 pt-10 sm:px-10">
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={1080}
          priority={priority}
          className="w-full max-w-xl drop-shadow-2xl"
        />
      </div>
      <div className="relative mt-2 border-t-4 border-navy-700 bg-navy-950 py-9">
        <div
          className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-navy-600/50"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
