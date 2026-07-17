import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { useHydroData } from "@/lib/firebase";
import { AlertTriangle, CheckCircle2, Search, Clock } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/app/alerts")({ component: Alerts });

function Alerts() {
  const { alerts, ackAlert } = useHydroData();
  const [q, setQ] = useState("");

  const active = useMemo(() => alerts.filter((r) => !r.ack), [alerts]);
  const history = useMemo(() => alerts.filter((r) => r.ack), [alerts]);
  
  const filtered = useMemo(() => {
    if (!q) return history;
    const queryStr = q.toLowerCase();
    return history.filter((r) => 
      (r.title || "").toLowerCase().includes(queryStr) || 
      (r.description || "").toLowerCase().includes(queryStr) ||
      (r.station || "").toLowerCase().includes(queryStr)
    );
  }, [q, history]);

  const ack = (id: string | number) => ackAlert(id);

  const toneOf = (s: string) => (s === "critical" ? "bad" : s === "medium" ? "warn" : "info") as any;

  const formatTime = (ts: number) => {
    if (!ts) return "Unknown time";
    const ms = ts < 200000000000 ? ts * 1000 : ts;
    return new Date(ms).toLocaleString();
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle 
        eyebrow="Notifications" 
        title="Alerts Center" 
        description="Live incidents and resolved history." 
        right={<StatusPill tone="bad">{active.length} active</StatusPill>} 
      />

      <GlassCard>
        <div className="mb-3 flex items-center gap-2 text-cyan">
          <AlertTriangle className="h-4 w-4" /> 
          <span className="text-xs uppercase tracking-wider">Current alerts</span>
        </div>
        <div className="flex flex-col gap-2">
          {active.length === 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-muted-foreground">
              No active alerts. All systems operational.
            </div>
          )}
          {active.map((a) => (
            <div key={a.id || a.timestamp} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex sm:justify-between sm:items-center">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5">
                  <StatusPill tone={toneOf(a.severity)}>{a.severity.toUpperCase()}</StatusPill>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{a.title}</div>
                  <p className="text-xs text-muted-foreground/80 mt-1 max-w-2xl">{a.description || "Sensor threshold limit crossed."}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 mt-1.5 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>{a.station || "ESP32-S3 Node"} · {formatTime(a.timestamp)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => ack(a.id || a.timestamp)} 
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald/25 bg-emerald/10 px-3 py-1.5 text-xs text-emerald transition hover:bg-emerald/20 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Acknowledge
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard delay={0.05}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs uppercase tracking-wider text-cyan/80">Alert history</div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search alerts…"
              className="w-64 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-9 pr-3 text-xs placeholder:text-muted-foreground focus:border-cyan/40 focus:outline-none" 
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {filtered.length === 0 && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-muted-foreground text-center">
              No historical alerts match your search.
            </div>
          )}
          {filtered.map((a) => (
            <div key={a.id || a.timestamp} className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <StatusPill tone={toneOf(a.severity)}>{a.severity.toUpperCase()}</StatusPill>
                </div>
                <div>
                  <div className="text-sm text-foreground/90 font-medium">{a.title}</div>
                  <p className="text-xs text-muted-foreground/80 mt-1 max-w-2xl">{a.description || "Sensor threshold limit crossed."}</p>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 mt-1.5 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>{a.station || "ESP32-S3 Node"} · {formatTime(a.timestamp)}</span>
                  </div>
                </div>
              </div>
              <StatusPill tone="good">Resolved</StatusPill>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
