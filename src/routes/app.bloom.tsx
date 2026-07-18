import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ComingSoon } from "@/components/hv/ComingSoon";
import { AnimatedCounter } from "@/components/hv/AnimatedCounter";
import { makeHistory } from "@/lib/hv-data";
import { useHydroData } from "@/lib/firebase";
import { Radar } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/app/bloom")({ component: BloomPage });

function BloomPage() {
  const { prediction } = useHydroData();
  const timeline = makeHistory(24).map((d, i) => ({
    ...d,
    bloom: 15 + Math.sin(i / 3) * 8 + (Math.random() - 0.5) * 3,
  }));

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Predictive"
        title="Harmful Algal Bloom"
        description="Dedicated bloom forecasting module."
        right={<StatusPill tone="warn">Watch · Bellandur</StatusPill>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard>
          <div className="flex items-center gap-2 text-warning">
            <Radar className="h-4 w-4" />{" "}
            <span className="text-xs uppercase tracking-wider">AI Prediction</span>
          </div>
          <div className="mt-3 font-display text-5xl font-semibold text-warning">
            <AnimatedCounter value={prediction.algal_bloom_probability} suffix="%" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Probability · next 72h</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider">
            <div className="rounded-lg border border-emerald/25 bg-emerald/10 p-2 text-center text-emerald">
              Low
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center text-muted-foreground">
              Med
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center text-muted-foreground">
              High
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.05}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Recommendation</div>
          <p className="mt-3 text-sm text-foreground/90">
            Continue routine sampling. Increase monitoring cadence near industrial inlets. Prepare
            aeration units in the event of elevated chlorophyll signature.
          </p>
        </GlassCard>

        <GlassCard delay={0.1}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Contributing factors</div>
          <div className="mt-3 flex flex-col gap-2">
            {[
              { k: "Temperature", v: 62 },
              { k: "Turbidity", v: 48 },
              { k: "Nutrients (future)", v: 30 },
              { k: "Weather (future)", v: 24 },
              { k: "Satellite Chlorophyll (future)", v: 18 },
            ].map((f) => (
              <div key={f.k}>
                <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>{f.k}</span>
                  <span>{f.v}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-[image:var(--gradient-primary)]"
                    style={{ width: `${f.v}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0" delay={0.05}>
        <div className="px-5 pt-5">
          <div className="text-xs uppercase tracking-wider text-cyan/80">Risk timeline · 24h</div>
          <div className="mt-1 font-display text-lg font-semibold">Bloom probability trend</div>
        </div>
        <div className="px-2 pb-4 pt-2" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 20, right: 30, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="bloomArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis
                dataKey="label"
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
              <Area
                type="monotone"
                dataKey="bloom"
                stroke="var(--color-warning)"
                strokeWidth={2.5}
                fill="url(#bloomArea)"
                isAnimationActive
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <ComingSoon
        tag="Ready for AI Model"
        title="Bloom dataset integration"
        description="Attach curated bloom datasets (NOAA / CyAN) to sharpen model precision across watersheds."
      />
    </div>
  );
}
