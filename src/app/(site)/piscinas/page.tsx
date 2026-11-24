import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryShowcase, CtaBand, FaqSection, PageHero } from "@/components/site/page-blocks";
import { SectionHeading } from "@/components/site/section";
import { SmartImage } from "@/components/site/smart-image";
import { Reveal } from "@/components/site/reveal";
import { PoolWizard } from "@/components/calculators/pool-wizard";
import { ProjectsCarousel } from "@/components/home/projects-carousel";
import { getCategoriesBySection } from "@/server/queries/catalog";
import { getFaqs, getProjects } from "@/server/queries/content";
import { getSetting } from "@/server/queries/settings";
import { getLeadStoreOptions } from "@/server/queries/stores";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";
import { POOL_TYPES } from "@/lib/pool-types";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Piscinas de Vinil, Fibra e Azulejo em Araraquara",
  description:
    "Construção de piscinas de vinil, fibra e azulejo em Araraquara, São Carlos e região. Monte sua piscina online e veja o volume e o aquecimento solar necessário.",
  path: "/piscinas",
  image: IMG.poolWhiteHouse,
});

export default async function PoolsPage() {
  const [settings, stores, categories, faqs, projects] = await Promise.all([
    getSetting("calculators"),
    getLeadStoreOptions(),
    getCategoriesBySection("piscinas"),
    getFaqs("piscinas"),
    getProjects(),
  ]);
  const automation = categories.filter((c) => c.slug !== "piscinas");

  return (
    <>
      <PageHero
        eyebrow="Piscinas"
        title={
          <>
            35 °C lá fora? <span className="text-sun">Mergulha.</span>
          </>
        }
        description="Projeto, construção, aquecimento e automação — tudo com a mesma equipe, aqui em Araraquara e região."
        image={IMG.poolWhiteHouse}
        imageAlt="Casa moderna com piscina azul e deck"
        crumbs={[{ name: "Piscinas", path: "/piscinas" }]}
        primary={{ label: "Monte sua piscina", href: "#monte-sua-piscina" }}
      />

      <section className="container-page py-20">
        <SectionHeading eyebrow="Tipos de piscina" title="Vinil, fibra ou azulejo?" description="Cada uma tem seu jeito. Conheça as diferenças e escolha sem arrependimento." />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {POOL_TYPES.map((t, i) => (
            <Reveal as="li" key={t.slug} delay={i * 0.08}>
              <Link href={`/piscinas/${t.slug}`} className="group card-lift flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SmartImage src={t.image} alt={t.imageAlt} fill sizes="(min-width:768px) 33vw, 100vw" className="transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl font-bold text-ocean-900">{t.name}</h3>
                  <p className="mt-2 text-muted-foreground">{t.short}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 font-bold text-ocean-700">
                    Saiba mais <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section id="monte-sua-piscina" className="scroll-mt-24 bg-sand py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Monte sua piscina"
            title="Sua piscina em 4 passos"
            description="Escolha tipo, tamanho e extras. Mostramos o volume de água e quantas placas solares seriam necessárias para aquecê-la."
          />
          <div className="mt-12">
            <PoolWizard settings={settings} stores={stores} />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading eyebrow="Projetos" title="Inspiração para o seu quintal" />
        <div className="mt-10">
          <ProjectsCarousel projects={projects} />
        </div>
      </section>

      <div className="container-page pb-20">
        <CategoryShowcase categories={automation} />
      </div>
      <FaqSection faqs={faqs} />
      <CtaBand title="Vamos tirar a sua piscina do papel?" />
    </>
  );
}
