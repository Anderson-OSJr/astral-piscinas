"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MapPin, Send, X } from "lucide-react";
import { buildWhatsappMessage, whatsappLink, WHATSAPP_SUBJECTS, type WhatsappSubjectId } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";

export type WhatsappStore = { slug: string; shortName: string; city: string; whatsapp: string };

export const OPEN_WHATSAPP_EVENT = "astral:open-whatsapp";

/** Abre o painel do WhatsApp de qualquer lugar (ex.: barra fixa do mobile). */
export function openWhatsappPanel(storeSlug?: string) {
  window.dispatchEvent(new CustomEvent(OPEN_WHATSAPP_EVENT, { detail: { storeSlug } }));
}

export function WhatsappWidget({ stores }: { stores: WhatsappStore[] }) {
  const [open, setOpen] = useState(false);
  const [storeSlug, setStoreSlug] = useState(stores[0]?.slug ?? "");
  const [subject, setSubject] = useState<WhatsappSubjectId>("orcamento");
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const slug = (e as CustomEvent<{ storeSlug?: string }>).detail?.storeSlug;
      if (slug) setStoreSlug(slug);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener(OPEN_WHATSAPP_EVENT, onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_WHATSAPP_EVENT, onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>("input:checked, input")?.focus();
  }, [open]);

  const store = stores.find((s) => s.slug === storeSlug) ?? stores[0];
  const href = store
    ? whatsappLink(
        store.whatsapp,
        buildWhatsappMessage({
          subject,
          storeName: store.shortName,
          pageTitle: typeof document !== "undefined" ? document.title.split("|")[0].trim() : undefined,
          pageUrl: typeof window !== "undefined" ? `${window.location.origin}${pathname}` : pathname,
        }),
      )
    : "#";

  return (
    <div className="fixed right-4 bottom-4 z-50 print:hidden">
      {open && (
        <div className="fixed inset-0 bg-ocean-950/40 md:hidden" aria-hidden="true" onClick={() => setOpen(false)} />
      )}
      {open && (
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby="wa-title"
            className="animate-in fade-in slide-in-from-bottom-4 duration-200 fixed inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border bg-white shadow-2xl md:absolute md:inset-x-auto md:right-0 md:bottom-20 md:w-[22rem] md:rounded-3xl"
          >
            <WhatsappPanelBody
              stores={stores}
              storeSlug={storeSlug}
              setStoreSlug={setStoreSlug}
              subject={subject}
              setSubject={setSubject}
              href={href}
              onClose={() => setOpen(false)}
            />
          </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fechar atendimento por WhatsApp" : "Falar com a Astral no WhatsApp"}
        className="group relative hidden size-16 place-items-center md:grid rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.7)] transition hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20 group-hover:opacity-0" aria-hidden="true" />
        {open ? <X className="size-7" /> : <WhatsappIcon className="size-8" />}
      </button>
    </div>
  );
}

/** Conteúdo do painel, reutilizado também no "sheet" do mobile. */
export function WhatsappPanelBody({
  stores,
  storeSlug,
  setStoreSlug,
  subject,
  setSubject,
  href,
  onClose,
}: {
  stores: WhatsappStore[];
  storeSlug: string;
  setStoreSlug: (v: string) => void;
  subject: WhatsappSubjectId;
  setSubject: (v: WhatsappSubjectId) => void;
  href: string;
  onClose: () => void;
}) {
  return (
    <>
      <div className="bg-[#075E54] px-5 py-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p id="wa-title" className="font-heading text-lg font-bold">
              Fale com a Astral
            </p>
            <p className="text-sm text-white/80">Respondemos em horário comercial.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-1 hover:bg-white/10" aria-label="Fechar">
            <X className="size-5" />
          </button>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Com qual loja você quer falar?</legend>
          <div className="grid grid-cols-2 gap-2">
            {stores.map((s) => (
              <label
                key={s.slug}
                className={cn(
                  "flex cursor-pointer items-start gap-1.5 rounded-xl border px-3 py-2 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                  storeSlug === s.slug ? "border-[#0f7a40] bg-[#0f7a40]/8 font-semibold" : "hover:bg-muted",
                )}
              >
                <input
                  type="radio"
                  name="wa-store"
                  value={s.slug}
                  checked={storeSlug === s.slug}
                  onChange={() => setStoreSlug(s.slug)}
                  className="sr-only"
                />
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#0f7a40]" aria-hidden="true" />
                <span className="leading-tight">
                  {s.shortName}
                  <span className="block text-xs font-normal text-muted-foreground">{s.city}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Assunto</legend>
          <div className="flex flex-wrap gap-2">
            {WHATSAPP_SUBJECTS.map((s) => (
              <label
                key={s.id}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                  subject === s.id ? "border-ocean-900 bg-ocean-900 text-white" : "hover:bg-muted",
                )}
              >
                <input
                  type="radio"
                  name="wa-subject"
                  value={s.id}
                  checked={subject === s.id}
                  onChange={() => setSubject(s.id)}
                  className="sr-only"
                />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0f7a40] font-semibold text-white transition hover:bg-[#0b6534]"
        >
          <Send className="size-4" aria-hidden="true" />
          Abrir conversa no WhatsApp
        </a>
      </div>
    </>
  );
}
