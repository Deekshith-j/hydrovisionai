import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ComingSoon } from "@/components/hv/ComingSoon";
import { Battery, Cpu, Database, MapPin, Wifi } from "lucide-react";

export const Route = createFileRoute("/app/devices")({ component: Devices });

const rows = [
  { icon: Cpu, k: "Firmware version", v: "v1.4.2" },
  { icon: Battery, k: "Battery", v: "87%" },
  { icon: Wifi, k: "WiFi signal", v: "-58 dBm · Strong" },
  { icon: Database, k: "Firebase link", v: "Connected · 12ms" },
  { icon: MapPin, k: "GPS fix", v: "3D · 8 satellites" },
];

function Devices() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Hardware" title="Device Management" description="Connected node health and configuration." right={<StatusPill tone="good">Connected</StatusPill>} />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan/80"><Cpu className="h-3.5 w-3.5" /> ESP32 · HV-001</div>
          <div className="mt-3 grid gap-2">
            {rows.map((r) => (
              <div key={r.k} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><r.icon className="h-3.5 w-3.5" /> {r.k}</div>
                <div className="font-medium text-foreground/90">{r.v}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.05}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Sensor status</div>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {["Temperature · DS18B20", "pH probe", "TDS Gravity v1.1", "Turbidity analog", "GPS module"].map((s) => (
              <li key={s} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span>{s}</span><StatusPill tone="good">OK</StatusPill>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ComingSoon tag="Coming Soon" title="OTA Firmware Update" description="Remote firmware rollout with staged deployment across the fleet." />
        <ComingSoon tag="Waiting for Device Integration" title="Sensor Calibration" description="Guided calibration wizard once bench-tested probes are shipped." />
        <ComingSoon tag="Coming Soon" title="Sensor Diagnostics" description="Cross-sensor consistency checks and anomaly triangulation." />
      </div>
    </div>
  );
}
