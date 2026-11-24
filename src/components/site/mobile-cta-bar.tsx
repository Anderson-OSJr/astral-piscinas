"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { openWhatsappPanel } from "@/components/site/whatsapp-widget";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";

/** Barra fixa no rodapé do celular: WhatsApp + Orçamento. */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-20px_rgb(10_61_98/0.5)] backdrop-blur md:hidden print:hidden">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => openWhatsappPanel()}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#0f7a40] font-semibold text-white"
        >
          <WhatsappIcon className="size-5" />
          WhatsApp
        </button>
        <Link href="/orcamento" className="bg-sun flex h-12 items-center justify-center gap-2 rounded-full font-bold text-ink">
          <ClipboardList className="size-5" aria-hidden="true" />
          Orçamento
        </Link>
      </div>
    </div>
  );
}
