import type { Metadata } from "next";
import { BadgeDollarSign, CloudSun, ShowerHead, Waves } from "lucide-react";
import { Benefits, CategoryShowcase, CtaBand, FaqSection, PageHero } from "@/components/site/page-blocks";
import { SectionHeading } from "@/components/site/section";
import { SmartImage } from "@/components/site/smart-image";
import { Reveal } from "@/components/site/reveal";
import { SolarBathCalculator } from "@/components/calculators/solar-bath-calculator";
import { getCategoriesBySection } from "@/server/queries/catalog";
import { getFaqs } from "@/server/queries/content";
import { getSetting } from "@/server/queries/settings";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Aquecedor Solar em Araraquara e São Carlos",
  description:
    "Aquecedor solar para banho e piscina em Araraquara e São Carlos. Calcule sua economia, veja os modelos e peça orçamento com instalação feita pela equipe Astral.",
  path: "/aquecimento-solar",
  image: IMG.solarGrass,
});

export default async function SolarHeatingPage() {
  const [settings, categories, faqs] = await Promise.all([
    getSetting("calculators"),
    getCategoriesBySection("aquecimento-solar"),
    getFaqs("aquecimento-solar"),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Aquecimento solar"
        title={
          <>
            Banho quente <span className="text-sun">sem susto na conta.</span>
          </>
        }
        description="Aqui na Morada do Sol, o sol esquenta a água do seu banho e da sua piscina de graça. A gente dimensiona, instala e cuida."
        image={IMG.solarRoofSunset}
        imageAlt="Coletores solares instalados em telhado ao entardecer"
        crumbs={[{ name: "Aquecimento solar", path: "/aquecimento-solar" }]}
        primary={{ label: "Calcular minha economia", href: "#calculadora" }}
      />

      <section className="container-page py-20">
        <Benefits
          items={[
            { title: "Economia de verdade", text: "O chuveiro elétrico é um dos maiores vilões da conta. Com solar, ele quase não liga.", icon: <BadgeDollarSign className="size-6" /> },
            { title: "Sol o ano todo", text: "Araraquara tem sol forte na maior parte do ano — o sistema rende muito.", icon: <CloudSun className="size-6" /> },
            { title: "Banho e piscina", text: "Uma solução para cada uso: reservatório para banho, coletores para piscina.", icon: <ShowerHead className="size-6" /> },
            { title: "Instalação própria", text: "Equipe Astral do projeto à manutenção, com quase 40 anos de experiência.", icon: <Waves className="size-6" /> },
          ]}
        />
      </section>

      <section id="calculadora" className="scroll-mt-24 bg-sand py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Calculadora de economia"
            title="Quanto você economiza com aquecimento solar?"
            description="Informe quantas pessoas moram na casa e como vocês esquentam a água hoje."
          />
          <div className="mt-12">
            <SolarBathCalculator settings={settings} />
          </div>
        </div>
      </section>

      <section className="container-page grid gap-6 py-20 md:grid-cols-2">
        {[
          {
            title: "Para banho",
            text: "Coletores no telhado + reservatório térmico (boiler). A água esquenta durante o dia e fica guardada para a noite e a manhã seguinte. Nos dias nublados, um apoio elétrico ou a gás garante o conforto.",
            image: IMG.showerBathroom,
            alt: "Banheiro moderno com chuveiro",
          },
          {
            title: "Para piscina",
            text: "Coletores específicos usam a própria bomba do filtro para passar a água pelo sol. Resultado: piscina gostosa por muito mais meses do ano — combine com capa térmica para render ainda mais.",
            image: IMG.poolInfinity,
            alt: "Piscina com borda infinita e água aquecida",
          },
        ].map((b, i) => (
          <Reveal key={b.title} delay={i * 0.1}>
            <article className="group relative flex h-full min-h-96 flex-col justify-end overflow-hidden rounded-[2rem] p-8 text-white">
              <SmartImage src={b.image} alt={b.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="-z-10 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ocean-950/95 via-ocean-950/50 to-transparent" />
              <h2 className="text-3xl font-extrabold">{b.title}</h2>
              <p className="mt-3 max-w-lg text-white/85">{b.text}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <div className="container-page pb-20">
        <CategoryShowcase categories={categories} />
      </div>
      <FaqSection faqs={faqs} />
      <CtaBand title="Pronto para tomar banho quente de graça?" />
    </>
  );
}
