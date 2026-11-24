import "server-only";
import { z } from "zod";

const ARARAQUARA = { lat: -21.7845, lng: -48.178 };

const responseSchema = z.object({
  current: z.object({ temperature_2m: z.number(), uv_index: z.number().optional() }),
});

export type Weather = { temperature: number; uv: number | null; mood: WeatherMood };
export type WeatherMood = "frio" | "ameno" | "quente" | "escaldante";

export function weatherMood(t: number): WeatherMood {
  if (t < 18) return "frio";
  if (t < 25) return "ameno";
  if (t < 32) return "quente";
  return "escaldante";
}

export const WEATHER_MESSAGES: Record<WeatherMood, string> = {
  frio: "dia de banho quente com aquecimento solar.",
  ameno: "clima perfeito para aquecer a piscina com o sol.",
  quente: "dia perfeito para piscina.",
  escaldante: "calorão! Hora de mergulhar.",
};

/** Temperatura atual em Araraquara (Open-Meteo, sem chave). Cache de 30 min; null se falhar. */
export async function getAraraquaraWeather(): Promise<Weather | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${ARARAQUARA.lat}&longitude=${ARARAQUARA.lng}&current=temperature_2m,uv_index&timezone=America%2FSao_Paulo`;
  try {
    const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const parsed = responseSchema.safeParse(await res.json());
    if (!parsed.success) return null;
    const temperature = Math.round(parsed.data.current.temperature_2m);
    const uv = parsed.data.current.uv_index;
    return { temperature, uv: uv === undefined ? null : Math.round(uv), mood: weatherMood(temperature) };
  } catch {
    return null;
  }
}
