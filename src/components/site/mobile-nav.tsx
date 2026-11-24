"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { DynamicIcon } from "@/components/site/icon";
import { MAIN_NAV, SOLUTIONS } from "@/lib/site";

export function MobileNav({ categories }: { categories: { slug: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Abrir menu">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm overflow-y-auto bg-background p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle asChild>
            <div>
              <Logo />
            </div>
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Menu principal" className="px-3 pb-8">
          <ul className="grid gap-1 py-3">
            {SOLUTIONS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} onClick={close} className="flex items-center gap-3 rounded-2xl p-3 hover:bg-sand">
                  <span className="grid size-10 place-items-center rounded-xl bg-ocean-900 text-sun-300">
                    <DynamicIcon icon={s.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{s.label}</span>
                    <span className="block text-sm text-muted-foreground">{s.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Accordion type="single" collapsible className="border-y px-2">
            <AccordionItem value="catalogo" className="border-0">
              <AccordionTrigger className="text-base font-semibold">Catálogo de produtos</AccordionTrigger>
              <AccordionContent>
                <ul className="grid gap-1">
                  <li>
                    <Link href="/produtos" onClick={close} className="block rounded-lg px-2 py-1.5 font-semibold text-ocean-700">
                      Todos os produtos
                    </Link>
                  </li>
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/produtos?categoria=${c.slug}`} onClick={close} className="block rounded-lg px-2 py-1.5 hover:bg-sand">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <ul className="grid gap-1 py-3">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className="block rounded-xl px-3 py-2.5 text-base font-semibold hover:bg-sand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild variant="sun" size="xl" className="w-full">
            <Link href="/orcamento" onClick={close}>
              Fazer orçamento
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
