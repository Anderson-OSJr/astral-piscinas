import type { Metadata } from "next";
import { Eye, Handshake, HeartHandshake, Sun } from "lucide-react";
import { CtaBand, PageHero } from "@/components/site/page-blocks";
import { SectionHeading } from "@/components/site/section";
import { SmartImage } from "@/components/site/smart-image";
import { Reveal } from "@/components/site/reveal";
import { TIMELINE } from "@/components/home/home-sections";
import { pageMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/site";
import { IMG } from "@/lib/images";

export const revalidate = 86400;

export const metadata: Metadata = pageMetadata({
  title: "Nossa História — Desde 1986 em Araraquara",
  description:
    "Da representação comercial de aquecimento solar em 1986 às 4 lojas em Araraquara e São Carlos: conheça a história da Astral e do Joãozinho.",
  path: "/sobre",
});

const VALUES = [
  { Icon: Eye, title: "Transparência", text: "Orçamento claro, prazo combinado e explicação sem enrolação." },
  { Icon: Handshake, title: "Solidez", text: "Quase 40 anos de mercado e a confiança de milhares de famílias da região." },
  { Icon: Sun, title: "Economia", text: "Colocar o sol para trabalhar a favor do seu bolso." },
  { Icon: HeartHandshake, title: "Proximidade", text: "Atendimento de quem é daqui e conhece cada bairro." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre a Astral"
        title={
          <>
            Da primeira placa solar em 1986 <span className="text-sun">ao seu quintal hoje.</span>
          </>
        }
        description={BRAND.positioning}
        image={IMG.solarAerial}
        imageAlt="Vista aérea de usina de placas solares"
        crumbs={[{ name: "Sobre", path: "/sobre" }]}
      />

      <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-2">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[4/3] lg:aspect-[4/5]">
          {/* TODO: substituir por foto real do Joãozinho */}
          <SmartImage src={IMG.solarHands} alt="Mãos de técnico instalando placa solar — foto ilustrativa" fill sizes="(min-width:1024px) 50vw, 100vw" />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 p-4 text-sm backdrop-blur">
            <strong className="text-ocean-900">Foto ilustrativa</strong> — espaço reservado para a foto do Joãozinho.
          </div>
        </Reveal>
        <div>
          <SectionHeading eyebrow="O fundador" title="Joãozinho e o sol de Araraquara" />
          <div className="mt-6 space-y-4 text-lg text-ink/85">
            <p>
              Tudo começou em <strong>1986</strong>, quando <strong>João Luiz Ambrósio — o Joãozinho —</strong> passou a representar
              aquecimento solar para banho na região. Numa cidade apelidada de Morada do Sol, a ideia era simples: usar o calor que já
              está aí, todos os dias, para dar conforto e economia às famílias.
            </p>
            <p>
              Foram mais de duas décadas como representação comercial até que, em <strong>2010</strong>, ele abriu a primeira loja
              física com dois produtos: aquecimento solar para banho e para piscina.
            </p>
            <p>
              Hoje a Astral é a loja mais completa de Araraquara e região: são <strong>3 lojas em Araraquara e 1 em São Carlos</strong>,
              estoque amplo, entrega rápida e equipe própria de instalação — de aquecedores e energia fotovoltaica a piscinas, saunas e
              móveis outdoor.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ocean relative overflow-hidden py-20 text-white sm:py-28">
        <div className="container-page">
          <SectionHeading tone="dark" align="center" eyebrow="Linha do tempo" title="Quase 40 anos de história" />
          <ol className="relative mx-auto mt-16 max-w-4xl">
            <span className="bg-sun absolute top-0 bottom-0 left-5 w-1 rounded-full md:left-1/2 md:-translate-x-1/2" aria-hidden="true" />
            {TIMELINE.map((item, i) => (
              <Reveal as="li" key={item.year} delay={i * 0.1} className="relative mb-12 pl-16 last:mb-0 md:w-1/2 md:pl-0 md:odd:pr-14 md:odd:text-right md:even:ml-auto md:even:pl-14">
                <span
                  className={`bg-sun absolute top-1 left-2.5 grid size-6 place-items-center rounded-full ring-4 ring-ocean-900 md:left-auto ${i % 2 === 0 ? "md:-right-3" : "md:-left-3"}`}
                  aria-hidden="true"
                />
                <p className="font-heading text-4xl font-extrabold text-sun-300">{item.year}</p>
                <p className="mt-1 text-xl font-bold">{item.title}</p>
                <p className="mt-2 text-white/75">{item.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading align="center" eyebrow="Valores" title="O jeito Astral de trabalhar" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 0.06}>
              <div className="h-full rounded-3xl border bg-white p-6 text-center">
                <span className="bg-sun mx-auto grid size-14 place-items-center rounded-2xl text-ink">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ocean-900">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
