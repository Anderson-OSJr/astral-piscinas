import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/site/smart-image";
import { Caustics, SunRays, Wave } from "@/components/site/decor";
import { WeatherBadge, WeatherBadgeSkeleton } from "@/components/site/weather-badge";
import { HeroWhatsappButton } from "@/components/home/hero-whatsapp-button";
import { ParallaxLayer } from "@/components/home/parallax-layer";
import type { GoogleSettings, HeroSettings } from "@/lib/settings-schema";

function renderTitle(title: string) {
  // Destaca com gradiente de sol o trecho depois da vírgula ("o calor trabalha para você.")
  const idx = title.indexOf(",");
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx + 1)} <span className="text-sun">{title.slice(idx + 1).trim()}</span>
    </>
  );
}

export function Hero({ hero, google }: { hero: HeroSettings; google: GoogleSettings }) {
  return (
    <section className="relative isolate overflow-hidden bg-ocean-950 text-white" aria-labelledby="hero-title">
      <ParallaxLayer className="absolute inset-0 -z-20">
        <SmartImage src={hero.image} alt={hero.imageAlt} fill priority quality={60} sizes="100vw" className="scale-110" />
      </ParallaxLayer>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ocean-950/75 via-ocean-950/30 to-ocean-950/85" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_85%_10%,rgb(255_201_60/0.35),transparent_70%)]" />
      <Caustics className="-z-10" opacity={0.1} />
      <SunRays className="absolute -top-56 -right-56 -z-10 size-[38rem] opacity-30 blur-[2px] sm:-top-64 sm:-right-40" />

      <div className="container-page flex min-h-[calc(100svh-4rem)] flex-col justify-center pt-16 pb-28 lg:min-h-[calc(100svh-5rem)] lg:pb-36">
        <div className="max-w-3xl">
          <Suspense fallback={<WeatherBadgeSkeleton />}>
            <WeatherBadge />
          </Suspense>
          <p className="eyebrow mt-8 text-sun-300">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-4 text-[2.6rem] leading-[0.98] font-extrabold sm:text-6xl lg:text-7xl">
            {renderTitle(hero.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85 sm:text-xl">{hero.subtitle}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="sun" size="xl">
              <Link href="/orcamento">
                {hero.primaryCta}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <HeroWhatsappButton label={hero.secondaryCta} />
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex text-sun-300" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <strong className="text-white">{google.rating.toLocaleString("pt-BR")}</strong> no Google
            </span>
            <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />
            <span>4 lojas · Araraquara e São Carlos</span>
            <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />
            <span>Equipe própria de instalação</span>
          </div>
        </div>
      </div>
      <Wave className="absolute inset-x-0 -bottom-px" />
    </section>
  );
}
