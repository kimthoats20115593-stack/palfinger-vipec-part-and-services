"use client";

import { Sun, Moon } from "lucide-react";
import clsx from "clsx";

export function ThemeToggle({ light = false }: { light?: boolean }) {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Chuyển đổi chế độ sáng/tối"
      className={clsx(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
        light
          ? "border-white/20 text-steel-200 hover:text-white"
          : "border-steel-300 text-steel-600 hover:text-navy-900 dark:border-navy-700 dark:text-steel-300 dark:hover:text-white"
      )}
    >
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
      <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
    </button>
  );
}
