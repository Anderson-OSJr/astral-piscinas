import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Inbox, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, StatusBadge } from "@/components/admin/ui";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";
import { db } from "@/lib/db";
import { INTEREST_LABELS } from "@/lib/site";
import { formatPhone } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Painel" };

function dateRanges() {
  const now = new Date();
  return { weekAgo: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), monthStart: new Date(now.getFullYear(), now.getMonth(), 1) };
}

function greeting() {
  const hour = Number(new Date().toLocaleString("pt-BR", { hour: "numeric", hour12: false, timeZone: "America/Sao_Paulo" }));
  return hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
}

export default async function DashboardPage() {
  const { weekAgo, monthStart } = dateRanges();
  const [weekCount, newCount, byInterest, byStore, stores, latest, totalMonth] = await Promise.all([
    db.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    db.lead.count({ where: { status: "NOVO" } }),
    db.lead.groupBy({ by: ["interest"], where: { createdAt: { gte: weekAgo } }, _count: { _all: true } }),
    db.lead.groupBy({ by: ["storeId"], where: { createdAt: { gte: weekAgo } }, _count: { _all: true } }),
    db.store.findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { store: { select: { name: true } } } }),
    db.lead.count({ where: { createdAt: { gte: monthStart } } }),
  ]);

  const interestRows = byInterest.map((r) => ({ label: INTEREST_LABELS[r.interest], count: r._count._all })).sort((a, b) => b.count - a.count);
  const storeRows = stores.map((s) => ({ label: s.name, count: byStore.find((b) => b.storeId === s.id)?._count._all ?? 0 }));
  const maxInterest = Math.max(1, ...interestRows.map((r) => r.count));
  const maxStore = Math.max(1, ...storeRows.map((r) => r.count));

  return (
    <>
      <PageHeader
        title={`${greeting()}! ☀️`}
        description="Resumo dos pedidos de orçamento que chegaram pelo site."
        actions={
          <Button asChild variant="ocean" size="lg" className="rounded-full">
            <Link href="/admin/leads?status=NOVO">
              Ver pedidos novos <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Pedidos nos últimos 7 dias", value: weekCount, Icon: TrendingUp },
          { label: "Aguardando resposta", value: newCount, Icon: Sparkles, highlight: newCount > 0 },
          { label: "Pedidos neste mês", value: totalMonth, Icon: Inbox },
        ].map(({ label, value, Icon, highlight }) => (
          <Panel key={label} className={highlight ? "border-sun-300 bg-sun-100" : undefined}>
            <Icon className="size-5 text-sun-600" aria-hidden="true" />
            <p className="font-heading mt-3 text-4xl font-extrabold text-ocean-900 tabular-nums">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="font-bold text-ocean-900">Por interesse (7 dias)</h2>
          {interestRows.length ? (
            <ul className="mt-4 space-y-3">
              {interestRows.map((r) => (
                <li key={r.label}>
                  <div className="flex justify-between text-sm">
                    <span>{r.label}</span>
                    <strong className="tabular-nums">{r.count}</strong>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div className="bg-sun h-2 rounded-full" style={{ width: `${(r.count / maxInterest) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Nenhum pedido nesta semana ainda.</p>
          )}
        </Panel>
        <Panel>
          <h2 className="font-bold text-ocean-900">Por loja (7 dias)</h2>
          <ul className="mt-4 space-y-3">
            {storeRows.map((r) => (
              <li key={r.label}>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    {r.label}
                  </span>
                  <strong className="tabular-nums">{r.count}</strong>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-ocean-500" style={{ width: `${(r.count / maxStore) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-4 p-0">
        <div className="flex items-center justify-between p-5">
          <h2 className="font-bold text-ocean-900">Últimos pedidos</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-ocean-700 hover:underline">
            Ver todos
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="px-5 pb-5 text-sm text-muted-foreground">Quando alguém pedir orçamento pelo site, aparece aqui.</p>
        ) : (
          <ul className="divide-y border-t">
            {latest.map((l) => (
              <li key={l.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {l.name} <StatusBadge status={l.status} />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {INTEREST_LABELS[l.interest]} · {l.store?.name ?? "Sem loja"} ·{" "}
                    {l.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" })}
                  </p>
                </div>
                <Button asChild variant="whatsapp" size="lg" className="shrink-0 rounded-full">
                  <a
                    href={whatsappLink(l.phone, `Olá, ${l.name.split(" ")[0]}! Aqui é da Astral. Recebemos seu pedido de orçamento pelo site sobre ${INTEREST_LABELS[l.interest].toLowerCase()}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsappIcon className="size-4" /> Responder {formatPhone(l.phone)}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
