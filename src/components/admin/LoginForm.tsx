"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(false);
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const result = await signIn("credentials", {
        email: data.get("email"),
        password: data.get("password"),
        redirect: false,
      });

      if (!result || result.error) {
        setError(true);
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-steel-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="text-lg font-bold text-navy-900">Đăng nhập quản trị</h1>
        <p className="mt-1 text-sm text-steel-500">PALFINGER VIPEC</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-900">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="min-h-11 w-full rounded-md border border-steel-200 px-4 py-2.5 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-semibold text-navy-900"
          >
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="min-h-11 w-full rounded-md border border-steel-200 px-4 py-2.5 text-sm focus:border-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            Email hoặc mật khẩu không đúng.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-red-500 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
