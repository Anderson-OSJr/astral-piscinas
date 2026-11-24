import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { z } from "zod";

const querySchema = z.object({
  title: z.string().trim().max(110).catch("Na Morada do Sol, o calor trabalha para você."),
  eyebrow: z.string().trim().max(60).catch("Solar · Piscinas · Lazer"),
});

/** Imagem de compartilhamento (WhatsApp, Facebook, Google) gerada com o título de cada página. */
export function GET(request: NextRequest) {
  const { title, eyebrow } = querySchema.parse({
    title: request.nextUrl.searchParams.get("title") ?? undefined,
    eyebrow: request.nextUrl.searchParams.get("eyebrow") ?? undefined,
  });

  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "radial-gradient(120% 120% at 10% 0%, #0f5a8f 0%, #0a3d62 55%, #062a45 100%)",
          color: "white",
          fontFamily: "sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Sol */}
        <div style={{ position: "absolute", top: -170, right: -150, width: 560, height: 560, display: "flex" }}>
          <svg width="560" height="560" viewBox="0 0 200 200">
            {rays.map((deg) => (
              <path key={deg} d="M100 100 L96 0 L104 0 Z" fill="#FFC93C" opacity="0.35" transform={`rotate(${deg} 100 100)`} />
            ))}
            <circle cx="100" cy="100" r="42" fill="#FF8A00" />
            <circle cx="100" cy="100" r="32" fill="#FFC93C" />
          </svg>
        </div>
        {/* Ondas */}
        <svg width="1200" height="180" viewBox="0 0 1200 180" style={{ position: "absolute", bottom: 0, left: 0 }}>
          <path d="M0 80 C200 40 400 120 600 80 S1000 40 1200 90 V180 H0 Z" fill="#1E88E5" opacity="0.55" />
          <path d="M0 120 C220 90 420 160 640 120 S1020 90 1200 130 V180 H0 Z" fill="#22D3EE" opacity="0.45" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                background: "linear-gradient(180deg, #1E88E5, #0A3D62)",
                border: "3px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 999, background: "linear-gradient(135deg, #FFC93C, #FF8A00)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1 }}>Astral</span>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 4, color: "#FFC93C", textTransform: "uppercase" }}>{eyebrow}</span>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: "auto", marginBottom: 90, maxWidth: 900, fontSize: title.length > 60 ? 58 : 70, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ position: "absolute", left: 72, bottom: 40, display: "flex", fontSize: 24, color: "rgba(255,255,255,0.85)" }}>
            Araraquara · São Carlos · desde 1986
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    },
  );
}
