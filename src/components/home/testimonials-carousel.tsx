"use client";

import { Quote, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type T = { id: string; author: string; role: string | null; text: string; rating: number };

export function TestimonialsCarousel({ testimonials }: { testimonials: T[] }) {
  return (
    <Carousel opts={{ align: "start", loop: true }} aria-label="Depoimentos de clientes" className="min-w-0">
      <CarouselContent className="-ml-4">
        {testimonials.map((t) => (
          <CarouselItem key={t.id} className="pl-4 md:basis-1/2">
            <figure className="flex h-full flex-col rounded-3xl border bg-white p-7 shadow-sm">
              <Quote className="size-8 text-sun-500" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-ink">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                <span className="grid size-11 place-items-center rounded-full bg-ocean-900 font-heading font-bold text-sun-300" aria-hidden="true">
                  {t.author
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <span>
                  <span className="block font-bold text-ocean-900">{t.author}</span>
                  {t.role && <span className="block text-sm text-muted-foreground">{t.role}</span>}
                </span>
                <span className="ml-auto flex text-sun-500" role="img" aria-label={`${t.rating} de 5 estrelas`}>
                  {Array.from({ length: t.rating }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                  ))}
                </span>
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-6 flex gap-2">
        <CarouselPrevious className="static size-11 translate-y-0 rounded-full" />
        <CarouselNext className="static size-11 translate-y-0 rounded-full" />
      </div>
    </Carousel>
  );
}
