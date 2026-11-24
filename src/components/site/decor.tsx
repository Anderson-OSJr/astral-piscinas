import { cn } from "@/lib/utils";

/** Onda orgânica para separar seções. `fill` é a cor da seção seguinte. */
export function Wave({
  className,
  fill = "var(--color-background)",
  flip = false,
  variant = 1,
}: {
  className?: string;
  fill?: string;
  flip?: boolean;
  variant?: 1 | 2;
}) {
  const d =
    variant === 1
      ? "M0 48c120 30 240 40 360 26S600 10 720 12s240 44 360 50 240-16 360-34v62H0z"
      : "M0 70c160-50 300-60 460-30s300 50 480 26 340-60 500-40v64H0z";
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("pointer-events-none block h-12 w-full sm:h-20", flip && "rotate-180", className)}
    >
      <path d={d} fill={fill} />
    </svg>
  );
}

// Textura de cáusticas: linhas orgânicas de luz desenhadas uma vez (sem filtros caros),
// repetidas como fundo e movidas só com transform (camada na GPU).
const CAUSTICS_TILE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><g fill="none" stroke="#cff7fd" stroke-width="2.2" stroke-linecap="round" opacity=".9"><path d="M10 40c30-25 60 15 90-5s50-30 80 0 40 20 60 5"/><path d="M-10 110c25-20 55 10 85-8s45-28 75-2 45 22 90 0"/><path d="M5 180c35-22 58 12 92-6s48-26 78 4 40 18 70 2"/><path d="M60 0c-12 30 18 50 4 80s-22 52 6 82 10 50-4 78"/><path d="M170 0c14 28-16 52-2 82s24 50-4 80-12 48 6 78"/></g></svg>`,
  );

/** Reflexos de luz na água (cáusticas) — CSS puro, leve. */
export function Caustics({ className, opacity = 0.35 }: { className?: string; opacity?: number }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} style={{ opacity }}>
      <div
        className="animate-caustics absolute -inset-[15%] will-change-transform"
        style={{ backgroundImage: `url("${CAUSTICS_TILE}")`, backgroundSize: "240px 240px", filter: "blur(1.5px)" }}
      />
    </div>
  );
}

/** Raios de sol girando lentamente. */
export function SunRays({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={cn("animate-sun-spin pointer-events-none will-change-transform", className)}>
      <defs>
        <radialGradient id="ray-fade">
          <stop offset="0.25" stopColor="#FFC93C" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FF8A00" stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d="M100 100 L96 0 L104 0 Z" fill="url(#ray-fade)" transform={`rotate(${i * 22.5} 100 100)`} />
      ))}
      <circle cx="100" cy="100" r="26" fill="#FFC93C" opacity="0.85" />
    </svg>
  );
}
