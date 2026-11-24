import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export const getServices = cache(async () =>
  db.service.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
);

export const getTestimonials = cache(async () =>
  db.testimonial.findMany({ where: { active: true }, orderBy: { order: "asc" } }),
);

export const getProjects = cache(async (opts: { featured?: boolean } = {}) =>
  db.project.findMany({ where: opts.featured ? { featured: true } : {}, orderBy: { order: "asc" } }),
);

export const getFaqs = cache(async (category?: string) =>
  db.faq.findMany({
    where: category ? { category: { in: [category, "geral"] } } : {},
    orderBy: { order: "asc" },
  }),
);

export const getPosts = cache(async (take?: number) =>
  db.post.findMany({
    where: { publishedAt: { not: null, lte: new Date() } },
    orderBy: { publishedAt: "desc" },
    take,
  }),
);

export const getPostBySlug = cache(async (slug: string) =>
  db.post.findFirst({ where: { slug, publishedAt: { not: null, lte: new Date() } } }),
);

/** Promoção ativa agora (respeita início/fim). */
export const getActivePromotion = cache(async () => {
  const now = new Date();
  return db.promotion.findFirst({
    where: {
      active: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: { startsAt: "desc" },
  });
});
