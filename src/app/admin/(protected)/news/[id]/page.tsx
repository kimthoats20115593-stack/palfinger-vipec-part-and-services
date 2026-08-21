import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { updateNewsPost } from "@/lib/admin-actions";
import { NewsForm } from "@/components/admin/NewsForm";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) notFound();

  const action = updateNewsPost.bind(null, id);

  return (
    <div>
      <Link
        href="/admin/news"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Quay lại danh sách
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-navy-900">Sửa bài viết: {post.titleVi}</h1>
      <div className="max-w-4xl rounded-xl border border-steel-200 bg-white p-6 sm:p-8">
        <NewsForm action={action} defaultValues={post} submitLabel="Lưu thay đổi" />
      </div>
    </div>
  );
}
