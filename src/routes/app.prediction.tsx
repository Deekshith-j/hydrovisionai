import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ComingSoon } from "@/components/hv/ComingSoon";
import { AnimatedCounter } from "@/components/hv/AnimatedCounter";
import { makeHistory } from "@/lib/hv-data";
import { useHydroData } from "@/lib/firebase";
import { Brain, Camera, Cpu, Satellite, Sparkles, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/app/prediction")({ component: PredictionPage });

function PredictionPage() {
  const { prediction } = useHydroData();
  const timeline = [
    { label: "Now", value: 88 },
    { label: "24h", value: prediction.future_prediction_24h },
    { label: "48h", value: prediction.future_prediction_48h },
    { label: "72h", value: prediction.future_prediction_72h },
    ...makeHistory(4).map((h, i) => ({ label: `${96 + i * 24}h`, value: 75 + Math.sin(i) * 4 })),
  ];


  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Intelligence" title="AI Prediction" description="Multi-horizon forecasts across quality, risk and bloom probability." right={<StatusPill tone="good">Model · online</StatusPill>} />

      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan/80">Current water quality</div>
            <div className="mt-2 font-display text-4xl font-semibold text-emerald">GOOD</div>
            <div className="mt-1 text-xs text-muted-foreground">Composite verdict from ensemble model.</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan/80">Risk level</div>
            <div className="mt-2 font-display text-4xl font-semibold text-cyan">{prediction.risk}</div>
            <div className="mt-1 text-xs text-muted-foreground">Next 24 hours forecast.</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan/80">Confidence</div>
            <div className="mt-2 font-display text-4xl font-semibold text-cyan"><AnimatedCounter value={prediction.confidence} suffix="%" /></div>
            <div className="mt-1 text-xs text-muted-foreground">Random Forest + XGBoost ensemble.</div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-0" delay={0.05}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan/80">Prediction timeline</div>
            <div className="mt-1 font-display text-lg font-semibold">Forecast horizon · WQI</div>
          </div>
          <div className="flex gap-2">
            {["Now", "24h", "48h", "72h"].map((h) => <StatusPill key={h} tone="info">{h}</StatusPill>)}
          </div>
        </div>
        <div className="px-2 pb-4 pt-2" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeline} margin={{ top: 20, right: 30, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="predArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-cyan)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--color-cyan)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "oklch(0.7 0.03 240)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: "oklch(0.7 0.03 240)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "oklch(0.2 0.04 250)", border: "1px solid oklch(1 0 0 / 0.08)", borderRadius: 12, fontSize: 12 }} labelStyle={{ color: "oklch(0.7 0.03 240)" }} />
              <Area type="monotone" dataKey="value" stroke="var(--color-cyan)" strokeWidth={2.5} fill="url(#predArea)" isAnimationActive animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        <RiskTile title="Possible contamination" value={12} tone="emerald" />
        <RiskTile title="Algal bloom risk" value={prediction.algal_bloom_probability} tone="warning" />
        <RiskTile title="Fish mortality risk" value={6} tone="emerald" />
      </div>

      <GlassCard delay={0.05}>
        <div className="flex items-center gap-2 text-cyan"><Sparkles className="h-4 w-4" /> <span className="text-xs uppercase tracking-wider">Recommendation engine</span></div>
        <ul className="mt-3 grid gap-2 text-sm text-foreground/90 md:grid-cols-2">
          {[
            "Safe for drinking with continued monitoring.",
            "Monitor TDS on 4-hour cadence.",
            "Watch for elevated turbidity after rainfall.",
            "Inspect nearby industrial discharge points.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <Zap className="mt-0.5 h-4 w-4 text-cyan" /> {t}
            </li>
          ))}
        </ul>
      </GlassCard>

      <div>
        <div className="mb-3 text-xs uppercase tracking-[0.25em] text-cyan/80">Future AI features</div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ComingSoon tag="Ready for AI Model" title="Random Forest" description="Tabular classifier for water safety verdicts, tuned against public datasets." />
          <ComingSoon tag="Ready for AI Model" title="XGBoost" description="Gradient-boosted risk scoring across pH, TDS, NTU and temperature." />
          <ComingSoon tag="Ready for AI Model" title="LSTM Forecasts" description="Sequence model for 24/48/72h horizon quality predictions." />
          <ComingSoon tag="Coming Soon" title="Satellite Intelligence" description="Chlorophyll-a retrievals from Sentinel-2 and MODIS pipelines." />
          <ComingSoon tag="Waiting for Device Integration" title="Computer Vision" description="ESP32-CAM feed for surface scum, foam and debris detection." />
          <ComingSoon tag="Ready for AI Model" title="TinyML On-Device" description="Quantized model inference at the edge for offline anomaly alerts." />
        </div>
      </div>
    </div>
  );
}

function RiskTile({ title, value, tone }: { title: string; value: number; tone: "emerald" | "warning" | "danger" }) {
  const color = tone === "emerald" ? "var(--color-emerald)" : tone === "warning" ? "var(--color-warning)" : "var(--color-danger)";
  return (
    <GlassCard>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-2 font-display text-4xl font-semibold" style={{ color }}><AnimatedCounter value={value} suffix="%" /></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </GlassCard>
  );
}
