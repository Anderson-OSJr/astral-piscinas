import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Wrench } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Breadcrumbs, CtaBand, Markdown, ProductGrid } from "@/components/site/page-blocks";
import { ProductGallery } from "@/components/site/product-gallery";
import { HeroWhatsappButton } from "@/components/home/hero-whatsapp-button";
import { JsonLd } from "@/components/site/json-ld";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/server/queries/catalog";
import { pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site-url";
import { BRAND, SOLUTIONS } from "@/lib/site";

export const revalidate = 3600;

const slugSchema = z.string().regex(/^[a-z0-9-]+$/).max(120);

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((p) => ({ slug: p.slug }));
}

async function load(params: PageProps<"/produtos/[slug]">["params"]) {
  const parsed = slugSchema.safeParse((await params).slug);
  return parsed.success ? getProductBySlug(parsed.data) : null;
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const product = await load(params);
  if (!product) return {};
  return pageMetadata({
    title: `${product.name} em Araraquara`,
    description: `${product.shortDescription} Consulte disponibilidade e orçamento nas lojas Astral de Araraquara e São Carlos.`,
    path: `/produtos/${product.slug}`,
    image: product.images[0],
  });
}

export default async function ProductPage({ params }: PageProps<"/produtos/[slug]">) {
  const product = await load(params);
  if (!product) notFound();
  const related = await getRelatedProducts(product.categoryId, product.id);
  const solution = SOLUTIONS.find((s) => s.section === product.category.section);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images,
    category: product.category.name,
    url: absoluteUrl(`/produtos/${product.slug}`),
    brand: { "@type": "Brand", name: BRAND.searchName },
    additionalProperty: product.specs.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
  };

  return (
    <>
      <div className="container-page py-8">
        <Breadcrumbs
          tone="light"
          items={[
            { name: "Produtos", path: "/produtos" },
            { name: product.category.name, path: `/produtos?categoria=${product.category.slug}` },
            { name: product.name, path: `/produtos/${product.slug}` },
          ]}
        />
      </div>
      <section className="container-page grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <Link href={`/produtos?categoria=${product.category.slug}`} className="eyebrow text-sun-600 hover:underline">
            {product.category.name}
          </Link>
          <h1 className="mt-3 text-4xl leading-tight font-extrabold text-ocean-900 sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-xl text-muted-foreground">{product.shortDescription}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="sun" size="xl">
              <Link href={`/orcamento?${new URLSearchParams({ interesse: interestFromSection(product.category.section), produto: product.name })}`}>
                Pedir orçamento <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <HeroWhatsappButton label="Tirar dúvida no WhatsApp" variant="whatsapp" />
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { Icon: Truck, text: "Entrega rápida na região" },
              { Icon: Wrench, text: "Instalação com equipe própria" },
              { Icon: ShieldCheck, text: "Desde 1986 no mercado" },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2 rounded-2xl bg-sand p-3 text-sm font-semibold">
                <Icon className="size-5 shrink-0 text-sun-600" aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>

          {product.specs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-ocean-900">Ficha técnica</h2>
              <dl className="mt-4 divide-y overflow-hidden rounded-2xl border bg-white">
                {product.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[40%_1fr] gap-4 px-4 py-3 text-sm">
                    <dt className="font-semibold text-muted-foreground">{s.label}</dt>
                    <dd className="text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-bold text-ocean-900">Sobre o produto</h2>
            <div className="mt-2">
              <Markdown content={product.description} />
            </div>
          </div>

          {solution && (
            <Link href={solution.href} className="mt-6 inline-flex items-center gap-1 font-bold text-ocean-700 hover:text-ocean-900">
              Ver tudo sobre {solution.label.toLowerCase()} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page pb-8" aria-labelledby="relacionados">
          <h2 id="relacionados" className="text-3xl font-extrabold text-ocean-900">
            Você também pode gostar
          </h2>
          <div className="mt-8">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
      <CtaBand />
      <JsonLd data={jsonLd} />
    </>
  );
}

function interestFromSection(section: string | null) {
  switch (section) {
    case "aquecimento-solar":
      return "AQUECIMENTO_SOLAR";
    case "energia-solar":
      return "FOTOVOLTAICA";
    case "piscinas":
      return "PISCINA";
    case "tratamento":
      return "TRATAMENTO";
    case "lazer":
      return "LAZER";
    case "banho-e-conforto":
      return "BANHO_CONFORTO";
    default:
      return "OUTRO";
  }
}
