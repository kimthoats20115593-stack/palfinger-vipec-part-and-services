import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { NewsCard } from "@/components/news/NewsCard";

export async function NewsPreview() {
  const t = await getTranslations("home");
  const posts = await prisma.newsPost.findMany({
    where: { published: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  if (posts.length === 0) return null;

  return (
    <section className="bg-steel-50 py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading title={t("newsTitle")} />
          <ButtonLink href="/news" variant="ghost" className="shrink-0">
            {t("newsCta")}
          </ButtonLink>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <NewsCard key={post.id} post={post} seed={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
