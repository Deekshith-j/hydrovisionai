import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { Sparkline } from "@/components/hv/Sparkline";
import { AnimatedCounter } from "@/components/hv/AnimatedCounter";
import { useHydroData } from "@/lib/firebase";
import { useHistory } from "@/hooks/useHistory";
import {
  Activity,
  Droplets,
  Gauge,
  Shield,
  Sparkles,
  ThermometerSun,
  Waves,
  Calendar,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { current, prediction } = useHydroData();
  const { historyData, filter, setFilter, customRange, setCustomRange } = useHistory();

  const getSystemStatus = () => {
    const wqi = current.wqi;
    const state = current.state || (current as any).status || "GOOD";
    if (wqi >= 80 && state === "GOOD")
      return { label: "System · EXCELLENT", tone: "good" as const };
    if (wqi >= 60 && state !== "UNSAFE")
      return { label: "System · WARNING", tone: "warn" as const };
    return { label: "System · CRITICAL", tone: "bad" as const };
  };

  const status = getSystemStatus();

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Overview"
        title="Dashboard"
        description="Live water intelligence across all connected stations."
        right={<StatusPill tone={status.tone}>{status.label}</StatusPill>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={ThermometerSun}
          label="Temperature"
          value={current.temperature}
          unit="°C"
          tone="text-cyan"
          data={historyData}
          dk="temperature"
          trend="Stable range"
          delay={0.0}
        />
        <PhCard />
        <MetricCard
          icon={Droplets}
          label="TDS"
          value={current.tds}
          unit="ppm"
          tone="text-cyan"
          data={historyData}
          dk="tds"
          trend="Safe · 50–500"
          color="var(--color-emerald)"
          delay={0.1}
        />
        <MetricCard
          icon={Waves}
          label="Turbidity"
          value={current.ntu}
          unit="NTU"
          tone="text-cyan"
          data={historyData}
          dk="ntu"
          trend="Clear water"
          delay={0.15}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <WQICard />
        <HealthCard />
        <RiskCard />
      </div>

      <GlassCard className="p-0" delay={0.1}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan/80">Historical trend</div>
            <div className="mt-1 font-display text-lg font-semibold">Water Quality Index</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["hour", "day", "week", "month", "custom"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition cursor-pointer ${
                  filter === f
                    ? "border-cyan/35 bg-cyan/15 text-cyan"
                    : "border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "hour"
                  ? "Last Hour"
                  : f === "day"
                    ? "Last Day"
                    : f === "week"
                      ? "Last Week"
                      : f === "month"
                        ? "Last Month"
                        : "Custom Range"}
              </button>
            ))}
          </div>
        </div>

        {filter === "custom" && (
          <div className="flex flex-wrap items-center gap-4 px-5 pt-3 text-xs border-t border-white/5 mt-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-cyan" />
              <span className="text-muted-foreground">Start:</span>
              <input
                type="datetime-local"
                value={new Date(
                  customRange.start.getTime() - customRange.start.getTimezoneOffset() * 60000,
                )
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) => setCustomRange((r) => ({ ...r, start: new Date(e.target.value) }))}
                className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-foreground focus:border-cyan/40 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">End:</span>
              <input
                type="datetime-local"
                value={new Date(
                  customRange.end.getTime() - customRange.end.getTimezoneOffset() * 60000,
                )
                  .toISOString()
                  .slice(0, 16)}
                onChange={(e) => setCustomRange((r) => ({ ...r, end: new Date(e.target.value) }))}
                className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-foreground focus:border-cyan/40 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="px-2 pb-4 pt-2 mt-2" style={{ height: 300 }}>
          {historyData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No historical data available for the selected range.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 20, right: 30, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="lineWqi" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-cyan)" />
                    <stop offset="100%" stopColor="var(--color-emerald)" />
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
                  domain={["auto", 100]}
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
                  labelStyle={{ color: "oklch(0.7 0.03 240)" }}
                />
                <Line
                  type="monotone"
                  dataKey="wqi"
                  stroke="url(#lineWqi)"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard delay={0.05}>
          <div className="flex items-center gap-2 text-cyan">
            <Sparkles className="h-4 w-4" />{" "}
            <span className="text-xs uppercase tracking-wider">AI recommendation</span>
          </div>
          <p className="mt-3 text-sm text-foreground/90">{prediction.recommendation}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { l: "24h", v: prediction.future_prediction_24h },
              { l: "48h", v: prediction.future_prediction_48h },
              { l: "72h", v: prediction.future_prediction_72h },
            ].map((h) => (
              <div key={h.l} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {h.l}
                </div>
                <div className="mt-1 font-display text-lg font-semibold text-cyan">{h.v}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.1}>
          <div className="flex items-center gap-2 text-emerald">
            <Shield className="h-4 w-4" />{" "}
            <span className="text-xs uppercase tracking-wider">Water safety</span>
          </div>
          <div className="mt-4 flex items-end gap-2">
            <div className="font-display text-5xl font-semibold text-emerald">
              <AnimatedCounter value={prediction.water_safety} />
            </div>
            <div className="pb-2 text-sm text-muted-foreground">/ 100</div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-[image:var(--gradient-emerald)]"
              style={{ width: `${prediction.water_safety}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Safe for drinking with routine monitoring.
          </div>
        </GlassCard>

        <GlassCard delay={0.15}>
          <div className="flex items-center gap-2 text-warning">
            <Activity className="h-4 w-4" />{" "}
            <span className="text-xs uppercase tracking-wider">Algal bloom probability</span>
          </div>
          <div className="mt-4 font-display text-5xl font-semibold text-warning">
            <AnimatedCounter value={prediction.algal_bloom_probability} suffix="%" />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Low probability · monitoring nutrients & chlorophyll.
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <div className="rounded-lg border border-emerald/20 bg-emerald/5 p-2 text-center text-emerald">
              Low
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
              Med
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 text-center">
              High
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  tone,
  data,
  dk,
  trend,
  color = "var(--color-cyan)",
  delay = 0,
}: {
  icon: any;
  label: string;
  value: number;
  unit: string;
  tone: string;
  data: any[];
  dk: string;
  trend: string;
  color?: string;
  delay?: number;
}) {
  return (
    <GlassCard delay={delay}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {label}
        </div>
        <StatusPill tone="good">Live</StatusPill>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className={`font-display text-4xl font-semibold ${tone}`}>
          <AnimatedCounter value={value} decimals={value % 1 === 0 ? 0 : 1} />
        </div>
        <div className="text-sm text-muted-foreground">{unit}</div>
      </div>
      <div className="text-[11px] text-muted-foreground">{trend}</div>
      <div className="mt-2">
        <Sparkline data={data} dataKey={dk} color={color} />
      </div>
    </GlassCard>
  );
}

function PhCard() {
  const { current } = useHydroData();
  const ph = current.ph;
  const pct = (ph / 14) * 100;
  const tone = ph < 6.5 ? "warn" : ph > 8.5 ? "warn" : "good";
  const label = ph < 6.5 ? "Acidic" : ph > 8.5 ? "Basic" : "Neutral";
  return (
    <GlassCard delay={0.05}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Gauge className="h-3.5 w-3.5" /> pH Level
        </div>
        <StatusPill tone={tone as any}>{label}</StatusPill>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className="font-display text-4xl font-semibold text-emerald">
          <AnimatedCounter value={ph} decimals={1} />
        </div>
        <div className="text-sm text-muted-foreground">pH</div>
      </div>
      <div className="mt-4">
        <div className="relative h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-danger/50 via-emerald/60 to-ocean/60">
          <div
            className="absolute -top-1 h-4.5 w-0.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Acidic</span>
          <span>Neutral</span>
          <span>Basic</span>
        </div>
      </div>
    </GlassCard>
  );
}

function WQICard() {
  const { current } = useHydroData();
  const v = current.wqi;
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (v / 100) * circumference;
  const rating = v >= 80 ? "Excellent" : v >= 60 ? "Good" : "Poor";
  const color =
    v >= 80 ? "var(--color-emerald)" : v >= 60 ? "var(--color-cyan)" : "var(--color-danger)";
  return (
    <GlassCard delay={0.05}>
      <div className="flex items-center gap-2 text-cyan">
        <Sparkles className="h-4 w-4" />{" "}
        <span className="text-xs uppercase tracking-wider">Water Quality Index</span>
      </div>
      <div className="mt-2 flex items-center gap-5">
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle
              cx="60"
              cy="60"
              r="46"
              stroke="oklch(1 0 0 / 0.08)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="46"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display text-3xl font-semibold" style={{ color }}>
                <AnimatedCounter value={v} decimals={0} />
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                / 100
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-display text-xl font-semibold">{rating}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Composite score based on pH, TDS, NTU, temperature and dissolved oxygen models.
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function HealthCard() {
  const { current } = useHydroData();
  const score = current.water_health_score || current.wqi; // fallback if undefined
  return (
    <GlassCard delay={0.1}>
      <div className="flex items-center gap-2 text-emerald">
        <Shield className="h-4 w-4" />{" "}
        <span className="text-xs uppercase tracking-wider">Water health score</span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className="font-display text-5xl font-semibold text-emerald">
          <AnimatedCounter value={score} />
        </div>
        <div className="text-sm text-muted-foreground">/ 100 · AI</div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-[image:var(--gradient-emerald)]"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <div>pH · ok</div>
        <div>TDS · ok</div>
        <div>NTU · ok</div>
      </div>
    </GlassCard>
  );
}

function RiskCard() {
  const { prediction } = useHydroData();
  return (
    <GlassCard delay={0.15}>
      <div className="flex items-center gap-2 text-warning">
        <Activity className="h-4 w-4" />{" "}
        <span className="text-xs uppercase tracking-wider">AI risk score</span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <div className="font-display text-5xl font-semibold text-cyan">{prediction.risk}</div>
        <StatusPill tone="info">{prediction.confidence}% conf.</StatusPill>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{prediction.recommendation}</p>
    </GlassCard>
  );
}
