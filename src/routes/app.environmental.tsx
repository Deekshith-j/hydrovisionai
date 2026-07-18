import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ComingSoon } from "@/components/hv/ComingSoon";
import { AnimatedCounter } from "@/components/hv/AnimatedCounter";
import { Leaf, Waves, Wind } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/environmental")({ component: Environmental });

const seasonal = [
  { m: "Jan", score: 78 },
  { m: "Feb", score: 76 },
  { m: "Mar", score: 74 },
  { m: "Apr", score: 70 },
  { m: "May", score: 65 },
  { m: "Jun", score: 62 },
  { m: "Jul", score: 60 },
  { m: "Aug", score: 66 },
  { m: "Sep", score: 71 },
  { m: "Oct", score: 78 },
  { m: "Nov", score: 82 },
  { m: "Dec", score: 84 },
];

function Environmental() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Ecology"
        title="Environmental Insights"
        description="Ecosystem-level intelligence across the water body."
        right={<StatusPill tone="good">Ecosystem · healthy</StatusPill>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GlassCard>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Leaf className="h-3.5 w-3.5" /> Lake Health
          </div>
          <div className="mt-2 font-display text-5xl font-semibold text-emerald">
            <AnimatedCounter value={82} />
          </div>
          <div className="text-xs text-muted-foreground">Composite ecological index</div>
        </GlassCard>
        <GlassCard delay={0.05}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Waves className="h-3.5 w-3.5" /> Water Body Health
          </div>
          <div className="mt-2 font-display text-5xl font-semibold text-cyan">
            <AnimatedCounter value={78} />
          </div>
          <div className="text-xs text-muted-foreground">Rolling 30d trend · stable</div>
        </GlassCard>
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Wind className="h-3.5 w-3.5" /> AI Environmental Score
          </div>
          <div className="mt-2 font-display text-5xl font-semibold text-emerald">
            <AnimatedCounter value={87} />
          </div>
          <div className="text-xs text-muted-foreground">Ensemble output · confidence 92%</div>
        </GlassCard>
        <GlassCard delay={0.15}>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Pollution Hotspots
          </div>
          <div className="mt-2 font-display text-5xl font-semibold text-warning">
            <AnimatedCounter value={2} />
          </div>
          <div className="text-xs text-muted-foreground">Bellandur inlet · Varthur outlet</div>
        </GlassCard>
      </div>

      <GlassCard className="p-0" delay={0.05}>
        <div className="px-5 pt-5">
          <div className="text-xs uppercase tracking-wider text-cyan/80">Seasonal trends</div>
          <div className="mt-1 font-display text-lg font-semibold">
            Ecosystem health · yearly composite
          </div>
        </div>
        <div className="px-2 pb-4 pt-2" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonal} margin={{ top: 20, right: 20, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-cyan)" />
                  <stop offset="100%" stopColor="var(--color-emerald)" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis
                dataKey="m"
                tick={{ fill: "oklch(0.7 0.03 240)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.7 0.03 240)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.2 0.04 250)",
                  border: "1px solid oklch(1 0 0 / 0.08)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="score"
                fill="url(#barGrad)"
                radius={[8, 8, 0, 0]}
                isAnimationActive
                animationDuration={900}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard delay={0.05}>
        <div className="text-xs uppercase tracking-wider text-cyan/80">Contamination timeline</div>
        <div className="mt-3 flex flex-col gap-3">
          {[
            { t: "Today", e: "Turbidity dip after morning rainfall", tone: "good" as const },
            {
              t: "Yesterday",
              e: "Minor TDS elevation near industrial zone",
              tone: "warn" as const,
            },
            { t: "3 days ago", e: "Bloom precursor detected · resolved", tone: "warn" as const },
            { t: "1 week ago", e: "Full recovery after monsoon flush", tone: "good" as const },
          ].map((e) => (
            <div
              key={e.t}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
            >
              <StatusPill tone={e.tone}>{e.t}</StatusPill>
              <div className="text-sm text-foreground/85">{e.e}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div>
        <div className="mb-3 text-xs uppercase tracking-[0.25em] text-cyan/80">
          Future satellite integration
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ComingSoon
            tag="Coming Soon"
            title="NASA Landsat"
            description="Long-baseline Landsat imagery for multi-decade water body change detection."
          />
          <ComingSoon
            tag="Coming Soon"
            title="Sentinel-2"
            description="10m multispectral retrievals: chlorophyll-a, turbidity, and surface color."
          />
          <ComingSoon
            tag="Coming Soon"
            title="MODIS"
            description="Daily surface temperature and coarse chlorophyll for national coverage."
          />
          <ComingSoon
            tag="Coming Soon"
            title="Chlorophyll Retrieval"
            description="Physics-based inversion using spectral bands from Sentinel-2 tiles."
          />
          <ComingSoon
            tag="Coming Soon"
            title="Surface Temperature"
            description="Landsat thermal bands calibrated against in-situ probes."
          />
          <ComingSoon
            tag="Coming Soon"
            title="Digital Twin · Lake"
            description="Real-time simulated lake dynamics for scenario planning."
          />
        </div>
      </div>
    </div>
  );
}
