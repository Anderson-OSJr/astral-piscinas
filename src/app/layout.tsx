import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { LazyToaster } from "@/components/site/lazy-toaster";
import { SITE_URL } from "@/lib/site-url";
import { BRAND } from "@/lib/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.searchName} | Araraquara e São Carlos`,
    template: `%s | Astral`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  openGraph: { type: "website", locale: "pt_BR", siteName: BRAND.searchName },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0a3d62",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">
        {children}
        <LazyToaster />
      </body>
    </html>
  );
}
