import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

// Blur genérico em tons de areia/azul — evita "buraco branco" enquanto a foto carrega.
const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjY2ZlOWY3Ii8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmNlYmQwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEwIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+";

type SmartImageProps = Omit<ImageProps, "placeholder" | "blurDataURL"> & { alt: string };

/** next/image com placeholder de blur e qualidade padrão da marca. */
/** Hosts otimizados pelo next/image (ver images.remotePatterns no next.config). */
const OPTIMIZED_HOSTS = ["images.unsplash.com"];

export function SmartImage({ className, alt, quality = 75, sizes = "100vw", unoptimized, ...props }: SmartImageProps) {
  // Links externos colados no admin (fora da lista) são exibidos sem otimização em vez de quebrar a página
  const external =
    typeof props.src === "string" && /^https?:\/\//.test(props.src) && !OPTIMIZED_HOSTS.some((h) => (props.src as string).includes(h));
  return (
    <Image
      unoptimized={unoptimized ?? external}
      // Imagens prioritárias (LCP) não usam blur: pintam direto, sem custo extra
      placeholder={props.priority ? "empty" : "blur"}
      blurDataURL={props.priority ? undefined : BLUR}
      quality={quality}
      sizes={sizes}
      alt={alt}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
