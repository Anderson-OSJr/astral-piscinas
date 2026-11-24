import type { Metadata } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";
import { BRAND } from "@/lib/site";
import { openingHoursJsonLd } from "@/lib/hours";
import type { StoreDTO } from "@/server/queries/stores";

/** Metadata padrão de página: título "X | Astral", canonical e OG. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  absoluteTitle?: boolean;
  type?: "website" | "article";
}): Metadata {
  const ogTitle = title.replace(/\s*\|\s*Astral.*$/, "");
  const ogCard = `/api/og?${new URLSearchParams({ title: ogTitle })}`;
  const images = [{ url: ogCard, width: 1200, height: 630, alt: ogTitle }, ...(image ? [{ url: image }] : [])];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type,
      locale: "pt_BR",
      siteName: BRAND.searchName,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: [ogCard] },
  };
}

export function organizationJsonLd(social: { instagram: string; facebook: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BRAND.searchName,
    alternateName: "Mais Astral",
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
    foundingDate: String(BRAND.foundedYear),
    founder: { "@type": "Person", name: "João Luiz Ambrósio" },
    email: BRAND.emails.araraquara,
    sameAs: [social.instagram, social.facebook],
  };
}

export function storeJsonLd(store: StoreDTO, rating?: { rating: number; total: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": absoluteUrl(`/lojas/${store.slug}#loja`),
    name: `${BRAND.searchName} — ${store.shortName}`,
    url: absoluteUrl(`/lojas/${store.slug}`),
    image: store.image ?? undefined,
    telephone: `+55 ${store.phone}`,
    email: store.email,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.city,
      addressRegion: "SP",
      postalCode: store.cep ?? undefined,
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: store.lat, longitude: store.lng },
    openingHoursSpecification: openingHoursJsonLd(store.openingHours),
    areaServed: [store.city, "Região central de São Paulo"],
    ...(store.isMain && rating
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.rating, reviewCount: rating.total } }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
