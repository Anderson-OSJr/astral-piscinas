import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Astral Energia Solar e Piscinas",
    short_name: "Astral",
    description: "Aquecimento solar, energia fotovoltaica e piscinas em Araraquara e São Carlos.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#0a3d62",
    lang: "pt-BR",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
