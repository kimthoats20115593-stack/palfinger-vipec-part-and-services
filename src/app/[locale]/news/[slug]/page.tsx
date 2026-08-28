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
import { ProductContactActions } from "@/components/products/ProductContactActions";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const zaloHref = `https://zalo.me/${siteConfig.hotlineHref.replace("+", "")}`;

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

        <div className="mt-12 rounded-2xl border border-steel-100 bg-steel-50 p-6 dark:border-navy-800 dark:bg-navy-900 sm:p-8">
          <h2 className="mb-1.5 text-lg font-bold text-navy-900 dark:text-white">
            {t("ctaTitle")}
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-steel-600 dark:text-steel-300">
            {t("ctaSubtitle")}
          </p>
          <ProductContactActions
            inquiryType="CONTACT"
            callLabel={t("ctaBook")}
            zaloLabel={t("ctaZalo")}
            zaloHref={zaloHref}
            modalTitle={t("ctaModalTitle")}
            modalSubtitle={t("ctaModalSubtitle")}
          />
        </div>
      </Container>
    </article>
  );
}
