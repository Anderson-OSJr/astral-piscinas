import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForms } from "@/components/admin/settings-forms";
import { getSetting } from "@/server/queries/settings";

export const metadata: Metadata = { title: "Configurações" };

export default async function SettingsPage() {
  const [hero, calculators, social, google, instagramGrid] = await Promise.all([
    getSetting("hero"),
    getSetting("calculators"),
    getSetting("social"),
    getSetting("google"),
    getSetting("instagramGrid"),
  ]);
  return (
    <>
      <PageHeader title="Configurações do site" description="Textos da página inicial, parâmetros das calculadoras, redes sociais e nota do Google." />
      <SettingsForms values={{ hero, calculators, social, google, instagramGrid }} />
    </>
  );
}
