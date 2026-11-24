"use client";

import { useState } from "react";
import { SmartImage } from "@/components/site/smart-image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="aspect-square rounded-[2rem] bg-sand" />;
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-sand">
        <SmartImage src={images[active]} alt={`${name} — foto ${active + 1}`} fill priority sizes="(min-width:1024px) 50vw, 100vw" />
      </div>
      {images.length > 1 && (
        <ul className="mt-4 flex gap-3" aria-label="Fotos do produto">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-pressed={i === active}
                className={cn(
                  "relative block size-20 overflow-hidden rounded-2xl ring-2 transition sm:size-24",
                  i === active ? "ring-sun-500" : "ring-transparent opacity-70 hover:opacity-100",
                )}
              >
                <SmartImage src={src} alt="" fill sizes="6rem" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
