import "server-only";
import { cache } from "react";
import { z } from "zod";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

export const specsSchema = z.array(z.object({ label: z.string(), value: z.string() }));
export type Specs = z.infer<typeof specsSchema>;

export function parseSpecs(value: unknown): Specs {
  const parsed = specsSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  images: true,
  featured: true,
  category: { select: { slug: true, name: true } },
} satisfies Prisma.ProductSelect;

export type ProductCardDTO = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

export const getCategories = cache(async () =>
  db.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: { where: { active: true } } } } },
  }),
);

export const getCategoriesBySection = cache(async (section: string) =>
  db.category.findMany({
    where: { section },
    orderBy: { order: "asc" },
    include: {
      products: { where: { active: true }, orderBy: [{ featured: "desc" }, { order: "asc" }], select: productCardSelect },
    },
  }),
);

export const getProducts = cache(async (opts: { category?: string; q?: string } = {}) => {
  const q = opts.q?.trim();
  return db.product.findMany({
    where: {
      active: true,
      ...(opts.category ? { category: { slug: opts.category } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { shortDescription: { contains: q, mode: "insensitive" } },
              { category: { name: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: [{ category: { order: "asc" } }, { featured: "desc" }, { order: "asc" }],
    select: productCardSelect,
  });
});

export const getProductBySlug = cache(async (slug: string) => {
  const product = await db.product.findFirst({ where: { slug, active: true }, include: { category: true } });
  return product ? { ...product, specs: parseSpecs(product.specs) } : null;
});

export const getRelatedProducts = cache(async (categoryId: string, excludeId: string) =>
  db.product.findMany({
    where: { categoryId, active: true, id: { not: excludeId } },
    orderBy: { order: "asc" },
    take: 3,
    select: productCardSelect,
  }),
);

export const getAllProductSlugs = cache(async () =>
  db.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
);
