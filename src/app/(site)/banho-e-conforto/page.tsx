import type { Metadata } from "next";
import { CategoryShowcase, CtaBand, PageHero } from "@/components/site/page-blocks";
import { getCategoriesBySection, getProducts } from "@/server/queries/catalog";
import { ProductGrid } from "@/components/site/page-blocks";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Aquecedor a Gás, Filtro Central e Pressurizador em Araraquara",
  description:
    "Aquecedores a gás, filtro central de água, pressurizadores e trocadores de calor com instalação em Araraquara e São Carlos.",
  path: "/banho-e-conforto",
  image: IMG.showerBathroom,
});

export default async function ComfortPage() {
  const [categories, pumps] = await Promise.all([
    getCategoriesBySection("banho-e-conforto"),
    getProducts({ category: "bombas-filtros-pressurizadores", q: "pressurizador" }),
  ]);
  return (
    <>
      <PageHero
        eyebrow="Banho e conforto"
        title={
          <>
            Água quente, limpa e <span className="text-sun">com pressão.</span>
          </>
        }
        description="Aquecedores a gás, filtro central para a casa toda, pressurizadores e trocadores de calor — com instalação e manutenção."
        image={IMG.bathroomModern}
        imageAlt="Banheiro moderno com banheira e chuveiro"
        crumbs={[{ name: "Banho e conforto", path: "/banho-e-conforto" }]}
      />
      <div className="container-page space-y-20 py-20">
        <CategoryShowcase categories={categories} />
        {pumps.length > 0 && (
          <section aria-labelledby="pressurizadores">
            <h2 id="pressurizadores" className="text-3xl font-extrabold text-ocean-900 sm:text-4xl">
              Pressurizadores
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">Banho fraco nunca mais — inclusive com aquecimento solar.</p>
            <div className="mt-8">
              <ProductGrid products={pumps} />
            </div>
          </section>
        )}
      </div>
      <CtaBand title="Quer mais conforto no banho?" href="/orcamento?interesse=BANHO_CONFORTO" />
    </>
  );
}
