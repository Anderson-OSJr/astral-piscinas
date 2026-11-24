"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { mapsEmbedUrl } from "@/lib/geo";
import { cn } from "@/lib/utils";

/** Mapa do Google carregado só quando a pessoa clica (não pesa o carregamento da página). */
export function MapFacade({ address, title, className }: { address: string; title: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-ocean-100", className)}>
      {loaded ? (
        <iframe
          src={mapsEmbedUrl(address)}
          title={`Mapa: ${title}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full border-0"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_30%,#cff7fd,transparent_60%),linear-gradient(135deg,#dbeefe,#fff1cc)] p-6 text-center"
        >
          <svg className="absolute inset-0 size-full opacity-40" aria-hidden="true">
            <defs>
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0v40" fill="none" stroke="#1e88e5" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
            <path d="M-20 140 C 120 60, 220 220, 420 120 S 700 200, 900 80" stroke="#ffc93c" strokeWidth="10" fill="none" />
            <path d="M80 -20 C 140 120, 60 260, 180 420" stroke="#ffffff" strokeWidth="8" fill="none" />
          </svg>
          <span className="relative grid size-14 place-items-center rounded-full bg-ocean-900 text-sun-300 shadow-lg transition group-hover:scale-110">
            <MapPin className="size-7" aria-hidden="true" />
          </span>
          <span className="relative rounded-full bg-white px-4 py-2 text-sm font-bold text-ocean-900 shadow">Clique para carregar o mapa<span className="sr-only"> de {title}</span></span>
        </button>
      )}
    </div>
  );
}
