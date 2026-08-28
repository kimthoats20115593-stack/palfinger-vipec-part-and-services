import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/localize";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { NewsCover } from "@/components/illustrations/NewsCover";
import { ProductImage } from "@/components/ui/ProductImage";
import { MarkdownContent } from "@/components/ui/MarkdownContent";

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
  return (
    <article className="py-12">
      <Container className="mx-auto max-w-3xl">
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-steel-600 hover:text-navy-900 dark:text-steel-300 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t("backToNews")}
        </Link>

        <div className="mb-8 aspect-[16/7] w-full overflow-hidden rounded-xl bg-steel-50 dark:bg-navy-950">
          <ProductImage
            src={post.coverImage && post.coverImage !== "default" ? post.coverImage : null}
            alt={title}
            width={1200}
            height={525}
            imageClassName="h-full w-full object-cover"
            fallbackIcon={<NewsCover seed={0} className="h-full w-full" />}
          />
        </div>

        <p className="mb-2 text-sm font-semibold text-steel-500 dark:text-steel-400">
          {t("publishedOn")} {date}
        </p>
        <h1 className="mb-8 text-3xl font-bold text-navy-900 dark:text-white sm:text-4xl">{title}</h1>

        <MarkdownContent content={content} size="article" />
      </Container>
    </article>
  );
}
