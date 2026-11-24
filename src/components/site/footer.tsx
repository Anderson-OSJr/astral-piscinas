import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/site/brand-icons";
import { Logo } from "@/components/site/logo";
import { Wave } from "@/components/site/decor";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";
import { BRAND, MAIN_NAV, SOLUTIONS } from "@/lib/site";
import { formatPhone, telHref } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import type { StoreDTO } from "@/server/queries/stores";
import type { SocialSettings } from "@/lib/settings-schema";

export function Footer({ stores, social }: { stores: StoreDTO[]; social: SocialSettings }) {
  return (
    <footer className="relative mt-auto text-white">
      <Wave fill="var(--color-ocean-950)" className="-mb-px" />
      <div className="bg-ocean-950 pb-28 md:pb-12">
        <div className="container-page grid gap-12 pt-6 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Link href="/" className="inline-block rounded-xl">
              <Logo inverted />
            </Link>
            <p className="mt-5 max-w-sm text-white/75">{BRAND.positioning}</p>
            <p className="mt-4 text-sm text-white/60">
              Desde {BRAND.foundedYear} em Araraquara · 4 lojas em Araraquara e São Carlos
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram ${social.instagramHandle}`}
                className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-sun-500 hover:text-ink"
              >
                <InstagramIcon className="size-5" />
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook /maisastral"
                className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-sun-500 hover:text-ink"
              >
                <FacebookIcon className="size-5" />
              </a>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-white/75">
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-sun-300" aria-hidden="true" />
                <a href={`mailto:${BRAND.emails.araraquara}`} className="hover:text-white">
                  {BRAND.emails.araraquara}
                </a>
                <span className="text-white/50">(Araraquara)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-sun-300" aria-hidden="true" />
                <a href={`mailto:${BRAND.emails.saoCarlos}`} className="hover:text-white">
                  {BRAND.emails.saoCarlos}
                </a>
                <span className="text-white/50">(São Carlos)</span>
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_0.8fr]">
            <div>
              <h2 className="eyebrow mb-4 text-sun-300">Nossas lojas</h2>
              <ul className="grid gap-5">
                {stores.map((s) => (
                  <li key={s.id} className="text-sm">
                    <Link href={`/lojas/${s.slug}`} className="font-semibold text-white hover:text-sun-300">
                      {s.name}
                    </Link>
                    <p className="mt-1 flex gap-1.5 text-white/70">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      {s.fullAddress}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                      <a href={telHref(s.phone)} className="inline-flex items-center gap-1.5 text-white/85 hover:text-white">
                        <Phone className="size-3.5" aria-hidden="true" />
                        {s.phone}
                      </a>
                      <a
                        href={whatsappLink(s.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-white/85 hover:text-white"
                        aria-label={`WhatsApp da ${s.name}: ${formatPhone(s.whatsapp)}`}
                      >
                        <WhatsappIcon className="size-3.5" />
                        {formatPhone(s.whatsapp)}
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-4 text-sun-300">Soluções</h2>
              <ul className="grid gap-2 text-sm">
                {SOLUTIONS.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="text-white/80 hover:text-white">
                      {s.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/produtos" className="text-white/80 hover:text-white">
                    Catálogo completo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-4 text-sun-300">Astral</h2>
              <ul className="grid gap-2 text-sm">
                {MAIN_NAV.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="text-white/80 hover:text-white">
                      {s.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/orcamento" className="text-white/80 hover:text-white">
                    Orçamento
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-privacidade" className="text-white/80 hover:text-white">
                    Política de privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container-page mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.searchName}. CNPJ {BRAND.cnpj}.
          </p>
          <p>
            Desenvolvido por <span className="font-semibold text-white/80">Prova 61</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
