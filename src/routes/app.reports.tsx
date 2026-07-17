import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

export const Route = createFileRoute("/app/reports")({ component: Reports });

const reports = [
  { title: "Water Quality Report", desc: "Comprehensive quality analysis across all monitored parameters.", tag: "Monthly" },
  { title: "Environmental Report", desc: "Ecosystem-level health summary with seasonal insights.", tag: "Quarterly" },
  { title: "AI Prediction Report", desc: "Model performance, forecast accuracy and anomaly log.", tag: "Weekly" },
  { title: "Monthly Report", desc: "Rolling 30-day summary suitable for internal stakeholders.", tag: "Monthly" },
  { title: "Government Report", desc: "Compliance-ready format aligned to regulatory standards.", tag: "Regulatory" },
  { title: "Station Diagnostics", desc: "Hardware health, uptime, calibration and firmware status.", tag: "On demand" },
];

function Reports() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Documents" title="Reports" description="Generate professional, export-ready reports." right={<StatusPill tone="info">6 templates</StatusPill>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((r, i) => (
          <GlassCard key={r.title} delay={i * 0.04}>
            <div className="inline-flex items-center rounded-full border border-cyan/25 bg-cyan/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-cyan">{r.tag}</div>
            <div className="mt-3 font-display text-lg font-semibold">{r.title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <BtnIcon icon={FileText}>PDF</BtnIcon>
              <BtnIcon icon={FileSpreadsheet}>Excel</BtnIcon>
              <BtnIcon icon={Download}>CSV</BtnIcon>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function BtnIcon({ icon: I, children }: { icon: any; children: React.ReactNode }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-foreground/85 transition hover:border-cyan/30 hover:text-foreground">
      <I className="h-3 w-3" /> {children}
    </button>
  );
}
