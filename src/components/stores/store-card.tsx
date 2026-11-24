import Link from "next/link";
import { Clock, MapPin, Navigation, Phone, Star } from "lucide-react";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";
import { formatOpeningHours, type OpeningHours } from "@/lib/hours";
import { mapsDirectionsUrl } from "@/lib/geo";
import { telHref } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export type StoreCardData = {
  slug: string;
  name: string;
  fullAddress: string;
  phone: string;
  whatsapp: string;
  openingHours: OpeningHours;
  hoursNote: string | null;
  isMain: boolean;
};

export function StoreCard({
  store,
  highlight,
  distance,
  className,
  headingLevel: Heading = "h3",
}: {
  headingLevel?: "h2" | "h3";
  store: StoreCardData;
  highlight?: boolean;
  distance?: string;
  className?: string;
}) {
  const hours = formatOpeningHours(store.openingHours);
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-3xl border bg-white p-6 transition",
        highlight && "border-sun-500 shadow-[0_20px_50px_-25px_rgb(255_138_0/0.8)] ring-2 ring-sun-300",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {store.isMain && <span className="rounded-full bg-ocean-900 px-2.5 py-0.5 text-xs font-bold text-white">Matriz</span>}
        {highlight && (
          <span className="bg-sun inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold text-ink">
            <Star className="size-3 fill-current" aria-hidden="true" /> Mais perto de você{distance ? ` · ${distance}` : ""}
          </span>
        )}
      </div>
      <Heading className="mt-3 text-xl font-bold text-ocean-900">
        <Link href={`/lojas/${store.slug}`} className="hover:underline">
          {store.name}
        </Link>
      </Heading>
      <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 size-4 shrink-0 text-sun-600" aria-hidden="true" />
        {store.fullAddress}
      </p>
      {hours.length > 0 && (
        <div className="mt-2 flex gap-2 text-sm text-muted-foreground">
          <Clock className="mt-0.5 size-4 shrink-0 text-sun-600" aria-hidden="true" />
          <div>
            {hours.map((h) => (
              <p key={h.days}>
                {h.days}: {h.time}
              </p>
            ))}
            {store.hoursNote && <p className="text-xs italic">{store.hoursNote}</p>}
          </div>
        </div>
      )}
      <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
        <a
          href={whatsappLink(store.whatsapp, `Olá, Astral (${store.name})! Vim pelo site.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-2xl bg-[#0f7a40] px-2 py-2.5 text-xs font-semibold text-white hover:bg-[#0b6534]"
        >
          <WhatsappIcon className="size-5" />
          WhatsApp
        </a>
        <a href={telHref(store.phone)} className="flex flex-col items-center gap-1 rounded-2xl bg-ocean-100 px-2 py-2.5 text-xs font-semibold text-ocean-900 hover:bg-ocean-100/70">
          <Phone className="size-5" aria-hidden="true" />
          Ligar
        </a>
        <a
          href={mapsDirectionsUrl(store.fullAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 rounded-2xl bg-sun-100 px-2 py-2.5 text-xs font-semibold text-ink hover:bg-sun-100/70"
        >
          <Navigation className="size-5" aria-hidden="true" />
          Como chegar
        </a>
      </div>
    </article>
  );
}
