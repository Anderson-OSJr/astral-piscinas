import { z } from "zod";

export const LEAD_INTERESTS = [
  "AQUECIMENTO_SOLAR",
  "FOTOVOLTAICA",
  "PISCINA",
  "TRATAMENTO",
  "LAZER",
  "BANHO_CONFORTO",
  "SERVICO",
  "OUTRO",
] as const;

/** Telefone brasileiro: DDD + 8 dígitos (fixo) ou DDD + 9 + 8 dígitos (celular). */
export const phoneSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, ""))
  .refine((d) => /^[1-9]{2}(?:9\d{8}|[2-5]\d{7})$/.test(d), "Informe um telefone válido com DDD");

const payloadValue = z.union([z.string().max(500), z.number(), z.boolean()]);

export const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Conte pra gente o seu nome").max(120),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email("E-mail inválido").optional()),
  city: z.string().trim().max(80).optional(),
  storeId: z.string().max(40).optional(),
  interest: z.enum(LEAD_INTERESTS),
  message: z.string().trim().max(2000).optional(),
  consentLgpd: z.literal(true, { error: "Precisamos do seu aceite para entrar em contato" }),
});

export const leadSubmissionSchema = leadFormSchema.extend({
  payload: z.record(z.string().max(60), payloadValue).optional(),
  sourcePage: z.string().max(300).default("/"),
  utm: z.record(z.string().max(40), z.string().max(200)).optional(),
  /** Honeypot: humanos deixam vazio */
  website: z.string().max(0).optional(),
});

export type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadSubmission = z.input<typeof leadSubmissionSchema>;

export type LeadActionResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };
