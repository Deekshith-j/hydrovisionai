import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { Sparkline } from "@/components/hv/Sparkline";
import { AnimatedCounter } from "@/components/hv/AnimatedCounter";
import { ComingSoon } from "@/components/hv/ComingSoon";
import { useHydroData } from "@/lib/firebase";
import { useHistory } from "@/hooks/useHistory";
import { Battery, Droplets, Gauge, MapPin, Sun, ThermometerSun, Waves, Cpu, Wifi, Database, Compass } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app/live")({ component: LiveMonitoring });

function LiveMonitoring() {
  const { current, isConnected, updateCurrent } = useHydroData();
  const { historyData } = useHistory();
  const [timeAgoLabel, setTimeAgoLabel] = useState("Just now");

  // Calculate "time ago" for last telemetry update
  useEffect(() => {
    const updateLabel = () => {
      const ts = current.timestamp ? (current.timestamp < 200000000000 ? current.timestamp * 1000 : current.timestamp) : 0;
      if (!ts) {
        setTimeAgoLabel("Never");
        return;
      }
      const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
      if (diff < 5) setTimeAgoLabel("Just now");
      else if (diff < 60) setTimeAgoLabel(`${diff}s ago`);
      else setTimeAgoLabel(`${Math.floor(diff / 60)}m ago`);
    };

    updateLabel();
    const interval = setInterval(updateLabel, 1000);
    return () => clearInterval(interval);
  }, [current.timestamp]);

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateCurrent({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            satellites: Math.max(current.satellites || 0, 8), // set active satellite lock count
          });
        },
        (error) => {
          console.error("Error retrieving location:", error);
          alert("Error getting location: " + error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Derived statuses
  const ts = current.timestamp ? (current.timestamp < 200000000000 ? current.timestamp * 1000 : current.timestamp) : 0;
  const isDeviceOnline = ts && (Date.now() - ts < 15000);
  const deviceStateLabel = current.state || (current as any).status || "GOOD";
  
  const sensors = [
    { id: "temp", label: "Temperature", icon: ThermometerSun, value: current.temperature, unit: "°C", range: "10 – 35°C", key: "temperature", color: "var(--color-cyan)" },
    { id: "ph", label: "pH", icon: Gauge, value: current.ph, unit: "", range: "6.5 – 8.5", key: "ph", color: "var(--color-emerald)" },
    { id: "tds", label: "TDS", icon: Droplets, value: current.tds, unit: "ppm", range: "50 – 500 ppm", key: "tds", color: "var(--color-cyan)" },
    { id: "ntu", label: "Turbidity", icon: Waves, value: current.ntu, unit: "NTU", range: "< 5 NTU", key: "ntu", color: "var(--color-emerald)" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle 
        eyebrow="Realtime" 
        title="Live Monitoring" 
        description="Every sensor, streamed continuously from ESP32 via Firebase." 
        right={
          <StatusPill tone={isDeviceOnline ? "good" : "bad"}>
            {isDeviceOnline ? "Streaming" : "Offline"}
          </StatusPill>
        } 
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {sensors.map((s, i) => (
          <GlassCard key={s.id} delay={i * 0.05}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </div>
              <div className="flex items-center gap-2">
                <StatusPill tone={deviceStateLabel === "UNSAFE" ? "bad" : deviceStateLabel === "POOR" ? "warn" : "good"}>
                  {deviceStateLabel}
                </StatusPill>
                <span className="text-[11px] text-muted-foreground">Updated {timeAgoLabel}</span>
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between gap-4">
              <div>
                <div className="font-display text-5xl font-semibold text-cyan">
                  <AnimatedCounter value={s.value} decimals={s.value % 1 === 0 ? 0 : 2} />
                </div>
                <div className="text-xs text-muted-foreground">{s.unit} · Normal range {s.range}</div>
              </div>
              <div className="w-1/2">
                <Sparkline data={historyData} dataKey={s.key} color={s.color} height={64} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 text-center">Trend · stable</div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1.5 text-center">WQI · {current.wqi}</div>
              <div className="rounded-lg border border-emerald/20 bg-emerald/5 px-2 py-1.5 text-center text-emerald">Sensor OK</div>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> GPS Coordinates
            </div>
            <div className="mt-3 font-mono text-lg text-foreground">
              {current.latitude ? current.latitude.toFixed(6) : "0.000000"}, {current.longitude ? current.longitude.toFixed(6) : "0.000000"}
            </div>
            <div className="text-xs text-muted-foreground">
              Fix Quality: {current.satellites && current.satellites >= 3 ? "3D Lock" : "No GPS Lock"}
            </div>
          </div>
          <button 
            onClick={handleLocateMe}
            className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-cyan/35 bg-cyan/10 py-2.5 px-3 text-xs font-semibold text-cyan transition hover:bg-cyan/20 cursor-pointer"
          >
            <Compass className="h-4 w-4" /> Locate Me (Google GPS)
          </button>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Cpu className="h-3.5 w-3.5" /> Device Diagnostics
          </div>
          <div className="mt-3 space-y-1.5 text-xs text-foreground/90">
            <div className="flex justify-between items-center">
              <span>Device Status</span>
              <StatusPill tone={isDeviceOnline ? "good" : "bad"}>{isDeviceOnline ? "Online" : "Offline"}</StatusPill>
            </div>
            <div className="flex justify-between items-center">
              <span>Firebase RTDB</span>
              <StatusPill tone={isConnected ? "good" : "bad"}>{isConnected ? "Connected" : "Disconnected"}</StatusPill>
            </div>
            <div className="flex justify-between items-center">
              <span>Wi-Fi Status</span>
              <span className="font-mono text-cyan">{current.wifiStrength ? `${current.wifiStrength} dBm` : "Offline"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Satellites Count</span>
              <span className="font-semibold text-cyan">{current.satellites || 0} Sats</span>
            </div>
          </div>
        </GlassCard>

        <ComingSoon tag="Waiting for Device Integration" title="Battery & Solar Status" description="Battery telemetry and solar harvesting metrics activate automatically when edge sensors publish to Firebase." />
      </div>
    </div>
  );
}
