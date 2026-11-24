import type { Metadata } from "next";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/admin/ui";
import { LeadRow } from "@/components/admin/lead-row";
import { getLeads, leadFiltersSchema } from "@/server/queries/leads";
import { db } from "@/lib/db";
import { INTEREST_LABELS, STATUS_LABELS } from "@/lib/site";

export const metadata: Metadata = { title: "Pedidos de orçamento" };

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const filters = leadFiltersSchema.parse(await searchParams);
  const [{ rows, total, pages }, stores] = await Promise.all([
    getLeads(filters),
    db.store.findMany({ select: { id: true, name: true }, orderBy: { order: "asc" } }),
  ]);

  const qs = (extra: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    const merged = { status: filters.status, interest: filters.interest, store: filters.store, q: filters.q, ...extra };
    for (const [k, v] of Object.entries(merged)) if (v !== undefined && v !== "") sp.set(k, String(v));
    return sp.toString();
  };

  const selectClass = "h-10 rounded-xl border bg-background px-3 text-sm";

  return (
    <>
      <PageHeader
        title="Pedidos de orçamento"
        description={`${total} ${total === 1 ? "pedido encontrado" : "pedidos encontrados"}. Mude o status conforme for atendendo.`}
        actions={
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href={`/admin/leads/export?${qs({ page: undefined })}`}>
              <Download aria-hidden="true" /> Exportar planilha (CSV)
            </a>
          </Button>
        }
      />

      <Panel className="mb-4">
        <form className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]" action="/admin/leads">
          <label className="relative">
            <span className="sr-only">Buscar</span>
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input name="q" defaultValue={filters.q} placeholder="Nome, telefone, cidade…" className="h-10 w-full rounded-xl border bg-background pr-3 pl-9 text-sm" />
          </label>
          <label>
            <span className="sr-only">Status</span>
            <select name="status" defaultValue={filters.status ?? ""} className={selectClass}>
              <option value="">Todos os status</option>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Loja</span>
            <select name="store" defaultValue={filters.store ?? ""} className={selectClass}>
              <option value="">Todas as lojas</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Interesse</span>
            <select name="interest" defaultValue={filters.interest ?? ""} className={selectClass}>
              <option value="">Todos os interesses</option>
              {Object.entries(INTEREST_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <Button type="submit" variant="ocean" size="lg" className="flex-1 rounded-xl">
              Filtrar
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-xl">
              <Link href="/admin/leads">Limpar</Link>
            </Button>
          </div>
        </form>
      </Panel>

      {rows.length === 0 ? (
        <Panel className="py-12 text-center text-muted-foreground">Nenhum pedido com esses filtros.</Panel>
      ) : (
        <ul className="space-y-3">
          {rows.map((l) => (
            <LeadRow
              key={l.id}
              lead={{
                id: l.id,
                name: l.name,
                phone: l.phone,
                email: l.email,
                city: l.city,
                storeName: l.store?.name ?? null,
                interest: l.interest,
                message: l.message,
                payload: (l.payload ?? null) as Record<string, unknown> | null,
                sourcePage: l.sourcePage,
                utm: (l.utm ?? null) as Record<string, unknown> | null,
                status: l.status,
                notes: l.notes,
                createdAt: l.createdAt.toISOString(),
              }}
            />
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Paginação">
          {filters.page > 1 && (
            <Button asChild variant="outline" size="lg">
              <Link href={`/admin/leads?${qs({ page: filters.page - 1 })}`}>Anterior</Link>
            </Button>
          )}
          <span className="px-3 text-sm text-muted-foreground">
            Página {filters.page} de {pages}
          </span>
          {filters.page < pages && (
            <Button asChild variant="outline" size="lg">
              <Link href={`/admin/leads?${qs({ page: filters.page + 1 })}`}>Próxima</Link>
            </Button>
          )}
        </nav>
      )}
    </>
  );
}
