import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { makeHistory } from "@/lib/hv-data";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

export const Route = createFileRoute("/app/analytics")({ component: Analytics });

const filters = ["Last Hour", "24 Hours", "7 Days", "30 Days", "Custom"] as const;
const metrics = [
  { key: "temperature", label: "Temperature", unit: "°C", color: "var(--color-cyan)" },
  { key: "ph", label: "pH", unit: "", color: "var(--color-emerald)" },
  { key: "tds", label: "TDS", unit: "ppm", color: "var(--color-cyan)" },
  { key: "ntu", label: "Turbidity", unit: "NTU", color: "var(--color-warning)" },
  { key: "wqi", label: "WQI", unit: "", color: "var(--color-emerald)" },
];

function Analytics() {
  const [range, setRange] = useState<(typeof filters)[number]>("24 Hours");
  const [metric, setMetric] = useState(metrics[0]);
  const data = useMemo(
    () =>
      makeHistory(
        range === "Last Hour" ? 12 : range === "24 Hours" ? 24 : range === "7 Days" ? 84 : 120,
      ),
    [range],
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Analytics"
        title="Historical Analytics"
        description="Long-range trends across every sensor."
        right={
          <div className="flex flex-wrap gap-2">
            {(["CSV", "Excel", "PDF"] as const).map((f) => (
              <button
                key={f}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-foreground/80 transition hover:border-cyan/30 hover:text-foreground"
              >
                {f === "CSV" ? (
                  <Download className="h-3 w-3" />
                ) : f === "Excel" ? (
                  <FileSpreadsheet className="h-3 w-3" />
                ) : (
                  <FileText className="h-3 w-3" />
                )}
                Export {f}
              </button>
            ))}
          </div>
        }
      />

      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setRange(f)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${range === f ? "bg-cyan/15 text-cyan ring-1 ring-cyan/30" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f}
            </button>
          ))}
          <span className="mx-2 h-4 w-px bg-white/10" />
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${metric.key === m.key ? "bg-white/10 text-foreground ring-1 ring-white/15" : "text-muted-foreground hover:text-foreground"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-0" delay={0.05}>
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan/80">{range}</div>
            <div className="mt-1 font-display text-lg font-semibold">{metric.label} trend</div>
          </div>
          <StatusPill tone="info">Live model</StatusPill>
        </div>
        <div className="px-2 pb-4 pt-2" style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="anaArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={metric.color} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
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
                labelStyle={{ color: "oklch(0.7 0.03 240)" }}
              />
              <Area
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={2.5}
                fill="url(#anaArea)"
                isAnimationActive
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniChart
          data={data}
          title="AI Prediction History"
          dataKey="wqi"
          color="var(--color-emerald)"
        />
        <MiniChart
          data={data}
          title="Turbidity vs Temperature"
          dataKey="ntu"
          color="var(--color-warning)"
        />
      </div>
    </div>
  );
}

function MiniChart({
  data,
  title,
  dataKey,
  color,
}: {
  data: any[];
  title: string;
  dataKey: string;
  color: string;
}) {
  return (
    <GlassCard className="p-0" delay={0.05}>
      <div className="px-5 pt-5">
        <div className="text-xs uppercase tracking-wider text-cyan/80">Insight</div>
        <div className="mt-1 font-display text-base font-semibold">{title}</div>
      </div>
      <div className="px-2 pb-4 pt-2" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 4 }}>
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
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
