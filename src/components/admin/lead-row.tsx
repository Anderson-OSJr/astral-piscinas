"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Mail, MapPin, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/admin/ui";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";
import { updateLeadNotes, updateLeadStatus } from "@/server/actions/admin";
import { INTEREST_LABELS, STATUS_LABELS } from "@/lib/site";
import { formatPhone, telHref } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import type { LeadInterest, LeadStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

export type LeadRowData = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  storeName: string | null;
  interest: LeadInterest;
  message: string | null;
  payload: Record<string, unknown> | null;
  sourcePage: string;
  utm: Record<string, unknown> | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
};

export function LeadRow({ lead }: { lead: LeadRowData }) {
  const [open, setOpen] = useState(lead.status === "NOVO");
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [pending, startTransition] = useTransition();

  const changeStatus = (next: LeadStatus) => {
    const prev = status;
    setStatus(next);
    startTransition(async () => {
      const r = await updateLeadStatus({ id: lead.id, status: next });
      if (!r.ok) {
        setStatus(prev);
        toast.error(r.error);
      } else toast.success(`Status: ${STATUS_LABELS[next]}`);
    });
  };

  const saveNotes = () =>
    startTransition(async () => {
      const r = await updateLeadNotes({ id: lead.id, notes });
      if (r.ok) toast.success("Anotação salva");
      else toast.error(r.error);
    });

  const firstName = lead.name.split(" ")[0];
  const reply = whatsappLink(
    lead.phone,
    `Olá, ${firstName}! Aqui é da Astral${lead.storeName ? ` (${lead.storeName})` : ""}. Recebemos seu pedido de orçamento sobre ${INTEREST_LABELS[lead.interest].toLowerCase()} pelo site.`,
  );

  return (
    <li className={cn("overflow-hidden rounded-2xl border bg-background shadow-sm", status === "NOVO" && "border-sun-300")}>
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-start gap-3 text-left" aria-expanded={open}>
          <ChevronDown className={cn("mt-1 size-4 shrink-0 transition", open && "rotate-180")} aria-hidden="true" />
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2 font-semibold">
              {lead.name} <StatusBadge status={status} />
            </span>
            <span className="block text-sm text-muted-foreground">
              {INTEREST_LABELS[lead.interest]} · {lead.storeName ?? "Sem loja"} ·{" "}
              {new Date(lead.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" })}
            </span>
          </span>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`status-${lead.id}`}>
            Status
          </label>
          <select
            id={`status-${lead.id}`}
            value={status}
            disabled={pending}
            onChange={(e) => changeStatus(e.target.value as LeadStatus)}
            className="h-10 rounded-xl border bg-background px-3 text-sm font-semibold"
          >
            {Object.entries(STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <Button asChild variant="whatsapp" size="lg" className="rounded-xl">
            <a href={reply} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="size-4" /> Responder
            </a>
          </Button>
        </div>
      </div>
      {open && (
        <div className="grid gap-4 border-t bg-muted/30 p-4 text-sm md:grid-cols-2">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
              <a href={telHref(lead.phone)} className="font-semibold hover:underline">
                {formatPhone(lead.phone)}
              </a>
            </p>
            {lead.email && (
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                <a href={`mailto:${lead.email}`} className="hover:underline">
                  {lead.email}
                </a>
              </p>
            )}
            {lead.city && (
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" aria-hidden="true" /> {lead.city}
              </p>
            )}
            {lead.message && <p className="rounded-xl bg-background p-3 whitespace-pre-line">“{lead.message}”</p>}
            {lead.payload && Object.keys(lead.payload).length > 0 && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-xl bg-background p-3">
                {Object.entries(lead.payload).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="text-xs text-muted-foreground">
              Página: {lead.sourcePage}
              {lead.utm && Object.keys(lead.utm).length > 0 && ` · ${Object.entries(lead.utm).map(([k, v]) => `${k}=${String(v)}`).join(" · ")}`}
            </p>
          </div>
          <div>
            <label htmlFor={`notes-${lead.id}`} className="font-semibold">
              Anotações internas
            </label>
            <Textarea
              id={`notes-${lead.id}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Ex.: liguei dia 12, pediu visita no sábado"
              className="mt-1.5 bg-background"
            />
            <Button type="button" variant="outline" size="lg" className="mt-2" onClick={saveNotes} disabled={pending}>
              <Save aria-hidden="true" /> Salvar anotação
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}
