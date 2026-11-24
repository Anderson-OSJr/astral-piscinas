import Link from "next/link";
import { ArrowRight, ChevronRight, MessageCircleQuestion } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SmartImage } from "@/components/site/smart-image";
import { Caustics, Wave } from "@/components/site/decor";
import { SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { JsonLd } from "@/components/site/json-ld";
import { HeroWhatsappButton } from "@/components/home/hero-whatsapp-button";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import type { ProductCardDTO } from "@/server/queries/catalog";

// ---------------------------------------------------------------------------
export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Início", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Você está em" className="text-sm">
        <ol className={tone === "dark" ? "flex flex-wrap items-center gap-1 text-white/75" : "flex flex-wrap items-center gap-1 text-muted-foreground"}>
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className={tone === "dark" ? "font-semibold text-white" : "font-semibold text-ink"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

// ---------------------------------------------------------------------------
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  crumbs,
  primary = { label: "Fazer orçamento", href: "/orcamento" },
  showWhatsapp = true,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  image: string;
  imageAlt: string;
  crumbs: Crumb[];
  primary?: { label: string; href: string } | null;
  showWhatsapp?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ocean-950 text-white">
      <SmartImage src={image} alt={imageAlt} fill priority quality={70} className="-z-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ocean-950/95 via-ocean-950/75 to-ocean-950/30" />
      <Caustics className="-z-10" opacity={0.12} />
      <div className="container-page pt-10 pb-24 sm:pt-14 sm:pb-32">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 max-w-3xl">
          {eyebrow && <p className="eyebrow text-sun-300">{eyebrow}</p>}
          <h1 className="mt-3 text-4xl leading-[1.02] font-extrabold sm:text-5xl lg:text-6xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lg text-white/85 sm:text-xl">{description}</p>}
          {(primary || showWhatsapp) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primary && (
                <Button asChild variant="sun" size="xl">
                  <Link href={primary.href}>
                    {primary.label} <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              )}
              {showWhatsapp && <HeroWhatsappButton label="Falar no WhatsApp" />}
            </div>
          )}
          {children}
        </div>
      </div>
      <Wave className="absolute inset-x-0 -bottom-px" />
    </section>
  );
}

// ---------------------------------------------------------------------------
export function ProductCard({ product }: { product: ProductCardDTO }) {
  return (
    <Link href={`/produtos/${product.slug}`} className="group card-lift flex h-full flex-col overflow-hidden rounded-3xl border bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {product.images[0] && (
          <SmartImage
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
            className="transition duration-700 group-hover:scale-105"
          />
        )}
        {product.featured && (
          <span className="bg-sun absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold text-ink">Destaque</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold tracking-wide text-sun-600 uppercase">{product.category.name}</p>
        <h3 className="mt-1.5 text-lg leading-snug font-bold text-ocean-900">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-ocean-700">
          Ver detalhes <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: ProductCardDTO[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 4) * 0.05}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </ul>
  );
}

/** Lista as categorias de uma página de solução com seus produtos. */
export function CategoryShowcase({
  categories,
}: {
  categories: { id: string; slug: string; name: string; description: string | null; products: ProductCardDTO[] }[];
}) {
  return (
    <div className="space-y-20">
      {categories.map((c) => (
        <section key={c.id} id={c.slug} aria-labelledby={`cat-${c.slug}`} className="scroll-mt-28">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 id={`cat-${c.slug}`} className="text-3xl font-extrabold text-ocean-900 sm:text-4xl">
                {c.name}
              </h2>
              {c.description && <p className="mt-2 text-lg text-muted-foreground">{c.description}</p>}
            </div>
            <Link href={`/produtos?categoria=${c.slug}`} className="inline-flex shrink-0 items-center gap-1 font-bold text-ocean-700 hover:text-ocean-900">
              Ver no catálogo <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={c.products} />
          </div>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function FaqSection({ faqs, title = "Perguntas frequentes" }: { faqs: { id: string; question: string; answer: string }[]; title?: string }) {
  if (!faqs.length) return null;
  return (
    <section className="bg-sand py-20 sm:py-24" aria-labelledby="faq-title">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading eyebrow="Dúvidas" title={<span id="faq-title">{title}</span>} />
          <p className="mt-4 flex items-start gap-2 text-muted-foreground">
            <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-sun-600" aria-hidden="true" />
            Não achou sua dúvida? Chame a loja mais perto no WhatsApp — a gente responde rapidinho.
          </p>
        </div>
        <Accordion type="single" collapsible className="rounded-3xl border bg-white px-6">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="py-5 text-left text-base font-bold text-ocean-900 hover:no-underline">{f.question}</AccordionTrigger>
              <AccordionContent className="pb-5 text-base text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </section>
  );
}

// ---------------------------------------------------------------------------
export function CtaBand({
  title = "Vamos colocar o sol para trabalhar na sua casa?",
  text = "Orçamento sem compromisso, com visita técnica da nossa equipe em Araraquara, São Carlos e região.",
  href = "/orcamento",
}: {
  title?: string;
  text?: string;
  href?: string;
}) {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="bg-ocean relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-[2rem] p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between">
        <Caustics className="-z-10" opacity={0.15} />
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-white/80">{text}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild variant="sun" size="xl">
            <Link href={href}>
              Fazer orçamento <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <HeroWhatsappButton label="WhatsApp" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function Benefits({ items, title = "Vantagens" }: { items: { title: string; text: string; icon: React.ReactNode }[]; title?: string }) {
  return (
    <>
    <h2 className="sr-only">{title}</h2>
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((b, i) => (
        <Reveal as="li" key={b.title} delay={i * 0.06}>
          <div className="h-full rounded-3xl border bg-white p-6">
            <span className="bg-sun grid size-12 place-items-center rounded-2xl text-ink">{b.icon}</span>
            <h3 className="mt-4 text-lg font-bold text-ocean-900">{b.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{b.text}</p>
          </div>
        </Reveal>
      ))}
    </ul>
    </>
  );
}

// ---------------------------------------------------------------------------
export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose-astral">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
