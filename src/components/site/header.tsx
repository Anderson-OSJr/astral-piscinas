import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { DynamicIcon } from "@/components/site/icon";
import { MobileNav } from "@/components/site/mobile-nav";
import { HeaderShell } from "@/components/site/header-shell";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MAIN_NAV, SOLUTIONS } from "@/lib/site";
import { IMG } from "@/lib/images";
import { SmartImage } from "@/components/site/smart-image";

type HeaderCategory = { slug: string; name: string; section: string | null };

export function Header({ categories }: { categories: HeaderCategory[] }) {
  return (
    <HeaderShell>
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link href="/" className="rounded-xl">
          <Logo />
        </Link>

        <NavigationMenu className="hidden lg:flex" viewport={false}>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-[0.95rem] font-semibold text-ink">
                Produtos e soluções
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-0 !w-[min(64rem,calc(100vw-4rem))] !rounded-3xl !p-0">
                <div className="grid grid-cols-[1.1fr_1fr_0.8fr]">
                  <ul className="grid gap-1 p-4">
                    {SOLUTIONS.map((s) => (
                      <li key={s.href}>
                        <NavigationMenuLink asChild>
                          <Link href={s.href} className="flex-row items-start gap-3 rounded-2xl p-3 hover:bg-sand">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ocean-900 text-sun-300">
                              <DynamicIcon icon={s.icon} className="size-5" />
                            </span>
                            <span>
                              <span className="block font-semibold text-ink">{s.label}</span>
                              <span className="block text-sm text-muted-foreground">{s.description}</span>
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                  <div className="border-l bg-sand/60 p-5">
                    <p className="eyebrow mb-3 text-sun-600">Catálogo</p>
                    <ul className="grid gap-0.5">
                      {categories.map((c) => (
                        <li key={c.slug}>
                          <NavigationMenuLink asChild>
                            <Link href={`/produtos?categoria=${c.slug}`} className="rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-white">
                              {c.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                    <NavigationMenuLink asChild>
                      <Link href="/produtos" className="mt-3 flex-row items-center gap-1 px-2 text-sm font-bold text-ocean-700">
                        Ver catálogo completo <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <div className="relative overflow-hidden rounded-r-3xl">
                    <SmartImage src={IMG.poolPalms} alt="" fill sizes="20rem" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/90 via-ocean-950/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <p className="font-heading text-xl leading-tight font-bold">Monte sua piscina em 4 passos</p>
                      <NavigationMenuLink asChild>
                        <Link href="/piscinas#monte-sua-piscina" className="mt-3 inline-flex flex-row items-center gap-1 p-0 text-sm font-bold text-sun-300 hover:bg-transparent">
                          Começar agora <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {MAIN_NAV.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink asChild>
                  <Link href={item.href} className="rounded-lg px-3 py-2 text-[0.95rem] font-semibold text-ink hover:bg-sand">
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button asChild variant="sun" size="lg" className="hidden rounded-full px-5 sm:inline-flex">
            <Link href="/orcamento">Fazer orçamento</Link>
          </Button>
          <MobileNav categories={categories} />
        </div>
      </div>
    </HeaderShell>
  );
}
