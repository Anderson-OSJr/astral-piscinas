import { Suspense } from "react";
import { UtmCapture } from "@/components/forms/lead-context";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { PromoBar } from "@/components/site/promo-bar";
import { WhatsappWidget } from "@/components/site/whatsapp-widget";
import { MobileCtaBar } from "@/components/site/mobile-cta-bar";
import { JsonLd } from "@/components/site/json-ld";
import { getStores } from "@/server/queries/stores";
import { getCategories } from "@/server/queries/catalog";
import { getActivePromotion } from "@/server/queries/content";
import { getSetting } from "@/server/queries/settings";
import { organizationJsonLd } from "@/lib/seo";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [stores, categories, promo, social] = await Promise.all([
    getStores(),
    getCategories(),
    getActivePromotion(),
    getSetting("social"),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ocean-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      {promo && <PromoBar promo={promo} />}
      <Header categories={categories.map((c) => ({ slug: c.slug, name: c.name, section: c.section }))} />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <Footer stores={stores} social={social} />
      <WhatsappWidget stores={stores.map((s) => ({ slug: s.slug, shortName: s.shortName, city: s.city, whatsapp: s.whatsapp }))} />
      <MobileCtaBar />
      <JsonLd data={organizationJsonLd(social)} />
      <Suspense fallback={null}>
        <UtmCapture />
      </Suspense>
    </div>
  );
}
