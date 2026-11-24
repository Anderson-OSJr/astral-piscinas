import Link from "next/link";
import { ArrowUpRight, Armchair, Hammer, ShowerHead, Sparkles, Waves, Zap } from "lucide-react";
import { SectionHeading } from "@/components/site/section";
import { SmartImage } from "@/components/site/smart-image";
import { Reveal } from "@/components/site/reveal";
import { IMG } from "@/lib/images";

const CARDS = [
  { title: "Banho quente econômico", text: "Banho quente sem susto na conta.", href: "/aquecimento-solar", Icon: ShowerHead, image: IMG.solarGrass, alt: "Coletores solares sobre gramado" },
  { title: "Conta de luz menor", text: "O sol de Araraquara é de graça. A conta não precisa ser.", href: "/energia-solar", Icon: Zap, image: IMG.solarRoofSunset, alt: "Painéis fotovoltaicos em telhado ao pôr do sol" },
  { title: "Construir minha piscina", text: "35 °C lá fora? Mergulha.", href: "/piscinas", Icon: Waves, image: IMG.poolWhiteHouse, alt: "Piscina nova em casa moderna" },
  { title: "Cuidar da minha piscina", text: "Água cristalina com o produto certo.", href: "/tratamento", Icon: Sparkles, image: IMG.poolAerial, alt: "Vista aérea de piscina com água limpa" },
  { title: "Área de lazer", text: "Sauna, spa e móveis para curtir em casa.", href: "/lazer", Icon: Armchair, image: IMG.poolDeck, alt: "Deck com espreguiçadeiras" },
  { title: "Assistência técnica", text: "Instalação, reparo e manutenção.", href: "/servicos", Icon: Hammer, image: IMG.technician, alt: "Técnico trabalhando em instalação" },
];

export function ProblemCards() {
  return (
    <section className="container-page py-20 sm:py-28" aria-labelledby="problemas-title">
      <SectionHeading
        eyebrow="Por onde começar"
        title={<span id="problemas-title">O que você quer resolver hoje?</span>}
        description="Escolha o seu objetivo — a gente mostra o caminho mais econômico para chegar lá."
      />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ title, text, href, Icon, image, alt }, i) => (
          <Reveal as="li" key={href} delay={(i % 3) * 0.08}>
            <Link
              href={href}
              className="group card-lift relative flex h-72 flex-col justify-end overflow-hidden rounded-[1.75rem] p-6 text-white sm:h-80"
            >
              <SmartImage
                src={image}
                alt={alt}
                fill
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="-z-10 transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ocean-950/95 via-ocean-950/45 to-ocean-950/5" aria-hidden="true" />
              <span className="bg-sun mb-auto grid size-12 place-items-center rounded-2xl text-ink shadow-lg">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="font-heading text-2xl font-bold">{title}</span>
              <span className="mt-1 flex items-end justify-between gap-4 text-white/85">
                {text}
                <ArrowUpRight className="size-6 shrink-0 text-sun-300 transition group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
