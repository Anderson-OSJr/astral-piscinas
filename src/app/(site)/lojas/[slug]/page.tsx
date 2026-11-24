import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { CtaBand, PageHero } from "@/components/site/page-blocks";
import { StoreCard } from "@/components/stores/store-card";
import { MapFacade } from "@/components/stores/map-facade";
import { JsonLd } from "@/components/site/json-ld";
import { DynamicIcon } from "@/components/site/icon";
import { getStoreBySlug, getStores } from "@/server/queries/stores";
import { getSetting } from "@/server/queries/settings";
import { pageMetadata, storeJsonLd } from "@/lib/seo";
import { SOLUTIONS } from "@/lib/site";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

const slugSchema = z.string().regex(/^[a-z0-9-]+$/).max(80);

export async function generateStaticParams() {
  return (await getStores()).map((s) => ({ slug: s.slug }));
}

async function load(params: PageProps<"/lojas/[slug]">["params"]) {
  const parsed = slugSchema.safeParse((await params).slug);
  return parsed.success ? getStoreBySlug(parsed.data) : null;
}

/** "Vila Xavier" a partir de "Jardim Paulistano (Vila Xavier)". */
function localName(neighborhood: string) {
  return neighborhood.match(/\(([^)]+)\)/)?.[1] ?? neighborhood;
}

export async function generateMetadata({ params }: PageProps<"/lojas/[slug]">): Promise<Metadata> {
  const store = await load(params);
  if (!store) return {};
  const place = `${localName(store.neighborhood)}, ${store.city}`;
  return pageMetadata({
    title: `Loja de Piscinas e Aquecimento Solar na ${place}`,
    description: `Astral ${store.shortName}: ${store.fullAddress}. Telefone ${store.phone}. Aquecedor solar, piscinas, produtos químicos e energia fotovoltaica.`,
    path: `/lojas/${store.slug}`,
    image: store.image ?? undefined,
  });
}

export default async function StorePage({ params }: PageProps<"/lojas/[slug]">) {
  const store = await load(params);
  if (!store) notFound();
  const [google, all] = await Promise.all([getSetting("google"), getStores()]);
  const others = all.filter((s) => s.slug !== store.slug);
  const place = localName(store.neighborhood);

  return (
    <>
      <PageHero
        eyebrow={store.isMain ? "Matriz" : `Loja em ${store.city}`}
        title={
          <>
            Astral <span className="text-sun">{place}</span>
          </>
        }
        description={`Loja de piscinas, aquecimento solar e energia fotovoltaica em ${place}, ${store.city}. Produtos a pronta entrega, assistência técnica e orçamento na hora.`}
        image={store.image ?? IMG.poolBackyard}
        imageAlt={`Projeto de piscina — Astral ${store.shortName}`}
        crumbs={[
          { name: "Lojas", path: "/lojas" },
          { name: store.shortName, path: `/lojas/${store.slug}` },
        ]}
      />
      <section className="container-page grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <StoreCard store={store} headingLevel="h2" />
        <MapFacade address={store.fullAddress} title={store.name} className="h-80 lg:h-full lg:min-h-[28rem]" />
      </section>
      <section className="container-page pb-16">
        <h2 className="text-3xl font-extrabold text-ocean-900">O que você encontra na loja {store.shortName}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="card-lift flex items-center gap-4 rounded-3xl border bg-white p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ocean-900 text-sun-300">
                  <DynamicIcon icon={s.icon} className="size-6" />
                </span>
                <span>
                  <span className="block font-bold text-ocean-900">{s.label}</span>
                  <span className="block text-sm text-muted-foreground">{s.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <h2 className="mt-16 text-2xl font-extrabold text-ocean-900">Outras lojas Astral</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {others.map((s) => (
            <li key={s.slug}>
              <StoreCard store={s} />
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
      <JsonLd data={storeJsonLd(store, google)} />
    </>
  );
}
