import { Sun, Snowflake, CloudSun, Flame } from "lucide-react";
import { getAraraquaraWeather, WEATHER_MESSAGES, type WeatherMood } from "@/lib/weather";
import { cn } from "@/lib/utils";

const MOOD_ICON: Record<WeatherMood, typeof Sun> = { frio: Snowflake, ameno: CloudSun, quente: Sun, escaldante: Flame };

/** Selo "Agora em Araraquara" com temperatura ao vivo (Open-Meteo, cache 30 min). */
export async function WeatherBadge({ className }: { className?: string }) {
  const weather = await getAraraquaraWeather();

  if (!weather) {
    return (
      <WeatherShell className={className}>
        <Sun className="size-5 text-sun-300" aria-hidden="true" />
        <span>
          <strong className="font-bold">Araraquara, a Morada do Sol</strong> · sol o ano inteiro para trabalhar por você.
        </span>
      </WeatherShell>
    );
  }

  const Icon = MOOD_ICON[weather.mood];
  return (
    <WeatherShell className={className}>
      <span className="relative flex size-2.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aqua-400 opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-aqua-400" />
      </span>
      <Icon className="size-5 text-sun-300" aria-hidden="true" />
      <span>
        <strong className="font-bold tabular-nums">{weather.temperature} °C</strong> agora em Araraquara
        {weather.uv !== null && <span className="text-white/75"> · UV {weather.uv}</span>}
        <span className="text-white/90"> — {WEATHER_MESSAGES[weather.mood]}</span>
      </span>
    </WeatherShell>
  );
}

function WeatherShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function WeatherBadgeSkeleton({ className }: { className?: string }) {
  return (
    <WeatherShell className={className}>
      <Sun className="size-5 animate-pulse text-sun-300" aria-hidden="true" />
      <span className="text-white/80">Consultando o sol de Araraquara…</span>
    </WeatherShell>
  );
}
