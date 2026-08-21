import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/localize";
import { NewsCover } from "@/components/illustrations/NewsCover";

type NewsCardData = {
  id: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  publishedAt: Date | string;
};

export function NewsCard({ post, seed = 0 }: { post: NewsCardData; seed?: number }) {
  const locale = useLocale();
  const t = useTranslations("news");
  const title = localize(locale, post.titleVi, post.titleEn);
  const excerpt = localize(locale, post.excerptVi, post.excerptEn);
  const date = new Date(post.publishedAt).toLocaleDateString(
    locale === "vi" ? "vi-VN" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-steel-100 bg-white transition-shadow hover:shadow-lg hover:shadow-navy-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
    >
      <NewsCover seed={seed} className="aspect-[5/3] w-full" />
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-xs font-semibold text-steel-500">{date}</span>
        <h3 className="mb-2 line-clamp-2 text-base font-bold text-navy-900">{title}</h3>
        <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-steel-700">
          {excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
          {t("readMore")}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
