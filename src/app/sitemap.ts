import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-url";
import { SOLUTIONS } from "@/lib/site";
import { POOL_TYPES } from "@/lib/pool-types";
import { getAllProductSlugs } from "@/server/queries/catalog";
import { getPosts } from "@/server/queries/content";
import { getStores } from "@/server/queries/stores";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts, stores] = await Promise.all([getAllProductSlugs(), getPosts(), getStores()]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...SOLUTIONS.map((s) => ({ url: absoluteUrl(s.href), lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...POOL_TYPES.map((t) => ({ url: absoluteUrl(`/piscinas/${t.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...["/produtos", "/servicos", "/lojas", "/sobre", "/dicas", "/orcamento"].map((p) => ({
      url: absoluteUrl(p),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/politica-de-privacidade"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...staticPages,
    ...stores.map((s) => ({ url: absoluteUrl(`/lojas/${s.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: absoluteUrl(`/produtos/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/dicas/${p.slug}`), lastModified: p.updatedAt, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
