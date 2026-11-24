"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Sun, X } from "lucide-react";

type Promo = { id: string; title: string; text: string | null; ctaLabel: string | null; ctaHref: string | null };

const KEY = "astral:promo-dismissed";
const listeners = new Set<() => void>();

function readDismissed() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function PromoBar({ promo }: { promo: Promo }) {
  const dismissed = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readDismissed,
    () => null,
  );
  if (dismissed === promo.id) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, promo.id);
    } catch {
      /* armazenamento indisponível: só some nesta visita */
    }
    listeners.forEach((l) => l());
  };

  return (
    <div className="bg-ocean relative text-white">
      <div className="container-page flex min-h-10 items-center justify-center gap-3 py-2 pr-10 text-center text-sm">
        <Sun className="hidden size-4 shrink-0 text-sun-300 sm:block" aria-hidden="true" />
        <p>
          <strong className="font-bold text-sun-300">{promo.title}:</strong> {promo.text}
          {promo.ctaHref && (
            <Link href={promo.ctaHref} className="ml-2 inline-flex items-center gap-1 font-bold underline decoration-sun-300 underline-offset-4">
              {promo.ctaLabel ?? "Saiba mais"}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          )}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 hover:bg-white/10"
          aria-label="Fechar aviso"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
