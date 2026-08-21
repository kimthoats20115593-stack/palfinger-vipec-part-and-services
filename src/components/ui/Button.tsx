import { ReactNode } from "react";
import clsx from "clsx";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-600",
  secondary:
    "bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-900",
  ghost:
    "bg-transparent text-navy-900 border border-steel-300 hover:bg-steel-50 focus-visible:outline-navy-900",
};

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
  disabled,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  href: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx(baseClasses, variantClasses[variant], className)}>
      {children}
    </Link>
  );
}
