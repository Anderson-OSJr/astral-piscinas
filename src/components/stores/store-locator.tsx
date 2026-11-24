"use client";

import { useMemo, useState } from "react";
import { LocateFixed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreCard, type StoreCardData } from "@/components/stores/store-card";
import { MapFacade } from "@/components/stores/map-facade";
import { formatKm, haversineKm } from "@/lib/geo";

type LocatorStore = StoreCardData & { id: string; lat: number; lng: number; city: string; neighborhood: string; shortName: string };

type Status = "idle" | "locating" | "denied" | "error" | "located";

/** "Qual loja fica mais perto de mim?" — geolocalização (só com permissão) ou escolha manual. */
export function StoreLocator({ stores, showMap = true }: { stores: LocatorStore[]; showMap?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [manual, setManual] = useState<string>("");

  const distances = useMemo(() => {
    if (!position) return null;
    return new Map(stores.map((s) => [s.slug, haversineKm(position, s)]));
  }, [position, stores]);

  const nearestSlug = useMemo(() => {
    if (manual) return manual;
    if (!distances) return null;
    return [...distances.entries()].sort((a, b) => a[1] - b[1])[0]?.[0] ?? null;
  }, [distances, manual]);

  const sorted = useMemo(() => {
    if (!distances) return stores;
    return [...stores].sort((a, b) => (distances.get(a.slug) ?? 0) - (distances.get(b.slug) ?? 0));
  }, [stores, distances]);

  const selected = stores.find((s) => s.slug === nearestSlug) ?? stores[0];

  function locate() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    setStatus("locating");
    setManual("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("located");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-3xl border bg-white p-4 sm:flex-row sm:items-center sm:p-5">
        <Button type="button" variant="ocean" size="xl" onClick={locate} disabled={status === "locating"}>
          {status === "locating" ? <Loader2 className="animate-spin" aria-hidden="true" /> : <LocateFixed aria-hidden="true" />}
          Usar minha localização
        </Button>
        <span className="text-center text-sm text-muted-foreground sm:text-left">ou escolha:</span>
        <label className="sr-only" htmlFor="store-manual">
          Escolher bairro ou cidade
        </label>
        <select
          id="store-manual"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          className="h-12 flex-1 rounded-full border bg-background px-4 text-base font-medium focus-visible:ring-2 focus-visible:ring-ocean-500"
        >
          <option value="">Bairro ou cidade…</option>
          {stores.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.neighborhood} — {s.city}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {status === "denied" && "Sem permissão de localização — tudo bem! Escolha o bairro ou a cidade acima."}
        {status === "error" && "Não conseguimos sua localização agora. Escolha o bairro ou a cidade acima."}
        {status === "located" && selected && !manual && `A loja mais perto de você é a ${selected.name}.`}
      </p>

      <div className={showMap ? "mt-4 grid gap-6 lg:grid-cols-[1.2fr_1fr]" : "mt-4"}>
        <ul className={showMap ? "grid gap-4 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
          {sorted.map((s) => (
            <li key={s.slug}>
              <StoreCard
                store={s}
                highlight={s.slug === nearestSlug}
                distance={distances?.has(s.slug) ? formatKm(distances.get(s.slug)!) : undefined}
              />
            </li>
          ))}
        </ul>
        {showMap && selected && (
          <div className="lg:sticky lg:top-28 lg:self-start">
            <MapFacade key={selected.slug} address={`${selected.fullAddress}`} title={selected.name} className="h-80 lg:h-[34rem]" />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Mostrando: <strong className="text-ink">{selected.name}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
