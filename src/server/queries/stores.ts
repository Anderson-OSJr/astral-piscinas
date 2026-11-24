import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { parseOpeningHours, type OpeningHours } from "@/lib/hours";

export type StoreDTO = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  address: string;
  neighborhood: string;
  city: string;
  cep: string | null;
  fullAddress: string;
  phone: string;
  whatsapp: string;
  email: string;
  lat: number;
  lng: number;
  mapsUrl: string | null;
  openingHours: OpeningHours;
  hoursNote: string | null;
  image: string | null;
  isMain: boolean;
};

type StoreRow = Awaited<ReturnType<typeof db.store.findMany>>[number];

function toDTO(s: StoreRow): StoreDTO {
  return {
    ...s,
    shortName: s.name.split("—").at(-1)?.trim() ?? s.name,
    fullAddress: `${s.address} – ${s.neighborhood}, ${s.city} – SP${s.cep ? `, ${s.cep}` : ""}`,
    openingHours: parseOpeningHours(s.openingHours),
  };
}

export const getStores = cache(async () => {
  const rows = await db.store.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return rows.map(toDTO);
});

export const getStoreBySlug = cache(async (slug: string) => {
  const row = await db.store.findUnique({ where: { slug } });
  return row ? toDTO(row) : null;
});

/** Opções de loja para formulários de lead (client components). */
export const getLeadStoreOptions = cache(async () => {
  const stores = await getStores();
  return stores.map((s) => ({ id: s.id, shortName: s.shortName, city: s.city, whatsapp: s.whatsapp }));
});
