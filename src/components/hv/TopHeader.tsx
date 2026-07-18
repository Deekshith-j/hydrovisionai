import { Bell, Cpu, Database, Satellite, MapPin, User, Wifi } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { useEffect, useState } from "react";
import { useHydroData } from "@/lib/firebase";

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function TopHeader({ title }: { title?: string }) {
  const now = useNow();
  const { current, isConnected } = useHydroData();

  const date = now
    ? now.toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";
  const time = now
    ? now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "";

  // 1. Device Online Status (updated within last 15s)
  const ts = current?.timestamp
    ? current.timestamp < 200000000000
      ? current.timestamp * 1000
      : current.timestamp
    : 0;
  const isDeviceOnline = ts && Date.now() - ts < 15000;
  const deviceTone = isDeviceOnline ? "good" : "bad";
  const deviceLabel = isDeviceOnline ? "ESP32" : "ESP32 · Offline";

  // 2. Firebase Connection Status
  const firebaseTone = isConnected ? "good" : "bad";
  const firebaseLabel = isConnected ? "Firebase" : "Firebase · Off";

  // 3. GPS Status
  const satellites = current?.satellites || 0;
  const hasGpsFix = current?.latitude && current?.longitude && satellites >= 3;
  const gpsTone = hasGpsFix ? "good" : "warn";
  const gpsLabel = hasGpsFix ? `GPS · ${satellites}s` : "GPS · No Fix";

  // 4. WiFi Strength Status
  const wifiDbm = (current as any)?.wifiStrength;
  const getWifiTone = (dbm?: number) => {
    if (dbm === undefined || dbm === null) return "bad";
    if (dbm > -60) return "good";
    if (dbm > -80) return "warn";
    return "bad";
  };
  const getWifiLabel = (dbm?: number) => {
    if (dbm === undefined || dbm === null) return "WiFi · Off";
    if (dbm > -60) return "WiFi · strong";
    if (dbm > -80) return "WiFi · weak";
    return "WiFi · poor";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="font-mono">{date}</span>
            <span className="text-white/20">·</span>
            <span className="font-mono tabular-nums">{time}</span>
          </div>
          {title && (
            <div className="mt-0.5 truncate font-display text-sm font-medium text-foreground/90">
              {title}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <StatusPill tone={deviceTone}>
            <Cpu className="h-3 w-3" /> {deviceLabel}
          </StatusPill>
          <StatusPill tone={firebaseTone}>
            <Database className="h-3 w-3" /> {firebaseLabel}
          </StatusPill>
          <StatusPill tone={getWifiTone(wifiDbm)}>
            <Wifi className="h-3 w-3" /> {getWifiLabel(wifiDbm)}
          </StatusPill>
          <StatusPill tone="good">
            <span className="font-semibold">AI</span> 95%
          </StatusPill>
          <StatusPill tone={gpsTone}>
            <MapPin className="h-3 w-3" /> {gpsLabel}
          </StatusPill>
          <StatusPill tone="muted">
            <Satellite className="h-3 w-3" /> Weather · soon
          </StatusPill>
        </div>

        <button className="relative grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground transition hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-danger text-[9px] font-semibold text-white">
            3
          </span>
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
