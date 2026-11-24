import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/ui";
import { EntityForm } from "@/components/admin/entity-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { ENTITIES } from "@/lib/admin/entities";
import { ENTITY_KEYS, type EntityKey } from "@/lib/validations/admin";
import { getRepo } from "@/server/admin/repository";
import { db } from "@/lib/db";

function parseEntity(value: string): EntityKey | null {
  return (ENTITY_KEYS as string[]).includes(value) ? (value as EntityKey) : null;
}

export async function generateMetadata({ params }: PageProps<"/admin/[entity]/[id]">): Promise<Metadata> {
  const { entity, id } = await params;
  const key = parseEntity(entity);
  if (!key) return { title: "Não encontrado" };
  return { title: id === "novo" ? `Novo ${ENTITIES[key].singular}` : `Editar ${ENTITIES[key].singular}` };
}

/** Converte valores do banco para o formato dos inputs (datas → "AAAA-MM-DDTHH:mm", null → ""). */
function toFormValues(row: Record<string, unknown>, defaults: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const v = row[key];
    if (v instanceof Date) {
      // Horário de Brasília (sem horário de verão desde 2019)
      out[key] = new Date(v.getTime() - 3 * 60 * 60 * 1000).toISOString().slice(0, 16);
    } else if (v === null || v === undefined) {
      out[key] = defaults[key];
    } else out[key] = v;
  }
  return out;
}

export default async function EntityEditPage({ params }: PageProps<"/admin/[entity]/[id]">) {
  const { entity, id } = await params;
  const key = parseEntity(entity);
  if (!key) notFound();
  const config = ENTITIES[key];
  const isNew = id === "novo";
  const row = isNew ? null : await getRepo(key).get(id);
  if (!isNew && !row) notFound();

  const needsCategories = config.fields.some((f) => f.type === "select" && f.options === "categories");
  const categories = needsCategories
    ? (await db.category.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } })).map((c) => ({ value: c.id, label: c.name }))
    : [];

  const titleField = config.fields[0]?.name;
  const label = row && titleField ? String(row[titleField] ?? config.singular) : config.singular;

  return (
    <>
      <Link href={`/admin/${key}`} className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> {config.label}
      </Link>
      <PageHeader
        title={isNew ? `Novo ${config.singular}` : label}
        description={isNew ? config.description : "As alterações aparecem no site assim que você salvar."}
        actions={!isNew && row ? <DeleteButton entity={key} id={row.id} label={label} redirectTo={`/admin/${key}`} /> : undefined}
      />
      <EntityForm
        entity={key}
        id={isNew ? null : id}
        initialValues={row ? toFormValues(row, config.defaults) : config.defaults}
        categories={categories}
      />
    </>
  );
}
