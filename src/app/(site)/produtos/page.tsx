import type { Metadata } from "next";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { z } from "zod";
import { Breadcrumbs, CtaBand, ProductGrid } from "@/components/site/page-blocks";
import { getCategories, getProducts } from "@/server/queries/catalog";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Catálogo de Produtos: Solar, Piscinas e Lazer",
  description:
    "Catálogo completo da Astral: aquecedores solares, energia fotovoltaica, piscinas, produtos químicos, bombas, filtros, saunas, spas e móveis outdoor.",
  path: "/produtos",
});

const searchSchema = z.object({
  categoria: z.string().regex(/^[a-z0-9-]+$/).max(60).optional().catch(undefined),
  q: z.string().trim().max(80).optional().catch(undefined),
});

export default async function CatalogPage({ searchParams }: PageProps<"/produtos">) {
  const { categoria, q } = searchSchema.parse(await searchParams);
  const [categories, products] = await Promise.all([getCategories(), getProducts({ category: categoria, q })]);
  const active = categories.find((c) => c.slug === categoria);

  const href = (params: { categoria?: string; q?: string }) => {
    const sp = new URLSearchParams();
    if (params.categoria) sp.set("categoria", params.categoria);
    if (params.q) sp.set("q", params.q);
    const s = sp.toString();
    return s ? `/produtos?${s}` : "/produtos";
  };

  return (
    <>
      <section className="border-b bg-sand">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs tone="light" items={[{ name: "Produtos", path: "/produtos" }]} />
          <h1 className="mt-6 text-4xl font-extrabold text-ocean-900 sm:text-5xl">{active ? active.name : "Catálogo completo"}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            {active?.description ?? "Tudo para aquecimento solar, energia fotovoltaica, piscinas e lazer — com estoque nas 4 lojas."}
          </p>
          <form action="/produtos" role="search" className="mt-8 flex max-w-xl items-center gap-2 rounded-full border bg-white p-1.5 pl-5 shadow-sm focus-within:ring-2 focus-within:ring-ocean-500">
            {categoria && <input type="hidden" name="categoria" value={categoria} />}
            <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="catalog-q" className="sr-only">
              Buscar produto
            </label>
            <input
              id="catalog-q"
              name="q"
              defaultValue={q}
              placeholder="Buscar: cloro, bomba, aquecedor…"
              className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none"
            />
            <button type="submit" className="bg-sun h-11 rounded-full px-5 font-bold text-ink">
              Buscar
            </button>
          </form>
        </div>
      </section>

      <div className="container-page py-10">
        <nav aria-label="Filtrar por categoria" className="-mx-4 overflow-x-auto px-4 pb-2">
          <ul className="flex gap-2 sm:flex-wrap">
            <li>
              <Link
                href={href({ q })}
                className={cn(
                  "inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold whitespace-nowrap",
                  !categoria ? "border-ocean-900 bg-ocean-900 text-white" : "bg-white hover:bg-sand",
                )}
                aria-current={!categoria ? "page" : undefined}
              >
                Todos
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={href({ categoria: c.slug, q })}
                  className={cn(
                    "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold whitespace-nowrap",
                    categoria === c.slug ? "border-ocean-900 bg-ocean-900 text-white" : "bg-white hover:bg-sand",
                  )}
                  aria-current={categoria === c.slug ? "page" : undefined}
                >
                  {c.name}
                  <span className="text-xs opacity-60">{c._count.products}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {products.length} {products.length === 1 ? "produto" : "produtos"}
            {q && (
              <>
                {" "}
                para “<strong className="text-ink">{q}</strong>”
              </>
            )}
          </p>
          {(q || categoria) && (
            <Link href="/produtos" className="inline-flex items-center gap-1 text-sm font-semibold text-ocean-700">
              <X className="size-4" aria-hidden="true" /> Limpar filtros
            </Link>
          )}
        </div>

        <div className="mt-6">
          {products.length ? (
            <ProductGrid products={products} />
          ) : (
            <div className="rounded-3xl border border-dashed bg-white p-12 text-center">
              <p className="font-heading text-2xl font-bold text-ocean-900">Nada encontrado por aqui</p>
              <p className="mt-2 text-muted-foreground">Tente outra palavra ou fale com a loja — temos muito mais no estoque do que no site.</p>
            </div>
          )}
        </div>
      </div>
      <CtaBand title="Não achou o que procura?" text="Nosso estoque é bem maior que o catálogo online. Chame no WhatsApp e pergunte!" />
    </>
  );
}
