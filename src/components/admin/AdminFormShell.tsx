"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

/**
 * Wraps admin create/edit forms with a client-side submit instead of a
 * native Server Action form post + redirect(). The Hostinger deployment
 * fails to load the page after a Server-Action-triggered redirect (the
 * same root issue that broke admin login), so this calls the action
 * directly and navigates with next/navigation's router on success.
 */
export function AdminFormShell({
  action,
  redirectTo,
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  redirectTo: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setError(false);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await action(formData);
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError(true);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Có lỗi xảy ra khi lưu, vui lòng thử lại.
        </p>
      )}
    </form>
  );
}
