"use client";

import { MapPin } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SmartImage } from "@/components/site/smart-image";

type ProjectItem = { id: string; title: string; type: string; city: string | null; images: string[]; description: string | null };

export function ProjectsCarousel({ projects }: { projects: ProjectItem[] }) {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full" aria-label="Galeria de projetos">
      <CarouselContent className="-ml-4">
        {projects.map((p) => (
          <CarouselItem key={p.id} className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3">
            <figure className="group relative h-[26rem] overflow-hidden rounded-[1.75rem]">
              {p.images[0] && (
                <SmartImage
                  src={p.images[0]}
                  alt={`${p.title}${p.city ? ` em ${p.city}` : ""}`}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 85vw"
                  className="transition duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/90 via-transparent to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="bg-sun inline-block rounded-full px-3 py-1 text-xs font-bold text-ink">{p.type}</span>
                <p className="font-heading mt-3 text-xl font-bold">{p.title}</p>
                {p.city && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-white/80">
                    <MapPin className="size-3.5" aria-hidden="true" /> {p.city}
                  </p>
                )}
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-6 flex justify-end gap-2">
        <CarouselPrevious className="static size-11 translate-y-0 rounded-full" />
        <CarouselNext className="static size-11 translate-y-0 rounded-full" />
      </div>
    </Carousel>
  );
}
