import type { Metadata } from "next";
import { ThanksContent } from "@/components/forms/thanks-content";
import { getSetting } from "@/server/queries/settings";

export const metadata: Metadata = {
  title: "Recebemos o seu pedido",
  robots: { index: false, follow: false },
};

export default async function ThanksPage() {
  const social = await getSetting("social");
  return <ThanksContent instagram={social.instagram} facebook={social.facebook} handle={social.instagramHandle} />;
}
