import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/site/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-3", tone === "dark" ? "text-sun-300" : "text-sun-600")}>
          <span className="bg-sun inline-block h-1.5 w-6 rounded-full" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "text-3xl leading-[1.05] font-extrabold sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-white" : "text-ocean-900",
        )}
      >
        {title}
      </Heading>
      {description && (
        <p className={cn("mt-4 text-lg", tone === "dark" ? "text-white/80" : "text-muted-foreground")}>{description}</p>
      )}
    </Reveal>
  );
}
