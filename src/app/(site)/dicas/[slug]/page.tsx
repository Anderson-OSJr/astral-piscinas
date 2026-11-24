import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { z } from "zod";
import { Breadcrumbs, CtaBand, Markdown } from "@/components/site/page-blocks";
import { PostCard } from "@/components/home/home-sections";
import { SmartImage } from "@/components/site/smart-image";
import { JsonLd } from "@/components/site/json-ld";
import { getPostBySlug, getPosts } from "@/server/queries/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";
import { BRAND } from "@/lib/site";

export const revalidate = 3600;

const slugSchema = z.string().regex(/^[a-z0-9-]+$/).max(160);

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

async function load(params: PageProps<"/dicas/[slug]">["params"]) {
  const parsed = slugSchema.safeParse((await params).slug);
  return parsed.success ? getPostBySlug(parsed.data) : null;
}

export async function generateMetadata({ params }: PageProps<"/dicas/[slug]">): Promise<Metadata> {
  const post = await load(params);
  if (!post) return {};
  return pageMetadata({
    title: post.seoTitle ?? post.title,
    absoluteTitle: Boolean(post.seoTitle),
    description: post.seoDescription ?? post.excerpt,
    path: `/dicas/${post.slug}`,
    image: post.coverImage ?? undefined,
    type: "article",
  });
}

export default async function PostPage({ params }: PageProps<"/dicas/[slug]">) {
  const post = await load(params);
  if (!post) notFound();
  const more = (await getPosts(4)).filter((p) => p.id !== post.id).slice(0, 3);
  const minutes = Math.max(2, Math.round(post.content.split(/\s+/).length / 200));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: absoluteUrl(`/dicas/${post.slug}`),
    author: { "@type": "Organization", name: BRAND.searchName, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <article>
        <header className="container-page max-w-4xl pt-8 pb-10">
          <Breadcrumbs
            tone="light"
            items={[
              { name: "Dicas", path: "/dicas" },
              { name: post.title, path: `/dicas/${post.slug}` },
            ]}
          />
          <h1 className="mt-8 text-4xl leading-[1.08] font-extrabold text-ocean-900 sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-xl text-muted-foreground">{post.excerpt}</p>
          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-sun-600" aria-hidden="true" />
                <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-sun-600" aria-hidden="true" /> {minutes} min de leitura
            </span>
          </p>
        </header>
        {post.coverImage && (
          <div className="container-page max-w-5xl">
            <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem]">
              <SmartImage src={post.coverImage} alt="" fill priority sizes="(min-width:1024px) 64rem, 100vw" />
            </div>
          </div>
        )}
        <div className="container-page max-w-3xl py-12">
          <Markdown content={post.content} />
        </div>
      </article>
      {more.length > 0 && (
        <section className="bg-sand py-16" aria-labelledby="mais-dicas">
          <div className="container-page">
            <h2 id="mais-dicas" className="text-3xl font-extrabold text-ocean-900">
              Continue lendo
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {more.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <CtaBand />
      <JsonLd data={jsonLd} />
    </>
  );
}
