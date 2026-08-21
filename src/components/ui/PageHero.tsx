import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-navy-800 bg-navy-900 py-16">
      <Container>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
          {eyebrow}
        </p>
        <h1 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-steel-200">
            {subtitle}
          </p>
        )}
      </Container>
    </section>
  );
}
