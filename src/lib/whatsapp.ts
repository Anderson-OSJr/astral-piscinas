/** Mantém só os dígitos e garante o DDI 55. */
export function normalizeWhatsapp(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

export function whatsappLink(number: string, message?: string) {
  const base = `https://wa.me/${normalizeWhatsapp(number)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const WHATSAPP_SUBJECTS = [
  { id: "orcamento", label: "Orçamento", intro: "Gostaria de um orçamento" },
  { id: "pecas", label: "Peças e produtos químicos", intro: "Quero informações sobre peças / produtos químicos" },
  { id: "assistencia", label: "Assistência técnica", intro: "Preciso de assistência técnica" },
] as const;

export type WhatsappSubjectId = (typeof WHATSAPP_SUBJECTS)[number]["id"];

export function buildWhatsappMessage(opts: {
  subject: WhatsappSubjectId;
  storeName?: string;
  pageTitle?: string;
  pageUrl?: string;
}) {
  const subject = WHATSAPP_SUBJECTS.find((s) => s.id === opts.subject) ?? WHATSAPP_SUBJECTS[0];
  const lines = [`Olá, Astral${opts.storeName ? ` (${opts.storeName})` : ""}! ${subject.intro}.`];
  if (opts.pageTitle || opts.pageUrl) {
    lines.push(`Vim pelo site, página: ${[opts.pageTitle, opts.pageUrl].filter(Boolean).join(" — ")}`);
  }
  return lines.join("\n");
}

/** Resumo de lead em texto para continuar no WhatsApp. */
export function leadSummaryMessage(opts: {
  name: string;
  interestLabel: string;
  details?: Record<string, string | number | boolean | undefined>;
  message?: string;
}) {
  const lines = [`Olá, Astral! Sou ${opts.name} e acabei de pedir um orçamento pelo site.`, `Assunto: ${opts.interestLabel}`];
  if (opts.details) {
    for (const [k, v] of Object.entries(opts.details)) {
      if (v === undefined || v === "" || v === false) continue;
      lines.push(`• ${k}: ${v === true ? "sim" : v}`);
    }
  }
  if (opts.message) lines.push(`Mensagem: ${opts.message}`);
  return lines.join("\n");
}
