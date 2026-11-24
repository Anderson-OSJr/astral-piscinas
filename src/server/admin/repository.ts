import "server-only";
import { db } from "@/lib/db";
import type { EntityData, EntityKey } from "@/lib/validations/admin";

/**
 * Operações de banco por entidade do painel. Cada função recebe dados já validados pelo Zod,
 * então o mapeamento para o Prisma fica explícito e tipado (sem `any`).
 */

type Row = Record<string, unknown> & { id: string };

type Repo<K extends EntityKey> = {
  list: () => Promise<Row[]>;
  get: (id: string) => Promise<Row | null>;
  create: (data: EntityData<K>) => Promise<{ id: string }>;
  update: (id: string, data: EntityData<K>) => Promise<{ id: string }>;
  remove: (id: string) => Promise<unknown>;
};

const products: Repo<"produtos"> = {
  list: () => db.product.findMany({ orderBy: [{ category: { order: "asc" } }, { order: "asc" }], include: { category: { select: { name: true } } } }),
  get: (id) => db.product.findUnique({ where: { id } }),
  create: (data) => db.product.create({ data, select: { id: true } }),
  update: (id, data) => db.product.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.product.delete({ where: { id } }),
};

const categories: Repo<"categorias"> = {
  list: () => db.category.findMany({ orderBy: { order: "asc" } }),
  get: (id) => db.category.findUnique({ where: { id } }),
  create: (data) => db.category.create({ data, select: { id: true } }),
  update: (id, data) => db.category.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.category.delete({ where: { id } }),
};

const services: Repo<"servicos"> = {
  list: () => db.service.findMany({ orderBy: { order: "asc" } }),
  get: (id) => db.service.findUnique({ where: { id } }),
  create: (data) => db.service.create({ data, select: { id: true } }),
  update: (id, data) => db.service.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.service.delete({ where: { id } }),
};

const stores: Repo<"lojas"> = {
  list: () => db.store.findMany({ orderBy: { order: "asc" } }),
  get: (id) => db.store.findUnique({ where: { id } }),
  create: (data) => db.store.create({ data, select: { id: true } }),
  update: (id, data) => db.store.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.store.delete({ where: { id } }),
};

const testimonials: Repo<"depoimentos"> = {
  list: () => db.testimonial.findMany({ orderBy: { order: "asc" } }),
  get: (id) => db.testimonial.findUnique({ where: { id } }),
  create: (data) => db.testimonial.create({ data, select: { id: true } }),
  update: (id, data) => db.testimonial.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.testimonial.delete({ where: { id } }),
};

const projects: Repo<"projetos"> = {
  list: () => db.project.findMany({ orderBy: { order: "asc" } }),
  get: (id) => db.project.findUnique({ where: { id } }),
  create: (data) => db.project.create({ data, select: { id: true } }),
  update: (id, data) => db.project.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.project.delete({ where: { id } }),
};

const promotions: Repo<"promocoes"> = {
  list: () => db.promotion.findMany({ orderBy: { startsAt: "desc" } }),
  get: (id) => db.promotion.findUnique({ where: { id } }),
  create: (data) => db.promotion.create({ data, select: { id: true } }),
  update: (id, data) => db.promotion.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.promotion.delete({ where: { id } }),
};

const posts: Repo<"posts"> = {
  list: () => db.post.findMany({ orderBy: [{ publishedAt: { sort: "desc", nulls: "first" } }] }),
  get: (id) => db.post.findUnique({ where: { id } }),
  create: (data) => db.post.create({ data, select: { id: true } }),
  update: (id, data) => db.post.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.post.delete({ where: { id } }),
};

const faqs: Repo<"faqs"> = {
  list: () => db.faq.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
  get: (id) => db.faq.findUnique({ where: { id } }),
  create: (data) => db.faq.create({ data, select: { id: true } }),
  update: (id, data) => db.faq.update({ where: { id }, data, select: { id: true } }),
  remove: (id) => db.faq.delete({ where: { id } }),
};

export const REPOS: { [K in EntityKey]: Repo<K> } = {
  produtos: products,
  categorias: categories,
  servicos: services,
  lojas: stores,
  depoimentos: testimonials,
  projetos: projects,
  promocoes: promotions,
  posts,
  faqs,
};

export function getRepo<K extends EntityKey>(key: K): Repo<K> {
  return REPOS[key];
}
