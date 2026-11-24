import { cn } from "@/lib/utils";

/** Logo Astral: círculo azul com sol laranja/amarelo nascendo da água. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("size-10 shrink-0", className)}>
      <defs>
        <linearGradient id="astral-sun" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC93C" />
          <stop offset="1" stopColor="#FF8A00" />
        </linearGradient>
        <linearGradient id="astral-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E88E5" />
          <stop offset="1" stopColor="#0A3D62" />
        </linearGradient>
        <clipPath id="astral-clip">
          <circle cx="24" cy="24" r="22" />
        </clipPath>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#astral-sea)" />
      <g clipPath="url(#astral-clip)">
        <circle cx="24" cy="25" r="10" fill="url(#astral-sun)" />
        <g stroke="#FFC93C" strokeWidth="2.2" strokeLinecap="round">
          <path d="M24 8.5v3.5M11.5 13.5l2.5 2.5M36.5 13.5 34 16M7 25h3.5M37.5 25H41" />
        </g>
        <path d="M0 29c5 0 7-3 12-3s7 3 12 3 7-3 12-3 7 3 12 3v19H0z" fill="#0A3D62" />
        <path d="M0 33c5 0 7-2.5 12-2.5s7 2.5 12 2.5 7-2.5 12-2.5 7 2.5 12 2.5" stroke="#22D3EE" strokeWidth="1.6" fill="none" />
        <path d="M0 38c5 0 7-2.5 12-2.5s7 2.5 12 2.5 7-2.5 12-2.5 7 2.5 12 2.5" stroke="#1E88E5" strokeWidth="1.4" fill="none" opacity=".8" />
      </g>
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("font-heading text-[1.6rem] font-extrabold tracking-tight", inverted ? "text-white" : "text-ocean-900")}>
          Astral
        </span>
        <span className={cn("mt-0.5 text-[0.62rem] font-bold tracking-[0.2em] uppercase", inverted ? "text-sun-300" : "text-sun-600")}>
          Solar · Piscinas · Lazer
        </span>
      </span>
    </span>
  );
}
