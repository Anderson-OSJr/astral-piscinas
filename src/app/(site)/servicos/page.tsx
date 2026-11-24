import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";
import { PageHero, FaqSection } from "@/components/site/page-blocks";
import { SectionHeading } from "@/components/site/section";
import { SmartImage } from "@/components/site/smart-image";
import { DynamicIcon } from "@/components/site/icon";
import { Reveal } from "@/components/site/reveal";
import { LeadContactForm } from "@/components/forms/lead-contact-form";
import { getFaqs, getServices } from "@/server/queries/content";
import { getLeadStoreOptions } from "@/server/queries/stores";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Instalação e Manutenção de Aquecedor Solar e Piscinas em Araraquara",
  description:
    "Instalação e reparo de aquecedores solares, a gás e elétricos, construção de piscinas, troca de vinil, limpeza de placas solares e manutenção em Araraquara e São Carlos.",
  path: "/servicos",
});

export default async function ServicesPage() {
  const [services, stores, faqs] = await Promise.all([getServices(), getLeadStoreOptions(), getFaqs("geral")]);
  return (
    <>
      <PageHero
        eyebrow="Serviços"
        title={
          <>
            Do projeto à manutenção, <span className="text-sun">a gente cuida.</span>
          </>
        }
        description="Equipe própria de instalação e assistência técnica em Araraquara, São Carlos e região."
        image={IMG.technician}
        imageAlt="Técnico realizando instalação"
        crumbs={[{ name: "Serviços", path: "/servicos" }]}
        primary={{ label: "Agendar visita técnica", href: "#agendar" }}
      />
      <section className="container-page py-20">
        <ul className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal as="li" key={s.id} delay={(i % 2) * 0.08}>
              <article id={s.slug} className="card-lift flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[1.75rem] border bg-white sm:flex-row">
                <div className="relative aspect-[16/10] shrink-0 sm:aspect-auto sm:w-48">
                  {s.image && <SmartImage src={s.image} alt="" fill sizes="(min-width:640px) 12rem, 100vw" />}
                </div>
                <div className="p-6">
                  <span className="grid size-11 place-items-center rounded-2xl bg-ocean-100 text-ocean-900">
                    <DynamicIcon icon={s.icon} className="size-5" />
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-ocean-900">{s.name}</h2>
                  <p className="mt-1.5 text-muted-foreground">{s.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>
      <section id="agendar" className="scroll-mt-24 bg-sand py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Visita técnica"
              title="Agende uma visita da nossa equipe"
              description="Conte o que você precisa e a loja mais perto entra em contato para combinar o melhor dia."
            />
            <p className="mt-6 flex items-center gap-3 rounded-2xl bg-white p-4 font-semibold">
              <CalendarCheck className="size-6 text-sun-600" aria-hidden="true" />
              Atendemos Araraquara, São Carlos, Américo Brasiliense, Matão e região.
            </p>
          </div>
          <div className="rounded-[2rem] border bg-white p-6 sm:p-8">
            <LeadContactForm
              interest="SERVICO"
              stores={stores}
              sourcePage="/servicos#agendar"
              submitLabel="Agendar visita técnica"
              messagePlaceholder="Ex.: meu aquecedor solar parou de esquentar / quero trocar o vinil da piscina"
              payload={{ origem: "agendar-visita" }}
              summary={{ Pedido: "Visita técnica" }}
            />
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />
    </>
  );
}
