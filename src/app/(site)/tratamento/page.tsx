import type { Metadata } from "next";
import { CategoryShowcase, CtaBand, FaqSection, PageHero } from "@/components/site/page-blocks";
import { SectionHeading } from "@/components/site/section";
import { PoolDiagnosis } from "@/components/calculators/pool-diagnosis";
import { getCategoriesBySection } from "@/server/queries/catalog";
import { getFaqs } from "@/server/queries/content";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Produtos para Piscina em Araraquara: Químicos, Bombas e Filtros",
  description:
    "Cloro, algicida, clarificante, bombas, filtros e acessórios para piscina em Araraquara e São Carlos. Faça o diagnóstico da água verde e fale com a loja mais perto.",
  path: "/tratamento",
  image: IMG.poolAerial,
});

export default async function TreatmentPage() {
  const [categories, faqs] = await Promise.all([getCategoriesBySection("tratamento"), getFaqs("tratamento")]);
  return (
    <>
      <PageHero
        eyebrow="Tratamento e acessórios"
        title={
          <>
            Água cristalina <span className="text-sun">o verão inteiro.</span>
          </>
        }
        description="Produtos químicos, bombas, filtros e peças a pronta entrega nas 4 lojas — e uma equipe que explica direitinho como usar."
        image={IMG.poolAerial}
        imageAlt="Vista aérea de piscina com água azul cristalina"
        crumbs={[{ name: "Tratamento", path: "/tratamento" }]}
        primary={{ label: "Minha piscina está verde!", href: "#diagnostico" }}
      />
      <section id="diagnostico" className="scroll-mt-24 bg-sand py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Diagnóstico rápido"
            title="“Minha piscina está verde!”"
            description="Responda 3 perguntas e receba uma primeira orientação. Para a dose certa, leve uma amostra da água em uma das nossas lojas."
          />
          <div className="mt-12">
            <PoolDiagnosis />
          </div>
        </div>
      </section>
      <div className="container-page py-20">
        <CategoryShowcase categories={categories} />
      </div>
      <FaqSection faqs={faqs} />
      <CtaBand title="Precisa de peça ou produto hoje?" text="Estoque amplo nas 4 lojas e entrega rápida em Araraquara, São Carlos e região." href="/lojas" />
    </>
  );
}
