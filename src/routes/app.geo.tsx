import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ComingSoon } from "@/components/hv/ComingSoon";
import { useHydroData } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Layers, Map as MapIcon, Compass } from "lucide-react";

export const Route = createFileRoute("/app/geo")({ component: GeoPage });

function GeoPage() {
  const { stations, current, updateCurrent } = useHydroData();
  const [leaflet, setLeaflet] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [rl, l] = await Promise.all([
        import("react-leaflet"),
        import("leaflet"),
      ]);
      const L = l as any;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      await import("leaflet/dist/leaflet.css");
      if (cancelled) return;
      setLeaflet(rl);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          updateCurrent({ 
            latitude: lat, 
            longitude: lng,
            satellites: Math.max(current.satellites || 0, 7) // Mock satellites fix if needed
          });
        },
        (error) => {
          console.error("Error retrieving geolocation:", error);
          alert("Error retrieving geolocation: " + error.message);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const totalStations = stations.length;

  if (!leaflet) {
    return (
      <div className="flex flex-col gap-6">
        <SectionTitle eyebrow="Spatial" title="Geo Intelligence" description="Interactive map of monitoring stations and water bodies." right={<StatusPill tone="good">{totalStations} stations</StatusPill>} />
        <GlassCard className="p-0 overflow-hidden" delay={0}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] p-4">
            <div className="flex items-center gap-2 text-sm"><MapIcon className="h-4 w-4 text-cyan" /> HydroVision Network · Bengaluru cluster</div>
          </div>
          <div style={{ height: 520 }} className="grid place-items-center text-sm text-muted-foreground">Loading map…</div>
        </GlassCard>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup, useMap } = leaflet;

  function RecenterMap({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
      if (center[0] && center[1]) {
        map.setView(center, map.getZoom());
      }
    }, [center, map]);
    return null;
  }

  const deviceLat = current.latitude || 12.9716;
  const deviceLng = current.longitude || 77.5946;
  const deviceCenter: [number, number] = [deviceLat, deviceLng];

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Spatial" title="Geo Intelligence" description="Interactive map of monitoring stations and water bodies." right={<StatusPill tone="good">{totalStations} stations</StatusPill>} />

      <GlassCard className="p-0 overflow-hidden" delay={0}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] p-4">
          <div className="flex items-center gap-2 text-sm"><MapIcon className="h-4 w-4 text-cyan" /> HydroVision Network · Live Tracking</div>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleLocateMe}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan/35 bg-cyan/15 text-cyan px-2.5 py-1 text-[11px] font-medium transition cursor-pointer hover:bg-cyan/25"
            >
              <Compass className="h-3 w-3 animate-pulse" /> Locate Me (Google GPS)
            </button>
            {["Stations", "Heat map", "Pollution zones", "Satellite", "Rivers", "Lakes"].map((l, i) => (
              <button key={l} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 text-muted-foreground px-2.5 py-1 text-[11px] transition hover:text-foreground">
                <Layers className="h-3 w-3" /> {l}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: 520 }}>
          <MapContainer center={deviceCenter} zoom={11} style={{ height: "100%", width: "100%", borderRadius: 20 }} scrollWheelZoom>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <RecenterMap center={deviceCenter} />

            {/* Live ESP32 Device Marker */}
            {current.latitude && current.longitude && (
              <CircleMarker
                center={deviceCenter}
                radius={12}
                pathOptions={{ color: "#00E5FF", fillColor: "#00E5FF", fillOpacity: 0.8, weight: 3 }}
              >
                <Popup>
                  <div style={{ fontFamily: "inherit", minWidth: 180 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }} className="text-cyan">ESP32-S3 Node (Live)</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>Coordinates: {deviceLat.toFixed(6)}, {deviceLng.toFixed(6)}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 }}>
                      <div>Temperature</div><div className="font-semibold">{current.temperature} °C</div>
                      <div>pH</div><div className="font-semibold">{current.ph}</div>
                      <div>TDS</div><div className="font-semibold">{current.tds} ppm</div>
                      <div>NTU</div><div className="font-semibold">{current.ntu}</div>
                      <div>WQI</div><div className="font-semibold text-emerald">{current.wqi}</div>
                      <div>Status</div><div className="font-semibold uppercase">{current.state || "GOOD"}</div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )}

            {/* Deployed Stations */}
            {stations.map((s) => {
              const online = s.status === "ONLINE";
              const color = !online ? "#E74C3C" : s.wqi >= 70 ? "#2ECC71" : s.wqi >= 50 ? "#F39C12" : "#E74C3C";
              return (
                <CircleMarker
                  key={s.id}
                  center={[s.lat, s.lng] as [number, number]}
                  radius={10}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 2 }}
                >
                  <Popup>
                    <div style={{ fontFamily: "inherit", minWidth: 185 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.name}</div>
                      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6 }}>{s.id} · {s.status}</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 12 }}>
                        <div>WQI</div><div className="font-semibold" style={{ color }}>{s.wqi}</div>
                        <div>Battery</div><div>{s.battery}%</div>
                        <div>Updated</div><div>{s.updated}</div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </GlassCard>

      <div className="grid gap-4 md:grid-cols-3">
        <ComingSoon tag="Coming Soon" title="Heat Map Overlay" description="Density heat map of contamination events across watersheds." />
        <ComingSoon tag="Coming Soon" title="Satellite Layer" description="Sentinel-2 true-color tiles with chlorophyll retrieval overlay." />
        <ComingSoon tag="Coming Soon" title="River & Lake Layer" description="Vector layers for hydrography and catchment areas." />
      </div>
    </div>
  );
}
