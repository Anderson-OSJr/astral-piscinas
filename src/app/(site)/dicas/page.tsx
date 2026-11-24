import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/site/page-blocks";
import { PostCard } from "@/components/home/home-sections";
import { Reveal } from "@/components/site/reveal";
import { getPosts } from "@/server/queries/content";
import { pageMetadata } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Dicas sobre Aquecimento Solar, Piscinas e Energia Solar",
  description:
    "Guias práticos da Astral para quem mora em Araraquara e região: aquecedor solar, escolha da piscina, tratamento da água e energia fotovoltaica.",
  path: "/dicas",
});

export default async function TipsPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        eyebrow="Dicas da Astral"
        title={
          <>
            Para decidir com <span className="text-sun">segurança.</span>
          </>
        }
        description="Guias diretos ao ponto, escritos por quem vive o sol de Araraquara todos os dias."
        image={IMG.poolSunset}
        imageAlt="Piscina ao pôr do sol"
        crumbs={[{ name: "Dicas", path: "/dicas" }]}
        primary={null}
        showWhatsapp={false}
      />
      <section className="container-page py-16">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 3) * 0.08}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
