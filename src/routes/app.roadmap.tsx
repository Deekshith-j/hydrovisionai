import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { motion } from "framer-motion";
import { Camera, Cpu, Map, Satellite, Sparkles, Waves } from "lucide-react";

export const Route = createFileRoute("/app/roadmap")({ component: Roadmap });

const phases = [
  { n: 1, title: "IoT Monitoring", desc: "ESP32 nodes streaming pH, TDS, NTU, temperature via Firebase.", icon: Cpu, status: "live" as const },
  { n: 2, title: "AI Prediction", desc: "Random Forest, XGBoost, LSTM ensemble powering risk and forecasts.", icon: Sparkles, status: "live" as const },
  { n: 3, title: "GPS Mapping", desc: "Fleet-wide geospatial visualisation with layered intelligence.", icon: Map, status: "live" as const },
  { n: 4, title: "Computer Vision", desc: "ESP32-CAM surface analysis for scum, foam and debris.", icon: Camera, status: "soon" as const },
  { n: 5, title: "Satellite Intelligence", desc: "Sentinel-2 / Landsat / MODIS integration.", icon: Satellite, status: "soon" as const },
  { n: 6, title: "Digital Twin", desc: "Realtime lake simulation for scenario planning.", icon: Waves, status: "soon" as const },
];

function Roadmap() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Vision" title="AI Roadmap" description="From single-node sensing to a full digital twin." right={<StatusPill tone="info">6 phases</StatusPill>} />

      <div className="relative">
        <div className="pointer-events-none absolute left-6 top-0 bottom-0 hidden w-px bg-white/10 sm:block" />
        <div className="flex flex-col gap-4">
          {phases.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05 }}
              className="relative flex items-start gap-4 sm:pl-16"
            >
              <div className={`hidden sm:grid absolute left-0 top-1 h-12 w-12 place-items-center rounded-2xl border ${p.status === "live" ? "border-emerald/30 bg-emerald/10 text-emerald" : "border-white/10 bg-white/[0.03] text-muted-foreground"}`}>
                <p.icon className="h-5 w-5" />
              </div>
              <div className="glass glass-hover flex-1 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Phase {p.n}</span>
                    <div className="font-display text-lg font-semibold">{p.title}</div>
                  </div>
                  <StatusPill tone={p.status === "live" ? "good" : "info"}>{p.status === "live" ? "Live" : "Coming soon"}</StatusPill>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
