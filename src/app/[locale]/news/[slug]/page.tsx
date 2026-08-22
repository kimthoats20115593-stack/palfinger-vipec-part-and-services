import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/localize";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { NewsCover } from "@/components/illustrations/NewsCover";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.newsPost.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: localize(locale, post.titleVi, post.titleEn),
    description: localize(locale, post.excerptVi, post.excerptEn),
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  const title = localize(locale, post.titleVi, post.titleEn);
  const content = localize(locale, post.contentVi, post.contentEn);
  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === "vi" ? "vi-VN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);

  return (
    <article className="py-12">
      <Container className="mx-auto max-w-3xl">
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t("backToNews")}
        </Link>

        <NewsCover seed={0} className="mb-8 aspect-[16/7] w-full rounded-xl" />

        <p className="mb-2 text-sm font-semibold text-steel-500">
          {t("publishedOn")} {date}
        </p>
        <h1 className="mb-8 text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h1>

        <div className="space-y-5 text-base leading-relaxed text-steel-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Container>
    </article>
  );
}
