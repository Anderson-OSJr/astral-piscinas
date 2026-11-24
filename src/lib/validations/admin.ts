import { z } from "zod";
import { openingHoursSchema } from "@/lib/hours";

/** Schemas dos formulários do painel. Compartilhados entre cliente (validação imediata) e servidor (revalidação). */

const slug = z
  .string()
  .trim()
  .min(2, "Informe o endereço (slug)")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use só letras minúsculas, números e hífens (ex.: piscina-de-vinil)");
const text = (label: string, max = 200) => z.string().trim().min(1, `${label} é obrigatório`).max(max);
const optionalText = (max = 2000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));
const order = z.coerce.number().int().min(0).max(9999).default(0);
const url = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), "Use um link começando com https:// ou /");
const optionalUrl = url.optional().transform((v) => (v ? v : null));
const images = z.array(url.refine((v) => v !== "", "Imagem vazia")).max(12);
const optionalDate = z
  .string()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null;
    // Valores do <input type="datetime-local"> vêm sem fuso: interpretamos como horário de Brasília
    const d = new Date(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) ? `${v}:00-03:00` : v);
    if (Number.isNaN(d.getTime())) {
      ctx.addIssue({ code: "custom", message: "Data inválida" });
      return z.NEVER;
    }
    return d;
  });

export const productSchema = z.object({
  name: text("Nome", 160),
  slug,
  categoryId: text("Categoria", 40),
  shortDescription: text("Resumo", 300),
  description: text("Descrição", 20000),
  specs: z.array(z.object({ label: text("Item", 80), value: text("Valor", 200) })).max(30).default([]),
  images: images.default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  order,
});

export const categorySchema = z.object({
  name: text("Nome", 120),
  slug,
  description: optionalText(500),
  icon: optionalText(40),
  image: optionalUrl,
  section: optionalText(40),
  order,
});

export const serviceSchema = z.object({
  name: text("Nome", 120),
  slug,
  description: text("Descrição", 1000),
  icon: optionalText(40),
  image: optionalUrl,
  order,
  active: z.boolean().default(true),
});

export const storeSchema = z.object({
  name: text("Nome", 120),
  slug,
  address: text("Endereço", 200),
  neighborhood: text("Bairro", 120),
  city: text("Cidade", 80),
  cep: optionalText(12),
  phone: text("Telefone", 30),
  whatsapp: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 13, "WhatsApp com DDD (ex.: 5516999999999)"),
  email: z.email("E-mail inválido"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  mapsUrl: optionalUrl,
  openingHours: openingHoursSchema.default([]),
  hoursNote: optionalText(200),
  image: optionalUrl,
  isMain: z.boolean().default(false),
  order,
});

export const testimonialSchema = z.object({
  author: text("Nome", 120),
  role: optionalText(120),
  text: text("Depoimento", 1500),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  active: z.boolean().default(true),
  order,
});

export const projectSchema = z.object({
  title: text("Título", 160),
  type: text("Tipo", 80),
  city: optionalText(80),
  images: images.min(1, "Adicione pelo menos uma foto"),
  description: optionalText(1000),
  featured: z.boolean().default(false),
  order,
});

export const promotionSchema = z.object({
  title: text("Título", 80),
  text: optionalText(200),
  ctaLabel: optionalText(40),
  ctaHref: optionalUrl,
  startsAt: optionalDate,
  endsAt: optionalDate,
  active: z.boolean().default(true),
});

export const postSchema = z.object({
  title: text("Título", 200),
  slug,
  excerpt: text("Resumo", 400),
  content: text("Conteúdo", 50000),
  coverImage: optionalUrl,
  publishedAt: optionalDate,
  seoTitle: optionalText(70),
  seoDescription: optionalText(170),
});

export const faqSchema = z.object({
  question: text("Pergunta", 300),
  answer: text("Resposta", 3000),
  category: z.string().trim().min(1).max(40).default("geral"),
  order,
});

export const ADMIN_SCHEMAS = {
  produtos: productSchema,
  categorias: categorySchema,
  servicos: serviceSchema,
  lojas: storeSchema,
  depoimentos: testimonialSchema,
  projetos: projectSchema,
  promocoes: promotionSchema,
  posts: postSchema,
  faqs: faqSchema,
} as const;

export type EntityKey = keyof typeof ADMIN_SCHEMAS;
export const ENTITY_KEYS = Object.keys(ADMIN_SCHEMAS) as EntityKey[];
export type EntityData<K extends EntityKey> = z.output<(typeof ADMIN_SCHEMAS)[K]>;

export const leadStatusSchema = z.object({
  id: z.string().min(1).max(40),
  status: z.enum(["NOVO", "EM_ATENDIMENTO", "FECHADO", "PERDIDO"]),
});
