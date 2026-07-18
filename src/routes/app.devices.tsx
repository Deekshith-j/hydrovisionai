import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ComingSoon } from "@/components/hv/ComingSoon";
import { Battery, Cpu, Database, MapPin, Wifi } from "lucide-react";

import { useHydroData } from "@/lib/firebase";

export const Route = createFileRoute("/app/devices")({ component: Devices });

function Devices() {
  const { current, device, isConnected } = useHydroData();

  // 1. Calculate device online/offline (received data within last 15s)
  const ts = current?.timestamp
    ? current.timestamp < 200000000000
      ? current.timestamp * 1000
      : current.timestamp
    : 0;
  const isDeviceOnline = ts && Date.now() - ts < 15000;

  // 2. Format card row values dynamically from Firebase
  const firmware = device?.firmware || "v1.0.0";
  const batteryVal = current?.battery !== undefined ? `${current.battery}%` : "N/A";

  const wifiDbm = current?.wifiStrength;
  const wifiLabel =
    wifiDbm !== undefined
      ? `${wifiDbm} dBm · ${wifiDbm > -60 ? "Strong" : wifiDbm > -80 ? "Weak" : "Poor"}`
      : "Offline";

  const firebaseLabel = isConnected ? "Connected" : "Disconnected";

  const satellites = current?.satellites || 0;
  const gpsLabel =
    current?.latitude && current?.longitude && satellites >= 3
      ? `3D · ${satellites} satellites`
      : "No Fix";

  const rows = [
    { icon: Cpu, k: "Firmware version", v: firmware },
    { icon: Battery, k: "Battery", v: batteryVal },
    { icon: Wifi, k: "WiFi signal", v: wifiLabel },
    { icon: Database, k: "Firebase link", v: firebaseLabel },
    { icon: MapPin, k: "GPS fix", v: gpsLabel },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Hardware"
        title="Device Management"
        description="Connected node health and configuration."
        right={
          <StatusPill tone={isDeviceOnline ? "good" : "bad"}>
            {isDeviceOnline ? "Connected" : "Device Offline"}
          </StatusPill>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-cyan/80">
            <Cpu className="h-3.5 w-3.5" /> ESP32 · HV-001
          </div>
          <div className="mt-3 grid gap-2">
            {rows.map((r) => (
              <div
                key={r.k}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <r.icon className="h-3.5 w-3.5" /> {r.k}
                </div>
                <div className="font-medium text-foreground/90">{r.v}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.05}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Sensor status</div>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {[
              "Temperature · DS18B20",
              "pH probe",
              "TDS Gravity v1.1",
              "Turbidity analog",
              "GPS module",
            ].map((s) => (
              <li
                key={s}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <span>{s}</span>
                <StatusPill tone="good">OK</StatusPill>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ComingSoon
          tag="Coming Soon"
          title="OTA Firmware Update"
          description="Remote firmware rollout with staged deployment across the fleet."
        />
        <ComingSoon
          tag="Waiting for Device Integration"
          title="Sensor Calibration"
          description="Guided calibration wizard once bench-tested probes are shipped."
        />
        <ComingSoon
          tag="Coming Soon"
          title="Sensor Diagnostics"
          description="Cross-sensor consistency checks and anomaly triangulation."
        />
      </div>
    </div>
  );
}
