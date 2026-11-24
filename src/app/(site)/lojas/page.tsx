import type { Metadata } from "next";
import { PageHero, CtaBand } from "@/components/site/page-blocks";
import { StoreLocator } from "@/components/stores/store-locator";
import { JsonLd } from "@/components/site/json-ld";
import { getStores } from "@/server/queries/stores";
import { getSetting } from "@/server/queries/settings";
import { pageMetadata, storeJsonLd } from "@/lib/seo";
import { IMG } from "@/lib/images";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Lojas em Araraquara e São Carlos — Endereços e WhatsApp",
  description:
    "As 4 lojas Astral: Vila Harmonia, Vila Ferroviária e Vila Xavier em Araraquara, e Jardim Bandeirantes em São Carlos. Endereço, telefone, WhatsApp e como chegar.",
  path: "/lojas",
});

export default async function StoresPage() {
  const [stores, google] = await Promise.all([getStores(), getSetting("google")]);
  return (
    <>
      <PageHero
        eyebrow="Nossas lojas"
        title={
          <>
            Sempre tem uma Astral <span className="text-sun">perto de você.</span>
          </>
        }
        description="3 lojas em Araraquara e 1 em São Carlos, com estoque amplo e equipe pronta para ajudar."
        image={IMG.poolFront}
        imageAlt="Fachada de casa com piscina"
        crumbs={[{ name: "Lojas", path: "/lojas" }]}
        primary={null}
      />
      <section className="container-page py-16">
        <StoreLocator stores={stores} />
      </section>
      <CtaBand />
      <JsonLd data={stores.map((s) => storeJsonLd(s, google))} />
    </>
  );
}
