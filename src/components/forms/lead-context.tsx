"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const UTM_KEY = "astral:utm";
const LANDING_KEY = "astral:landing";
const THANKS_KEY = "astral:thanks";
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

function safeSession() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/** Guarda UTMs e a página de entrada na sessão (montado uma vez no layout). */
export function UtmCapture() {
  const params = useSearchParams();
  const pathname = usePathname();
  useEffect(() => {
    const s = safeSession();
    if (!s) return;
    const utm: Record<string, string> = {};
    for (const key of UTM_PARAMS) {
      const v = params.get(key);
      if (v) utm[key] = v.slice(0, 200);
    }
    if (Object.keys(utm).length) s.setItem(UTM_KEY, JSON.stringify(utm));
    if (!s.getItem(LANDING_KEY)) s.setItem(LANDING_KEY, pathname);
  }, [params, pathname]);
  return null;
}

export function getLeadContext(sourcePage: string) {
  const s = safeSession();
  let utm: Record<string, string> | undefined;
  try {
    const raw = s?.getItem(UTM_KEY);
    utm = raw ? (JSON.parse(raw) as Record<string, string>) : undefined;
  } catch {
    utm = undefined;
  }
  const landing = s?.getItem(LANDING_KEY);
  if (landing) utm = { ...(utm ?? {}), landing_page: landing };
  return { sourcePage, utm };
}

export type ThanksData = { name: string; storeName?: string; whatsapp?: string; message: string };

export function saveThanks(data: ThanksData) {
  safeSession()?.setItem(THANKS_KEY, JSON.stringify(data));
}

export function readThanks(): ThanksData | null {
  try {
    const raw = safeSession()?.getItem(THANKS_KEY);
    return raw ? (JSON.parse(raw) as ThanksData) : null;
  } catch {
    return null;
  }
}
