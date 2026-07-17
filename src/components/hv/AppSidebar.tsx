import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Cpu,
  FileText,
  Info,
  LayoutDashboard,
  Leaf,
  Map,
  Radar,
  Radio,
  Settings,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { motion } from "framer-motion";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/live", label: "Live Monitoring", icon: Radio },
  { to: "/app/prediction", label: "AI Prediction", icon: Sparkles },
  { to: "/app/geo", label: "Geo Intelligence", icon: Map },
  { to: "/app/analytics", label: "Historical Analytics", icon: BarChart3 },
  { to: "/app/environmental", label: "Environmental Insights", icon: Leaf },
  { to: "/app/bloom", label: "Algal Bloom", icon: Radar },
  { to: "/app/stations", label: "Monitoring Stations", icon: Activity },
  { to: "/app/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/app/reports", label: "Reports", icon: FileText },
  { to: "/app/devices", label: "Device Management", icon: Cpu },
  { to: "/app/admin", label: "Admin Panel", icon: ShieldCheck },
  { to: "/app/roadmap", label: "AI Roadmap", icon: Sparkles },
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/about", label: "About", icon: Info },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-[264px] shrink-0 flex-col border-r border-white/5 bg-[color:var(--sidebar)] backdrop-blur-2xl">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
          <Waves className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <div className="font-display text-[15px] font-semibold tracking-tight">HydroVision AI</div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Water Intelligence</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="px-2 pb-2 pt-3 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
          Platform
        </div>
        <ul className="flex flex-col gap-0.5">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-xl bg-white/[0.06] ring-1 ring-inset ring-cyan/25"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("relative h-4 w-4 shrink-0", active && "text-cyan")} />
                  <span className="relative truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/5 p-3">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
            All systems operational
          </div>
          <div className="mt-1 text-xs text-foreground/80">ESP32 · Firebase · AI Engine</div>
        </div>
      </div>
    </aside>
  );
}
