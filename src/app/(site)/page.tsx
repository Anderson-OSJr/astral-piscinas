import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { ProblemCards } from "@/components/home/problem-cards";
import { SolarHighlight } from "@/components/home/solar-highlight";
import {
  FinalCta,
  InstagramSection,
  LatestPosts,
  PoolsShowcase,
  ServicesGrid,
  TestimonialsSection,
  TimelineMini,
  WhyAstral,
} from "@/components/home/home-sections";
import { SectionHeading } from "@/components/site/section";
import { StoreLocator } from "@/components/stores/store-locator";
import { JsonLd } from "@/components/site/json-ld";
import { getSetting } from "@/server/queries/settings";
import { getStores } from "@/server/queries/stores";
import { getPosts, getProjects, getServices, getTestimonials } from "@/server/queries/content";
import { pageMetadata, storeJsonLd } from "@/lib/seo";
import { BRAND } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: `${BRAND.searchName} | Aquecimento solar e piscinas em Araraquara`,
  absoluteTitle: true,
  description:
    "Na Morada do Sol, o calor trabalha para você. Aquecedor solar, energia fotovoltaica, piscinas e lazer há quase 40 anos em Araraquara e São Carlos. 4 lojas e equipe própria.",
  path: "/",
});

export default async function HomePage() {
  const [hero, google, social, calculators, instagramGrid, stores, projects, testimonials, services, posts] = await Promise.all([
    getSetting("hero"),
    getSetting("google"),
    getSetting("social"),
    getSetting("calculators"),
    getSetting("instagramGrid"),
    getStores(),
    getProjects({ featured: true }),
    getTestimonials(),
    getServices(),
    getPosts(3),
  ]);

  return (
    <>
      <Hero hero={hero} google={google} />
      <TrustBar google={google} social={social} />
      <ProblemCards />
      <SolarHighlight settings={calculators} />
      <PoolsShowcase projects={projects} />
      <WhyAstral />
      <TimelineMini />
      <TestimonialsSection testimonials={testimonials} google={google} social={social} />
      <ServicesGrid services={services} />
      <LatestPosts posts={posts} />
      <section className="container-page py-20 sm:py-28" aria-labelledby="lojas-title">
        <SectionHeading
          eyebrow="Nossas lojas"
          title={<span id="lojas-title">3 lojas em Araraquara e 1 em São Carlos</span>}
          description="Descubra a mais perto de você e chame direto no WhatsApp da loja."
        />
        <div className="mt-10">
          <StoreLocator stores={stores} />
        </div>
      </section>
      <InstagramSection grid={instagramGrid} social={social} />
      <FinalCta />
      <JsonLd data={stores.map((s) => storeJsonLd(s, google))} />
    </>
  );
}
