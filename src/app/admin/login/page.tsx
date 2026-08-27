import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
