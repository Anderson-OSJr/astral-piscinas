import type { Metadata } from "next";
import { CalendarCheck, FileCheck2, PlugZap, Sun } from "lucide-react";
import { CategoryShowcase, CtaBand, FaqSection, PageHero } from "@/components/site/page-blocks";
import { SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { PvSimulator } from "@/components/calculators/pv-simulator";
import { getCategoriesBySection } from "@/server/queries/catalog";
import { getFaqs } from "@/server/queries/content";
import { getSetting } from "@/server/queries/settings";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Energia Solar Fotovoltaica em Araraquara",
  description:
    "Painéis solares fotovoltaicos em Araraquara e São Carlos. Simule quantas placas você precisa, a economia anual e o retorno do investimento.",
  path: "/energia-solar",
  image: IMG.solarRoofSunset,
});

const STEPS = [
  { Icon: FileCheck2, title: "Análise da conta", text: "Olhamos o seu histórico de consumo e o telhado." },
  { Icon: Sun, title: "Projeto sob medida", text: "Dimensionamos placas e inversor para a sua realidade." },
  { Icon: PlugZap, title: "Instalação", text: "Equipe própria, com segurança e capricho." },
  { Icon: CalendarCheck, title: "Conexão à rede", text: "Acompanhamos a homologação junto à distribuidora. [CONFIRMAR]" },
];

export default async function SolarEnergyPage() {
  const [settings, categories, faqs] = await Promise.all([
    getSetting("calculators"),
    getCategoriesBySection("energia-solar"),
    getFaqs("energia-solar"),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Energia solar fotovoltaica"
        title={
          <>
            O sol de Araraquara é de graça. <span className="text-sun">A conta de luz não precisa ser.</span>
          </>
        }
        description="Gere a sua própria energia com painéis de alta performance e veja a conta despencar."
        image={IMG.solarRows}
        imageAlt="Fileiras de painéis solares sob céu azul"
        crumbs={[{ name: "Energia solar", path: "/energia-solar" }]}
        primary={{ label: "Simular minha conta", href: "#simulador" }}
      />

      <section className="container-page py-20">
        <SectionHeading eyebrow="Como funciona" title="Do telhado para a sua tomada em 4 passos" />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.08}>
              <div className="relative h-full rounded-3xl border bg-white p-6">
                <span className="font-heading absolute top-5 right-6 text-5xl font-extrabold text-sand-200">{i + 1}</span>
                <span className="bg-sun grid size-12 place-items-center rounded-2xl text-ink">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ocean-900">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="simulador" className="scroll-mt-24 bg-sand py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Simulador"
            title="Quantas placas eu preciso?"
            description="Arraste para informar o valor médio da sua conta de luz."
          />
          <div className="mt-12">
            <PvSimulator settings={settings} />
          </div>
        </div>
      </section>

      <div className="container-page py-20">
        <CategoryShowcase categories={categories} />
      </div>
      <FaqSection faqs={faqs} />
      <CtaBand title="Quer um projeto com o seu consumo real?" text="Mande a sua conta de luz pelo WhatsApp e receba um estudo personalizado." />
    </>
  );
}
