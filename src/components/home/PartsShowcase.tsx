import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { PartCard } from "@/components/parts/PartCard";

export async function PartsShowcase() {
  const t = await getTranslations("home");
  const parts = await prisma.part.findMany({
    where: { featured: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  if (parts.length === 0) return null;

  return (
    <section className="bg-white py-20">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading title={t("partsTitle")} subtitle={t("partsSubtitle")} />
          <ButtonLink href="/parts" variant="ghost" className="shrink-0">
            {t("partsCta")}
          </ButtonLink>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {parts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      </Container>
    </section>
  );
}
