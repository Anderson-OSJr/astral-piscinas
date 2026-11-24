import "server-only";
import { z } from "zod";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { LEAD_INTERESTS } from "@/lib/validations/lead";

export const leadFiltersSchema = z.object({
  status: z.enum(["NOVO", "EM_ATENDIMENTO", "FECHADO", "PERDIDO"]).optional().catch(undefined),
  interest: z.enum(LEAD_INTERESTS).optional().catch(undefined),
  store: z.string().max(40).optional().catch(undefined),
  q: z.string().trim().max(80).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(1000).default(1).catch(1),
});

export type LeadFilters = z.infer<typeof leadFiltersSchema>;

export function leadWhere(f: LeadFilters): Prisma.LeadWhereInput {
  const digits = f.q?.replace(/\D/g, "");
  return {
    ...(f.status ? { status: f.status } : {}),
    ...(f.interest ? { interest: f.interest } : {}),
    ...(f.store ? { storeId: f.store } : {}),
    ...(f.q
      ? {
          OR: [
            { name: { contains: f.q, mode: "insensitive" } },
            { email: { contains: f.q, mode: "insensitive" } },
            { city: { contains: f.q, mode: "insensitive" } },
            ...(digits ? [{ phone: { contains: digits } }] : []),
          ],
        }
      : {}),
  };
}

export const LEADS_PAGE_SIZE = 25;

export async function getLeads(f: LeadFilters) {
  const where = leadWhere(f);
  const [rows, total] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (f.page - 1) * LEADS_PAGE_SIZE,
      take: LEADS_PAGE_SIZE,
      include: { store: { select: { name: true } } },
    }),
    db.lead.count({ where }),
  ]);
  return { rows, total, pages: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)) };
}
