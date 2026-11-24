import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Minus, Target } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CtaBand, PageHero, ProductGrid } from "@/components/site/page-blocks";
import { SmartImage } from "@/components/site/smart-image";
import { getProducts } from "@/server/queries/catalog";
import { pageMetadata } from "@/lib/seo";
import { POOL_TYPES } from "@/lib/pool-types";

export const revalidate = 3600;
export const dynamicParams = false;

const paramsSchema = z.object({ slug: z.enum(POOL_TYPES.map((t) => t.slug) as [string, ...string[]]) });

export function generateStaticParams() {
  return POOL_TYPES.map((t) => ({ slug: t.slug }));
}

function findType(slug: string) {
  const parsed = paramsSchema.safeParse({ slug });
  return parsed.success ? POOL_TYPES.find((t) => t.slug === parsed.data.slug) : undefined;
}

export async function generateMetadata({ params }: PageProps<"/piscinas/[slug]">): Promise<Metadata> {
  const type = findType((await params).slug);
  if (!type) return {};
  return pageMetadata({
    title: `${type.name} em Araraquara`,
    description: `${type.short} ${type.intro.slice(0, 90)}… Construção em Araraquara, São Carlos e região com a Astral.`,
    path: `/piscinas/${type.slug}`,
    image: type.image,
  });
}

export default async function PoolTypePage({ params }: PageProps<"/piscinas/[slug]">) {
  const type = findType((await params).slug);
  if (!type) notFound();
  const products = await getProducts({ category: "piscinas" });
  const others = POOL_TYPES.filter((t) => t.slug !== type.slug);

  return (
    <>
      <PageHero
        eyebrow="Piscinas"
        title={type.name}
        description={type.short}
        image={type.image}
        imageAlt={type.imageAlt}
        crumbs={[
          { name: "Piscinas", path: "/piscinas" },
          { name: type.name, path: `/piscinas/${type.slug}` },
        ]}
        primary={{ label: "Monte a sua", href: "/piscinas#monte-sua-piscina" }}
      />
      <section className="container-page grid gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xl leading-relaxed text-ink/85">{type.intro}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border bg-white p-6">
              <h2 className="text-xl font-bold text-ocean-900">Vantagens</h2>
              <ul className="mt-4 space-y-3">
                {type.pros.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 size-5 shrink-0 text-[#0f7a40]" aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border bg-white p-6">
              <h2 className="text-xl font-bold text-ocean-900">Pontos de atenção</h2>
              <ul className="mt-4 space-y-3">
                {type.cons.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Minus className="mt-0.5 size-5 shrink-0 text-sun-600" aria-hidden="true" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 flex gap-3 rounded-3xl bg-sun-100 p-5 font-medium">
            <Target className="mt-0.5 size-5 shrink-0 text-sun-600" aria-hidden="true" />
            <span>
              <strong>Ideal para:</strong> {type.idealFor}
            </span>
          </p>
        </div>
        <aside className="space-y-4">
          <p className="eyebrow text-sun-600">Compare também</p>
          {others.map((o) => (
            <Link key={o.slug} href={`/piscinas/${o.slug}`} className="group card-lift flex items-center gap-4 rounded-3xl border bg-white p-3">
              <span className="relative size-24 shrink-0 overflow-hidden rounded-2xl">
                <SmartImage src={o.image} alt={o.imageAlt} fill sizes="6rem" />
              </span>
              <span>
                <span className="block font-bold text-ocean-900">{o.name}</span>
                <span className="block text-sm text-muted-foreground">{o.short}</span>
              </span>
            </Link>
          ))}
          <Button asChild variant="ocean" size="xl" className="w-full">
            <Link href="/dicas/piscina-de-vinil-fibra-ou-azulejo">
              Ler o guia completo <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </aside>
      </section>
      <section className="container-page pb-10">
        <h2 className="text-3xl font-extrabold text-ocean-900">Piscinas e serviços</h2>
        <div className="mt-8">
          <ProductGrid products={products} />
        </div>
      </section>
      <CtaBand title={`Quer uma ${type.name.toLowerCase()}?`} href={`/orcamento?interesse=PISCINA&tipo=${type.slug}`} />
    </>
  );
}
