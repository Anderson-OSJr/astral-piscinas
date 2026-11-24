import Link from "next/link";
import { ArrowRight, Award, Boxes, Clock3, HardHat, MapPinned, Quote, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section";
import { SmartImage } from "@/components/site/smart-image";
import { Reveal } from "@/components/site/reveal";
import { Caustics, SunRays } from "@/components/site/decor";
import { DynamicIcon } from "@/components/site/icon";
import { ProjectsCarousel } from "@/components/home/projects-carousel";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { HeroWhatsappButton } from "@/components/home/hero-whatsapp-button";
import { IMG } from "@/lib/images";
import { BRAND } from "@/lib/site";
import { formatDate } from "@/lib/format";
import type { GoogleSettings, InstagramGrid, SocialSettings } from "@/lib/settings-schema";

// ---------------------------------------------------------------------------
export function PoolsShowcase({ projects }: { projects: Parameters<typeof ProjectsCarousel>[0]["projects"] }) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28" aria-labelledby="piscinas-title">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Piscinas dos sonhos"
            title={<span id="piscinas-title">35 °C lá fora? Mergulha.</span>}
            description="Vinil, fibra ou azulejo: projetos feitos para o calor de Araraquara e região."
          />
          <Button asChild variant="ocean" size="xl" className="shrink-0">
            <Link href="/piscinas#monte-sua-piscina">
              Monte sua piscina <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="mt-12">
          <ProjectsCarousel projects={projects} />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
const REASONS = [
  { Icon: Award, title: `Experiência desde ${BRAND.foundedYear}`, text: "Quase 40 anos trazendo o sol para dentro das casas da região." },
  { Icon: Boxes, title: "Estoque amplo", text: "A loja mais completa de Araraquara e região — a peça que você precisa, na hora." },
  { Icon: Truck, title: "Entrega rápida", text: "4 lojas abastecidas e entrega ágil em Araraquara, São Carlos e região." },
  { Icon: HardHat, title: "Equipe própria", text: "Instalação e assistência feitas por quem conhece cada produto que vende." },
  { Icon: MapPinned, title: "4 lojas perto de você", text: "Vila Harmonia, Vila Ferroviária, Vila Xavier e São Carlos." },
  { Icon: Clock3, title: "Atendimento transparente", text: "Explicação clara, prazo combinado e orçamento sem surpresa." },
];

export function WhyAstral() {
  return (
    <section className="bg-ocean relative overflow-hidden py-20 text-white sm:py-28" aria-labelledby="porque-title">
      <Caustics opacity={0.15} />
      <div className="container-page relative">
        <SectionHeading
          tone="dark"
          align="center"
          eyebrow="Por que a Astral"
          title={<span id="porque-title">Conforto, economia e lazer com quem entende do assunto</span>}
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map(({ Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 0.08}>
              <div className="group h-full rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:border-sun-300/50 hover:bg-white/10">
                <span className="bg-sun grid size-12 place-items-center rounded-2xl text-ink transition group-hover:rotate-6">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-white/75">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export const TIMELINE = [
  { year: "1986", title: "Começa a história", text: "Nasce como representação comercial de aquecimento solar para banho." },
  { year: "1986–2010", title: "Representação comercial", text: "Mais de duas décadas levando aquecimento solar para a região." },
  { year: "2010", title: "Primeira loja", text: "Joãozinho abre a primeira loja física, com dois produtos: aquecimento solar para banho e para piscina." },
  { year: "Hoje", title: "A mais completa da região", text: "3 lojas em Araraquara + 1 em São Carlos, estoque amplo e entrega rápida." },
];

export function TimelineMini() {
  return (
    <section className="container-page py-20 sm:py-28" aria-labelledby="historia-title">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[4/3] lg:aspect-[4/5]">
            {/* TODO: substituir por foto real do Joãozinho */}
            <SmartImage src={IMG.solarInstall} alt="Instalação de placa solar em telhado — foto ilustrativa" fill sizes="(min-width:1024px) 50vw, 100vw" />
          </div>
          <div className="absolute -right-2 -bottom-6 max-w-xs rounded-3xl bg-white p-5 shadow-xl sm:-right-6">
            <Quote className="size-6 text-sun-500" aria-hidden="true" />
            <p className="mt-2 font-heading text-lg leading-snug font-bold text-ocean-900">
              “Da primeira placa solar em 1986 ao seu quintal hoje.”
            </p>
            <p className="mt-2 text-sm text-muted-foreground">João Luiz Ambrósio, o Joãozinho — fundador</p>
          </div>
        </Reveal>
        <div>
          <SectionHeading eyebrow="Nossa história" title={<span id="historia-title">Quase 40 anos de sol em Araraquara</span>} />
          <ol className="relative mt-10 space-y-8 border-l-2 border-dashed border-sun-300 pl-8">
            {TIMELINE.map((item, i) => (
              <Reveal as="li" key={item.year} delay={i * 0.1} className="relative">
                <span className="bg-sun absolute top-1 -left-[2.6rem] size-5 rounded-full ring-4 ring-background" aria-hidden="true" />
                <p className="font-heading text-2xl font-extrabold text-sun-600">{item.year}</p>
                <p className="mt-1 text-lg font-bold text-ocean-900">{item.title}</p>
                <p className="mt-1 text-muted-foreground">{item.text}</p>
              </Reveal>
            ))}
          </ol>
          <Link href="/sobre" className="mt-10 inline-flex items-center gap-2 font-bold text-ocean-700 hover:text-ocean-900">
            Conheça a nossa história <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function TestimonialsSection({
  testimonials,
  google,
  social,
}: {
  testimonials: { id: string; author: string; role: string | null; text: string; rating: number }[];
  google: GoogleSettings;
  social: SocialSettings;
}) {
  return (
    <section className="bg-sand py-20 sm:py-28" aria-labelledby="depoimentos-title">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center [&>*]:min-w-0">
        <div>
          <SectionHeading eyebrow="Quem já é cliente" title={<span id="depoimentos-title">Gente da região que recomenda</span>} />
          <a
            href={social.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card-lift mt-8 inline-flex items-center gap-4 rounded-3xl border bg-white p-5"
          >
            <span className="font-heading text-5xl font-extrabold text-ocean-900">{google.rating.toLocaleString("pt-BR")}</span>
            <span>
              <span className="flex text-sun-500" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-5 fill-current" />
                ))}
              </span>
              <span className="mt-1 block text-sm font-semibold">{google.total} avaliações no Google</span>
              <span className="block text-sm text-ocean-700 underline underline-offset-4">Ver avaliações</span>
            </span>
          </a>
        </div>
        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function ServicesGrid({ services }: { services: { id: string; slug: string; name: string; description: string; icon: string | null }[] }) {
  return (
    <section className="container-page py-20 sm:py-28" aria-labelledby="servicos-title">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading eyebrow="Serviços" title={<span id="servicos-title">Do projeto à manutenção, a gente cuida</span>} />
        <Button asChild variant="outline" size="xl" className="shrink-0">
          <Link href="/servicos#agendar">Agendar visita técnica</Link>
        </Button>
      </div>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <Reveal as="li" key={s.id} delay={(i % 4) * 0.06}>
            <Link href={`/servicos#${s.slug}`} className="card-lift flex h-full flex-col rounded-3xl border bg-white p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-ocean-100 text-ocean-900">
                <DynamicIcon icon={s.icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-ocean-900">{s.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function LatestPosts({
  posts,
}: {
  posts: { id: string; slug: string; title: string; excerpt: string; coverImage: string | null; publishedAt: Date | null }[];
}) {
  if (!posts.length) return null;
  return (
    <section className="bg-sand py-20 sm:py-28" aria-labelledby="dicas-title">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Dicas da Astral" title={<span id="dicas-title">Para decidir com segurança</span>} />
          <Link href="/dicas" className="inline-flex items-center gap-2 font-bold text-ocean-700 hover:text-ocean-900">
            Ver todas as dicas <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PostCard({
  post,
}: {
  post: { slug: string; title: string; excerpt: string; coverImage: string | null; publishedAt: Date | null };
}) {
  return (
    <Link href={`/dicas/${post.slug}`} className="group card-lift flex h-full flex-col overflow-hidden rounded-3xl border bg-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.coverImage && (
          <SmartImage src={post.coverImage} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="transition duration-700 group-hover:scale-105" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.publishedAt && (
          <time dateTime={post.publishedAt.toISOString()} className="text-xs font-semibold tracking-wide text-sun-600 uppercase">
            {formatDate(post.publishedAt)}
          </time>
        )}
        <h3 className="mt-2 text-xl leading-snug font-bold text-ocean-900">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-ocean-700">
          Ler artigo <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
export function InstagramSection({ grid, social }: { grid: InstagramGrid; social: SocialSettings }) {
  if (!grid.length) return null;
  return (
    <section className="container-page py-20 sm:py-28" aria-labelledby="insta-title">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow={`${social.instagramFollowers} seguidores · ${social.instagramPosts} publicações`}
          title={<span id="insta-title">Siga {social.instagramHandle}</span>}
          description="Obras, novidades e dicas de quem vive o sol de Araraquara todos os dias."
        />
        <Button asChild variant="ocean" size="xl" className="shrink-0">
          <a href={social.instagram} target="_blank" rel="noopener noreferrer">
            Seguir no Instagram
          </a>
        </Button>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {grid.slice(0, 6).map((item, i) => (
          <Reveal as="li" key={`${item.image}-${i}`} delay={i * 0.05}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-2xl"
              aria-label={`${item.alt} — abrir no Instagram`}
            >
              <SmartImage src={item.image} alt={item.alt} fill sizes="(min-width:1024px) 16vw, (min-width:640px) 33vw, 50vw" className="transition duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 bg-ocean-950/0 transition group-hover:bg-ocean-950/30" aria-hidden="true" />
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
export function FinalCta() {
  return (
    <section className="container-page pb-8" aria-labelledby="cta-final-title">
      <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-[linear-gradient(120deg,#ff8a00_0%,#ffb020_30%,#1e88e5_75%,#0a3d62_100%)] px-6 py-16 text-center sm:px-12 sm:py-24">
        <SunRays className="absolute -top-28 -left-28 -z-10 size-96 opacity-70" />
        <Caustics className="-z-10" opacity={0.18} />
        <h2 id="cta-final-title" className="mx-auto max-w-3xl text-4xl leading-[1.02] font-extrabold text-white drop-shadow-[0_2px_12px_rgb(6_42_69/0.45)] sm:text-6xl">
          O sol já está aí. Falta só você aproveitar.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-white drop-shadow-[0_1px_8px_rgb(6_42_69/0.5)]">
          Peça um orçamento sem compromisso ou chame a loja mais perto no WhatsApp.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="xl" className="bg-white font-bold text-ocean-900 hover:bg-sand">
            <Link href="/orcamento">
              Fazer orçamento <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <HeroWhatsappButton label="Falar no WhatsApp" variant="whatsapp" />
        </div>
      </div>
    </section>
  );
}
