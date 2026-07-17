import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ComingSoon } from "@/components/hv/ComingSoon";
import { useHydroData } from "@/lib/firebase";
import { Battery, ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/stations")({ component: Stations });

function Stations() {
  const { stations } = useHydroData();
  const [openId, setOpenId] = useState<string | null>(null);
  const activeOpenId = openId !== null ? openId : (stations.length > 0 ? stations[0].id : null);

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Fleet" title="Monitoring Stations" description="Every deployed HydroVision node." right={<StatusPill tone="good">{stations.filter(s => s.status === "ONLINE").length} online</StatusPill>} />

      <div className="grid gap-4 xl:grid-cols-2">
        {stations.map((s, i) => {
          const open = activeOpenId === s.id;
          const online = s.status === "ONLINE";
          return (
            <GlassCard key={s.id} delay={i * 0.04}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-display text-lg font-semibold">{s.name}</div>
                    <StatusPill tone={online ? "good" : "bad"}>{s.status}</StatusPill>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {s.lat.toFixed(4)}, {s.lng.toFixed(4)} · {s.id}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
                    <Battery className="h-3 w-3 text-emerald" /> {s.battery}%
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1">
                    WQI · <span className="font-semibold text-foreground">{s.wqi || "–"}</span>
                  </div>
                  <span className="text-muted-foreground">Updated {s.updated}</span>
                </div>
              </div>

              <button onClick={() => setOpenId(open ? null : s.id)} className="mt-4 inline-flex items-center gap-1 text-xs text-cyan hover:underline">
                {open ? "Hide" : "Show"} details <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="mt-3 grid gap-3 border-t border-white/[0.06] pt-3 md:grid-cols-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sensor Information</div>
                    <ul className="mt-2 space-y-1 text-xs text-foreground/85">
                      <li>Temperature · DS18B20</li>
                      <li>pH · analog probe</li>
                      <li>TDS · Gravity v1.1</li>
                      <li>Turbidity · analog</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">AI Prediction</div>
                    <div className="mt-2 text-sm text-foreground/90">Risk · <span className="text-cyan">LOW</span></div>
                    <div className="text-xs text-muted-foreground">Confidence 94% · WQI stable</div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Maintenance</div>
                    <div className="mt-2 text-sm text-foreground/90">Calibration due in 12 days</div>
                    <div className="text-xs text-muted-foreground">Last serviced · 24 days ago</div>
                  </div>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      <ComingSoon tag="Coming Soon" title="Multi-station dashboard" description="Fleet-wide overview with cross-station analytics and comparative scoring." />
    </div>
  );
}
