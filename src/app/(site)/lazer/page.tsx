import type { Metadata } from "next";
import { CategoryShowcase, CtaBand, PageHero } from "@/components/site/page-blocks";
import { getCategoriesBySection } from "@/server/queries/catalog";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Saunas, Spas e Móveis Outdoor em Araraquara",
  description:
    "Linha EcoSauna, banheiras, spas e móveis outdoor para a sua área de lazer em Araraquara e São Carlos.",
  path: "/lazer",
  image: IMG.poolDeck,
});

export default async function LeisurePage() {
  const categories = await getCategoriesBySection("lazer");
  return (
    <>
      <PageHero
        eyebrow="Lazer"
        title={
          <>
            Férias no seu <span className="text-sun">quintal.</span>
          </>
        }
        description="Saunas da linha EcoSauna, banheiras e spas para relaxar e móveis outdoor para curtir a área de lazer com a família."
        image={IMG.poolDeck}
        imageAlt="Deck de madeira com espreguiçadeiras à beira da piscina"
        crumbs={[{ name: "Lazer", path: "/lazer" }]}
      />
      <div className="container-page py-20">
        <CategoryShowcase categories={categories} />
      </div>
      <CtaBand title="Vamos montar a sua área de lazer?" href="/orcamento?interesse=LAZER" />
    </>
  );
}
