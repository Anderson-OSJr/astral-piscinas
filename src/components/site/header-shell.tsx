"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Header fixo que ganha sombra ao rolar a página. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent bg-background/85 backdrop-blur-xl transition-shadow duration-300 supports-[backdrop-filter]:bg-background/70",
        scrolled && "border-border/70 shadow-[0_8px_30px_-18px_rgb(10_61_98/0.45)]",
      )}
    >
      {children}
    </header>
  );
}
