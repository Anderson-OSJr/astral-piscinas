import {
  Armchair,
  Bath,
  CloudFog,
  Cpu,
  Droplets,
  Flame,
  FlaskConical,
  Gauge,
  Layers,
  Plug,
  ShowerHead,
  Sparkles,
  Sun,
  Thermometer,
  Truck,
  Waves,
  Wrench,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/** Ícones disponíveis para categorias/serviços (nome salvo no banco). */
export const ICONS: Record<string, LucideIcon> = {
  Armchair,
  Bath,
  CloudFog,
  Cpu,
  Droplets,
  Flame,
  FlaskConical,
  Gauge,
  Layers,
  Plug,
  ShowerHead,
  Sparkles,
  Sun,
  Thermometer,
  Truck,
  Waves,
  Wrench,
  Zap,
};

export const ICON_NAMES = Object.keys(ICONS);

export function DynamicIcon({ icon, ...props }: { icon?: string | null } & Omit<LucideProps, "name">) {
  const Icon = (icon && ICONS[icon]) || Sparkles;
  return <Icon aria-hidden="true" {...props} />;
}
