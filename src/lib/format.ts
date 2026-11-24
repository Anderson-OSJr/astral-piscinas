export const brl = (value: number, maximumFractionDigits = 0) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits });

export const num = (value: number, maximumFractionDigits = 0) =>
  value.toLocaleString("pt-BR", { maximumFractionDigits });

export function formatPhone(raw: string) {
  const d = raw.replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

export function telHref(raw: string) {
  const d = raw.replace(/\D/g, "");
  return `tel:+${d.startsWith("55") ? d : `55${d}`}`;
}

/** Máscara progressiva de telefone brasileiro para inputs. */
export function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function formatDate(date: Date | string, opts: Intl.DateTimeFormatOptions = { dateStyle: "long" }) {
  return new Date(date).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo", ...opts });
}

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
