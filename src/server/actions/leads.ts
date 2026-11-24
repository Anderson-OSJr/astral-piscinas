"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { leadRateLimiter } from "@/lib/rate-limit";
import { leadSubmissionSchema, type LeadActionResult, type LeadSubmission } from "@/lib/validations/lead";

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconhecido";
}

/** Salva um lead vindo de qualquer formulário do site (orçamento, wizard, visita técnica). */
export async function createLead(input: LeadSubmission): Promise<LeadActionResult> {
  const parsed = leadSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Confira os campos destacados.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const data = parsed.data;

  // Honeypot preenchido = robô. Respondemos "ok" para não dar pistas.
  if (data.website) return { ok: true, leadId: "ok" };

  const limit = await leadRateLimiter.check(await clientIp());
  if (!limit.ok) {
    return { ok: false, error: "Recebemos muitos envios seguidos. Tente de novo em alguns minutos ou chame no WhatsApp." };
  }

  const storeId = data.storeId ? (await db.store.findUnique({ where: { id: data.storeId }, select: { id: true } }))?.id : undefined;

  const lead = await db.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      city: data.city || undefined,
      storeId,
      interest: data.interest,
      message: data.message || undefined,
      payload: data.payload,
      sourcePage: data.sourcePage,
      utm: data.utm,
      consentLgpd: data.consentLgpd,
    },
    select: { id: true },
  });

  revalidatePath("/admin", "layout");
  return { ok: true, leadId: lead.id };
}
