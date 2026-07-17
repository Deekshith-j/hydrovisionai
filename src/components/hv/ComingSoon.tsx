import { Sparkles } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { StatusPill } from "./StatusPill";

export function ComingSoon({
  title,
  description,
  tag = "Coming Soon",
}: {
  title: string;
  description: string;
  tag?: "Coming Soon" | "Waiting for Device Integration" | "Ready for AI Model";
}) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-cyan/20 blur-3xl" />
      <div className="relative">
        <StatusPill tone="info">
          <Sparkles className="h-3 w-3" /> {tag}
        </StatusPill>
        <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </GlassCard>
  );
}
