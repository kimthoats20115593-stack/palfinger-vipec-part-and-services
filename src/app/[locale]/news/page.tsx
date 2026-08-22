import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { NewsCard } from "@/components/news/NewsCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  const posts = await prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
      <section className="py-16">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-sm text-steel-600 dark:text-steel-400">—</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <NewsCard key={post.id} post={post} seed={i} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
