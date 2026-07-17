import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Cpu, Database, Droplets, Gauge, Map, Play, Radar, Satellite, Sparkles, Waves } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HydroVision AI — AI-Powered Water Intelligence Platform" },
      { name: "description", content: "Predicting tomorrow's water quality today. Real-time IoT sensing, AI prediction, and geospatial intelligence for water bodies." },
      { property: "og:title", content: "HydroVision AI — AI-Powered Water Intelligence Platform" },
      { property: "og:description", content: "Predicting tomorrow's water quality today." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />
      <Nav />
      <Hero />
      <Overview />
      <FeatureGrid />
      <Footer />
    </div>
  );
}

function Background() {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-cyan/25 blur-[140px]" />
      <div className="pointer-events-none absolute top-40 right-0 h-[420px] w-[520px] rounded-full bg-ocean/40 blur-[160px]" />
      {/* Wave */}
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] w-[200%] animate-wave text-cyan/10" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="currentColor" d="M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,208C672,203,768,149,864,144C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z"/>
      </svg>
      {/* Particles */}
      {[...Array(14)].map((_, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-cyan/60"
          style={{ left: `${(i * 7 + 5) % 100}%`, top: `${(i * 13 + 10) % 90}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 5 + (i % 4), repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function Nav() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
          <Waves className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="font-display text-base font-semibold tracking-tight">HydroVision AI</span>
      </div>
      <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
        <a href="#platform" className="hover:text-foreground">Platform</a>
        <a href="#capabilities" className="hover:text-foreground">Capabilities</a>
        <a href="#roadmap" className="hover:text-foreground">Roadmap</a>
      </nav>
      <Link to="/app" className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium transition hover:border-cyan/40 hover:bg-white/[0.07]">
        Launch console
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </Link>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan/90 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
          Environmental Intelligence · v1.0
        </div>
        <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          <span className="text-gradient">HydroVision AI</span>
        </h1>
        <p className="mt-6 text-lg text-foreground/85 sm:text-xl">
          AI-Powered Water Intelligence Platform
        </p>
        <p className="mt-2 text-base text-muted-foreground">
          Predicting tomorrow's water quality — today.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/app"
            className="group inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:brightness-110"
          >
            Live Dashboard
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#platform"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition hover:border-cyan/40 hover:bg-white/[0.06]"
          >
            <Play className="h-3.5 w-3.5" /> View Demo
          </a>
        </div>
      </motion.div>

      {/* Hero preview card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-16 max-w-5xl"
      >
        <div className="glass rounded-3xl p-3 shadow-[var(--shadow-elevated)]">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Temperature", value: "24.6°C", tone: "text-cyan", icon: Gauge },
              { label: "pH Level", value: "7.2", tone: "text-emerald", icon: Droplets },
              { label: "TDS", value: "312 ppm", tone: "text-cyan", icon: Radar },
              { label: "WQI", value: "82 / 100", tone: "text-emerald", icon: Sparkles },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5" /> {s.label}
                </div>
                <div className={`mt-2 font-display text-2xl font-semibold ${s.tone}`}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" /> All systems operational</span>
            <span>Confidence 95% · Risk LOW</span>
          </div>
        </div>
      </motion.div>

      <div className="mt-16 flex justify-center text-muted-foreground">
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-1 text-[11px] uppercase tracking-[0.3em]">
          Scroll <ChevronDown className="h-4 w-4" />
        </motion.div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section id="platform" className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="text-xs uppercase tracking-[0.25em] text-cyan/80">Project overview</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Government-grade environmental intelligence.
          </h2>
          <p className="mt-4 text-muted-foreground">
            HydroVision AI fuses ESP32 IoT sensing, Firebase realtime streams, and machine learning
            to deliver continuous water quality intelligence — from a single station to a national
            fleet.
          </p>
        </div>
        <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
          {[
            { icon: Cpu, title: "IoT Sensing", desc: "ESP32 nodes streaming pH, TDS, turbidity, temperature and GPS." },
            { icon: Database, title: "Realtime Backbone", desc: "Firebase Realtime Database ingest with millisecond fan-out." },
            { icon: Sparkles, title: "AI Prediction", desc: "Risk scoring, algal bloom forecasting, 24/48/72h horizons." },
            { icon: Map, title: "Geo Intelligence", desc: "Interactive Leaflet maps with pollution and water-quality layers." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.06 }}
              className="glass glass-hover rounded-2xl p-5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan/15 text-cyan">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-base font-semibold">{f.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const items = [
    { title: "Live Monitoring", desc: "Every sensor, streamed live with historical comparison and health metadata.", tag: "Realtime" },
    { title: "AI Prediction Engine", desc: "Random Forest, XGBoost, and LSTM ensembles power multi-horizon forecasts.", tag: "ML" },
    { title: "Algal Bloom Radar", desc: "Dedicated harmful bloom module with contributing factors and timelines.", tag: "Predictive" },
    { title: "Historical Analytics", desc: "Beautiful daily, weekly, monthly, yearly charts with CSV/Excel/PDF export.", tag: "Insights" },
    { title: "Geo Intelligence", desc: "Leaflet-powered maps with heat, pollution, satellite, river and lake layers.", tag: "Spatial" },
    { title: "Environmental Insights", desc: "Lake health scoring, contamination timelines, seasonal trend detection.", tag: "Ecology" },
    { title: "Satellite Integration", desc: "NASA Landsat, Sentinel-2 and MODIS — chlorophyll and surface temperature.", tag: "Coming soon", soon: true },
    { title: "Digital Twin", desc: "Lake simulation and water dynamics for scenario planning and forecasting.", tag: "Coming soon", soon: true },
  ];
  return (
    <section id="capabilities" className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-cyan/80">Capabilities</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">A complete water intelligence stack.</h2>
        </div>
        <Link to="/app" className="inline-flex items-center gap-2 text-sm text-cyan hover:underline">
          Enter console <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.04 }}
            className="glass glass-hover relative overflow-hidden rounded-2xl p-5"
          >
            <div className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${it.soon ? "border-white/10 text-muted-foreground" : "border-cyan/25 text-cyan"}`}>
              {it.tag}
            </div>
            <div className="mt-4 font-display text-lg font-semibold">{it.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
            <Satellite className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 text-white/[0.03]" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="roadmap" className="relative z-10 border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-cyan" />
          <span>© {new Date().getFullYear()} HydroVision AI · Environmental Intelligence Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/app/roadmap" className="hover:text-foreground">Roadmap</Link>
          <Link to="/app/about" className="hover:text-foreground">About</Link>
          <Link to="/app" className="hover:text-foreground">Console</Link>
        </div>
      </div>
    </footer>
  );
}
