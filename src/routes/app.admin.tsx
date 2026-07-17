import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/app/admin")({ component: Admin });

const users = [
  { name: "Aditi Rao", role: "Admin", email: "aditi@hydrovision.ai", status: "Active" },
  { name: "Vikram Mehta", role: "Analyst", email: "vikram@hydrovision.ai", status: "Active" },
  { name: "Sara Iyer", role: "Field Ops", email: "sara@hydrovision.ai", status: "Away" },
  { name: "Rahul Nair", role: "Viewer", email: "rahul@hydrovision.ai", status: "Active" },
];

const audit = [
  { t: "12:04", who: "aditi", e: "Rotated Firebase API key" },
  { t: "11:42", who: "vikram", e: "Exported monthly report · PDF" },
  { t: "10:31", who: "system", e: "Model retrained (RF · v2.3)" },
  { t: "09:15", who: "sara", e: "Acknowledged critical alert on HV-002" },
];

function Admin() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle eyebrow="Governance" title="Admin Panel" description="Users, permissions, devices and audit trail." right={<StatusPill tone="good"><ShieldCheck className="h-3 w-3" /> Secure</StatusPill>} />

      <GlassCard>
        <div className="mb-3 text-xs uppercase tracking-wider text-cyan/80">Users</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="pb-2">Name</th><th>Role</th><th>Email</th><th>Status</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email} className="border-t border-white/[0.06]">
                  <td className="py-2.5 font-medium">{u.name}</td>
                  <td className="text-muted-foreground">{u.role}</td>
                  <td className="text-muted-foreground">{u.email}</td>
                  <td><StatusPill tone={u.status === "Active" ? "good" : "muted"}>{u.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard delay={0.05}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Permissions</div>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {["Manage users", "Manage stations", "Access reports", "Rotate API keys", "Firmware OTA"].map((p) => (
              <li key={p} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span>{p}</span><StatusPill tone="good">Allowed</StatusPill>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard delay={0.1}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Device access</div>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {["HV-001", "HV-002", "HV-003", "HV-005"].map((d) => (
              <li key={d} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span>{d}</span><StatusPill tone="info">Full</StatusPill>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard delay={0.15}>
          <div className="text-xs uppercase tracking-wider text-cyan/80">Audit trail</div>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {audit.map((a, i) => (
              <li key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{a.t}</span> · <span>{a.who}</span>
                </div>
                <div className="text-sm text-foreground/90">{a.e}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
