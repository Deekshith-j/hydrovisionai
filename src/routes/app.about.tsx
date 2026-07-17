import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { Waves } from "lucide-react";

export const Route = createFileRoute("/app/about")({ component: About });

function About() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Platform" title="About HydroVision AI" description="Environmental intelligence for tomorrow's water." right={<StatusPill tone="info">v1.0</StatusPill>} />

      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)]"><Waves className="h-6 w-6 text-primary-foreground" /></div>
          <div>
            <div className="font-display text-2xl font-semibold">HydroVision AI</div>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              HydroVision AI is a government-grade environmental monitoring platform that fuses
              IoT sensing, machine learning, and geospatial intelligence to protect water bodies
              and the communities that depend on them.
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Stack</div>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-foreground/90">
            <li>React 19 · TypeScript · Vite</li>
            <li>Tailwind CSS v4 · shadcn/ui</li>
            <li>Firebase Realtime Database</li>
            <li>Leaflet · Recharts · Framer Motion</li>
          </ul>
        </GlassCard>
        <GlassCard delay={0.05}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Principles</div>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-foreground/90">
            <li>Realtime by default</li>
            <li>AI-augmented decision making</li>
            <li>Predictable, minimal, professional</li>
            <li>Ready for national-scale deployment</li>
          </ul>
        </GlassCard>
        <GlassCard delay={0.1}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Contact</div>
          <div className="mt-2 text-sm text-foreground/90">team@hydrovision.ai</div>
          <div className="mt-1 text-xs text-muted-foreground">Environmental Intelligence Program</div>
        </GlassCard>
      </div>
    </div>
  );
}
