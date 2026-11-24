import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ExternalLink, Pencil, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { SmartImage } from "@/components/site/smart-image";
import { ENTITIES, type ColumnDef } from "@/lib/admin/entities";
import { ENTITY_KEYS, type EntityKey } from "@/lib/validations/admin";
import { getRepo } from "@/server/admin/repository";

function parseEntity(value: string): EntityKey | null {
  return (ENTITY_KEYS as string[]).includes(value) ? (value as EntityKey) : null;
}

export async function generateMetadata({ params }: PageProps<"/admin/[entity]">): Promise<Metadata> {
  const key = parseEntity((await params).entity);
  return { title: key ? ENTITIES[key].label : "Não encontrado" };
}

function Cell({ col, row }: { col: ColumnDef; row: Record<string, unknown> }) {
  const value = row[col.key];
  switch (col.kind) {
    case "image": {
      const src = Array.isArray(value) ? (value[0] as string | undefined) : (value as string | null);
      return src ? (
        <span className="relative block size-12 overflow-hidden rounded-lg bg-muted">
          <SmartImage src={src} alt="" fill sizes="3rem" />
        </span>
      ) : (
        <span className="block size-12 rounded-lg bg-muted" />
      );
    }
    case "boolean":
      return value ? <Check className="size-5 text-[#11743e]" aria-label="Sim" /> : <span className="text-muted-foreground">—</span>;
    case "date":
      return value instanceof Date ? (
        <span>{value.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</span>
      ) : (
        <span className="text-muted-foreground">{col.key === "publishedAt" ? "Rascunho" : "—"}</span>
      );
    case "relation":
      return <span>{(value as { name?: string } | null)?.name ?? "—"}</span>;
    case "stars":
      return (
        <span className="flex text-sun-500" role="img" aria-label={`${String(value)} estrelas`}>
          {Array.from({ length: Number(value) || 0 }, (_, i) => (
            <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
          ))}
        </span>
      );
    default:
      return <span className="line-clamp-2">{value === null || value === undefined || value === "" ? "—" : String(value)}</span>;
  }
}

export default async function EntityListPage({ params }: PageProps<"/admin/[entity]">) {
  const key = parseEntity((await params).entity);
  if (!key) notFound();
  const config = ENTITIES[key];
  const rows = await getRepo(key).list();
  const titleCol = config.columns.find((c) => !c.kind) ?? config.columns[0];

  return (
    <>
      <PageHeader
        title={config.label}
        description={config.description}
        actions={
          <Button asChild variant="sun" size="lg" className="rounded-full">
            <Link href={`/admin/${key}/novo`}>
              <Plus aria-hidden="true" /> Adicionar {config.singular}
            </Link>
          </Button>
        }
      />
      {rows.length === 0 ? (
        <Panel className="py-12 text-center">
          <p className="text-muted-foreground">Nada cadastrado ainda.</p>
        </Panel>
      ) : (
        <Panel className="overflow-hidden p-0">
          {/* Tabela no desktop */}
          <table className="hidden w-full text-sm md:table">
            <thead className="border-b bg-muted/50 text-left">
              <tr>
                {config.columns.map((c) => (
                  <th key={c.key} scope="col" className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => {
                const publicHref = config.publicPath?.(row);
                return (
                  <tr key={row.id} className="hover:bg-muted/30">
                    {config.columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 align-middle">
                        {c === titleCol ? (
                          <Link href={`/admin/${key}/${row.id}`} className="font-semibold text-ocean-900 hover:underline">
                            <Cell col={c} row={row} />
                          </Link>
                        ) : (
                          <Cell col={c} row={row} />
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {publicHref && (
                          <Button asChild variant="ghost" size="icon-lg" aria-label="Ver no site">
                            <a href={publicHref} target="_blank" rel="noopener noreferrer">
                              <ExternalLink />
                            </a>
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="icon-lg" aria-label="Editar">
                          <Link href={`/admin/${key}/${row.id}`}>
                            <Pencil />
                          </Link>
                        </Button>
                        <DeleteButton entity={key} id={row.id} label={String(row[titleCol.key] ?? config.singular)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Cards no celular */}
          <ul className="divide-y md:hidden">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center gap-3 p-3">
                {config.columns[0].kind === "image" && <Cell col={config.columns[0]} row={row} />}
                <Link href={`/admin/${key}/${row.id}`} className="min-w-0 flex-1">
                  <span className="block font-semibold text-ocean-900">
                    <Cell col={titleCol} row={row} />
                  </span>
                  <span className="block text-xs text-muted-foreground">Toque para editar</span>
                </Link>
                <DeleteButton entity={key} id={row.id} label={String(row[titleCol.key] ?? config.singular)} />
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
