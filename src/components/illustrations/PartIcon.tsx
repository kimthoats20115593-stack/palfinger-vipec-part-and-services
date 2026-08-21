import type { ReactElement } from "react";

export type PartIconVariant =
  | "cylinder"
  | "valve"
  | "gear"
  | "hook"
  | "cable"
  | "boom"
  | "pump"
  | "control";

const paths: Record<PartIconVariant, ReactElement> = {
  cylinder: (
    <>
      <rect x="14" y="26" width="44" height="16" rx="3" />
      <rect x="52" y="30" width="20" height="8" rx="2" />
      <circle cx="16" cy="34" r="5" fill="none" strokeWidth="3" />
    </>
  ),
  valve: (
    <>
      <rect x="24" y="14" width="16" height="16" rx="2" />
      <path d="M32 30v10M20 40h24v14H20z" />
      <circle cx="32" cy="47" r="4" fill="none" strokeWidth="3" />
    </>
  ),
  gear: (
    <>
      <circle cx="32" cy="32" r="12" />
      <circle cx="32" cy="32" r="4" fill="none" strokeWidth="3" />
      <path d="M32 10v6M32 50v6M10 32h6M48 32h6M16.9 16.9l4.2 4.2M42.9 42.9l4.2 4.2M16.9 47.1l4.2-4.2M42.9 21.1l4.2-4.2" />
    </>
  ),
  hook: (
    <>
      <path
        d="M26 12v20a10 10 0 1 0 20 0v-6"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="26" cy="12" r="4" />
    </>
  ),
  cable: (
    <>
      <path
        d="M10 44c8-14 16 14 24 0s16-14 24 0"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="10" cy="44" r="3" />
      <circle cx="58" cy="44" r="3" />
    </>
  ),
  boom: (
    <>
      <rect x="8" y="42" width="48" height="8" rx="2" />
      <path d="M14 42 42 16" strokeWidth="6" strokeLinecap="round" />
      <circle cx="14" cy="42" r="4" />
      <circle cx="42" cy="16" r="4" />
    </>
  ),
  pump: (
    <>
      <circle cx="28" cy="34" r="14" />
      <path d="M42 34h14M28 20v-6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="28" cy="34" r="5" fill="none" strokeWidth="3" />
    </>
  ),
  control: (
    <>
      <rect x="12" y="16" width="40" height="32" rx="4" />
      <path d="M20 26h24M20 34h16M20 42h20" strokeWidth="3" />
    </>
  ),
};

export function PartIcon({
  variant,
  className,
}: {
  variant: PartIconVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[variant]}
    </svg>
  );
}
