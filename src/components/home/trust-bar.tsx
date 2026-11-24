import { CalendarDays, MapPin, Star } from "lucide-react";
import { InstagramIcon } from "@/components/site/brand-icons";
import { Counter } from "@/components/site/motion";
import { Reveal } from "@/components/site/reveal";
import type { GoogleSettings, SocialSettings } from "@/lib/settings-schema";

export function TrustBar({ google, social }: { google: GoogleSettings; social: SocialSettings }) {
  const followers = Number.parseFloat(social.instagramFollowers.replace(/[^\d,]/g, "").replace(",", ".")) || 4.7;
  const items = [
    { Icon: CalendarDays, value: <Counter from={2026} to={1986} grouping={false} />, label: "Desde", sub: "quase 40 anos de mercado", labelFirst: true },
    { Icon: MapPin, value: <Counter to={4} />, label: "lojas", sub: "3 em Araraquara + 1 em São Carlos" },
    { Icon: Star, value: <Counter to={google.rating} decimals={1} suffix="★" />, label: "no Google", sub: `${google.total} avaliações na Loja 1` },
    { Icon: InstagramIcon, value: <Counter to={followers} decimals={1} prefix="+" suffix=" mil" />, label: "seguidores", sub: `${social.instagramHandle} no Instagram` },
  ];
  return (
    <section aria-label="Números da Astral" className="relative z-10 -mt-14 sm:-mt-20">
      <div className="container-page">
        <ul className="grid grid-cols-2 gap-3 rounded-[2rem] border bg-white p-3 shadow-[0_30px_60px_-30px_rgb(10_61_98/0.4)] sm:gap-4 sm:p-4 lg:grid-cols-4">
          {items.map(({ Icon, value, label, sub, labelFirst }, i) => (
            <Reveal as="li" key={label} delay={i * 0.08} className="rounded-3xl bg-sand/70 p-4 sm:p-6">
              <Icon className="size-6 text-sun-600" aria-hidden="true" />
              <p className="font-heading mt-3 text-3xl font-extrabold text-ocean-900 sm:text-4xl">
                {labelFirst && <span className="mr-2 text-base font-bold text-ocean-700 sm:text-lg">{label}</span>}
                {value}
                {!labelFirst && <span className="ml-2 text-base font-bold text-ocean-700 sm:text-lg">{label}</span>}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
