import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Parallax leve via CSS scroll-driven animation (classe .parallax no globals.css) — sem JavaScript. */
export function ParallaxLayer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("parallax", className)}>{children}</div>;
}
