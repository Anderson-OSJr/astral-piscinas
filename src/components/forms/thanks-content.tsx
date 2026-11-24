"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SunRays } from "@/components/site/decor";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";
import { FacebookIcon, InstagramIcon } from "@/components/site/brand-icons";
import { readThanks, type ThanksData } from "@/components/forms/lead-context";
import { whatsappLink } from "@/lib/whatsapp";

let cached: { raw: string | null; data: ThanksData | null } = { raw: null, data: null };
function snapshot() {
  const data = readThanks();
  const raw = data ? JSON.stringify(data) : null;
  if (raw !== cached.raw) cached = { raw, data };
  return cached.data;
}

export function ThanksContent({ instagram, facebook, handle }: { instagram: string; facebook: string; handle: string }) {
  const data = useSyncExternalStore(
    () => () => {},
    snapshot,
    () => null,
  );

  return (
    <section className="relative isolate overflow-hidden bg-sand">
      <SunRays className="absolute -top-32 left-1/2 -z-10 size-[30rem] -translate-x-1/2 opacity-40" />
      <div className="container-page flex min-h-[70vh] max-w-2xl flex-col items-center justify-center py-20 text-center">
        <span className="bg-sun grid size-20 place-items-center rounded-full text-ink shadow-xl">
          <PartyPopper className="size-10" aria-hidden="true" />
        </span>
        <h1 className="mt-8 text-4xl font-extrabold text-ocean-900 sm:text-5xl">
          {data?.name ? `Obrigado, ${data.name}!` : "Pedido recebido!"}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Recebemos o seu pedido{data?.storeName ? ` e a loja ${data.storeName} já foi avisada` : ""}. Em breve a nossa equipe entra em contato.
        </p>
        {data?.whatsapp && (
          <div className="mt-8 w-full rounded-3xl border bg-white p-6">
            <p className="font-semibold text-ink">Quer adiantar? Continue agora pelo WhatsApp com o resumo pronto:</p>
            <Button asChild variant="whatsapp" size="xl" className="mt-4 w-full sm:w-auto">
              <a href={whatsappLink(data.whatsapp, data.message)} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon /> Continuar no WhatsApp
              </a>
            </Button>
          </div>
        )}
        <div className="mt-10">
          <p className="text-sm font-semibold text-muted-foreground">Enquanto isso, veja nossas obras e dicas:</p>
          <div className="mt-3 flex justify-center gap-3">
            <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold shadow-sm hover:bg-sun-100">
              <InstagramIcon className="size-5" /> {handle}
            </a>
            <a href={facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-semibold shadow-sm hover:bg-sun-100">
              <FacebookIcon className="size-5" /> /maisastral
            </a>
          </div>
        </div>
        <Link href="/" className="mt-10 inline-flex items-center gap-1.5 font-semibold text-ocean-700 hover:text-ocean-900">
          <ArrowLeft className="size-4" aria-hidden="true" /> Voltar para o início
        </Link>
      </div>
    </section>
  );
}
