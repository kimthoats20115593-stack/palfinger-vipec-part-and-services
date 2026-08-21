import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deleteNewsPost } from "@/lib/admin-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminNewsPage() {
  const posts = await prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy-900">Tin tức</h1>
        <Link
          href="/admin/news/new"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-red-500 px-5 text-sm font-semibold text-white hover:bg-red-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Viết bài mới
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-steel-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steel-200 text-left text-xs font-bold uppercase tracking-wide text-steel-500">
              <th className="px-5 py-3">Tiêu đề (VI)</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-steel-100 last:border-0">
                <td className="px-5 py-3 font-semibold text-navy-900">{post.titleVi}</td>
                <td className="px-5 py-3 font-mono text-xs text-steel-600">{post.slug}</td>
                <td className="px-5 py-3">
                  {post.published ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Đã đăng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-steel-500">
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> Bản nháp
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/news/${post.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-steel-500 hover:bg-steel-100 hover:text-navy-900"
                      aria-label="Sửa"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <DeleteButton action={deleteNewsPost.bind(null, post.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-steel-500">
                  Chưa có bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
