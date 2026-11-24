import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade + slide ao entrar na tela, 100% CSS (scroll-driven animations — ver .reveal no globals.css).
 * Zero JavaScript no cliente; navegadores sem suporte simplesmente mostram o conteúdo.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Comp = "div",
}: {
  children: ReactNode;
  /** Atraso relativo (0–0.3) para escalonar itens de uma grade */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  return (
    <Comp
      className={cn("reveal", className)}
      style={delay ? ({ "--reveal-shift": `${Math.round(delay * 60)}%` } as CSSProperties) : undefined}
    >
      {children}
    </Comp>
  );
}
