import { z } from "zod";

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, { short: string; long: string; schema: string }> = {
  mon: { short: "Seg", long: "Segunda", schema: "Monday" },
  tue: { short: "Ter", long: "Terça", schema: "Tuesday" },
  wed: { short: "Qua", long: "Quarta", schema: "Wednesday" },
  thu: { short: "Qui", long: "Quinta", schema: "Thursday" },
  fri: { short: "Sex", long: "Sexta", schema: "Friday" },
  sat: { short: "Sáb", long: "Sábado", schema: "Saturday" },
  sun: { short: "Dom", long: "Domingo", schema: "Sunday" },
};

const time = z.string().regex(/^\d{2}:\d{2}$/, "Use o formato 08:00");

export const openingHoursSchema = z.array(
  z.object({
    days: z.array(z.enum(DAY_KEYS)).min(1, "Escolha pelo menos um dia"),
    opens: time,
    closes: time,
  }),
);
export type OpeningHours = z.infer<typeof openingHoursSchema>;

export function parseOpeningHours(value: unknown): OpeningHours {
  const parsed = openingHoursSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

function formatDays(days: DayKey[]) {
  const idx = days.map((d) => DAY_KEYS.indexOf(d)).sort((a, b) => a - b);
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (contiguous && idx.length > 2) return `${DAY_LABELS[DAY_KEYS[idx[0]]].short} a ${DAY_LABELS[DAY_KEYS[idx.at(-1)!]].short}`;
  return idx.map((i) => DAY_LABELS[DAY_KEYS[i]].short).join(", ");
}

export function formatOpeningHours(hours: OpeningHours) {
  return hours.map((h) => ({ days: formatDays(h.days), time: `${h.opens.replace(":00", "h")} às ${h.closes.replace(":00", "h")}` }));
}

export function openingHoursJsonLd(hours: OpeningHours) {
  return hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days.map((d) => `https://schema.org/${DAY_LABELS[d].schema}`),
    opens: h.opens,
    closes: h.closes,
  }));
}
