"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AuthError } from "next-auth";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireAdmin, signIn, signOut } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { ADMIN_SCHEMAS, ENTITY_KEYS, leadStatusSchema, type EntityData, type EntityKey } from "@/lib/validations/admin";
import { SETTINGS, type SettingKey } from "@/lib/settings-schema";
import { getRepo } from "@/server/admin/repository";

export type ActionResult = { ok: true; id?: string; url?: string } | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

/** O site inteiro lê do banco: revalidar o layout raiz atualiza todas as páginas públicas. */
function refreshSite() {
  revalidatePath("/", "layout");
}

function friendlyDbError(e: unknown): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002") return "Já existe um registro com esse endereço (slug) ou e-mail. Escolha outro.";
    if (e.code === "P2003") return "Não dá para excluir: há itens ligados a este registro (ex.: produtos nesta categoria).";
    if (e.code === "P2025") return "Registro não encontrado — talvez já tenha sido excluído.";
  }
  console.error(e);
  return "Não foi possível salvar agora. Tente novamente.";
}

function fieldErrorsOf(error: z.ZodError<unknown>): Record<string, string[] | undefined> {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}

async function persist<K extends EntityKey>(key: K, id: string | null, data: EntityData<K>) {
  const repo = getRepo(key);
  return id ? repo.update(id, data) : repo.create(data);
}

const entityKeySchema = z.enum(ENTITY_KEYS as [EntityKey, ...EntityKey[]]);

// ---------------------------------------------------------------------------
// Login / logout
// ---------------------------------------------------------------------------
export async function loginAction(_prev: { error?: string } | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (e) {
    if (e instanceof AuthError) return { error: "E-mail ou senha incorretos." };
    throw e; // o redirect do Next é lançado como exceção
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

// ---------------------------------------------------------------------------
// CRUD genérico
// ---------------------------------------------------------------------------
export async function saveEntity(entity: string, id: string | null, values: unknown): Promise<ActionResult> {
  await requireAdmin();
  const key = entityKeySchema.parse(entity);
  const parsed = ADMIN_SCHEMAS[key].safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Confira os campos destacados.", fieldErrors: fieldErrorsOf(parsed.error) };
  }
  try {
    if (key === "lojas" && "isMain" in parsed.data && parsed.data.isMain) {
      // Só pode existir uma matriz
      await db.store.updateMany({ where: id ? { NOT: { id } } : {}, data: { isMain: false } });
    }
    const saved = await persist(key, id, parsed.data as EntityData<typeof key>);
    refreshSite();
    return { ok: true, id: saved.id };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function deleteEntity(entity: string, id: string): Promise<ActionResult> {
  await requireAdmin();
  const key = entityKeySchema.parse(entity);
  const safeId = z.string().min(1).max(40).parse(id);
  try {
    await getRepo(key).remove(safeId);
    refreshSite();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------
export async function updateLeadStatus(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = leadStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Status inválido." };
  await db.lead.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function updateLeadNotes(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.object({ id: z.string().min(1).max(40), notes: z.string().max(4000) }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Anotação inválida." };
  await db.lead.update({ where: { id: parsed.data.id }, data: { notes: parsed.data.notes || null } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------------
export async function saveSetting(key: string, value: unknown): Promise<ActionResult> {
  await requireAdmin();
  const settingKey = z.enum(Object.keys(SETTINGS) as [SettingKey, ...SettingKey[]]).parse(key);
  const parsed = SETTINGS[settingKey].safeParse(value);
  if (!parsed.success) {
    return { ok: false, error: "Confira os valores informados.", fieldErrors: fieldErrorsOf(parsed.error) };
  }
  const json = parsed.data as Prisma.InputJsonValue;
  await db.siteSetting.upsert({ where: { key: settingKey }, update: { value: json }, create: { key: settingKey, value: json } });
  refreshSite();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Upload de imagens
// ---------------------------------------------------------------------------
export async function uploadImage(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const file = formData.get("file");
  const folder = z.string().max(30).catch("geral").parse(formData.get("folder"));
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Selecione uma imagem." };
  try {
    const { url } = await storage.upload(file, folder);
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha no upload." };
  }
}
