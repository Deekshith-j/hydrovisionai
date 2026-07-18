import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionTitle } from "@/components/hv/GlassCard";
import { StatusPill } from "@/components/hv/StatusPill";
import { ComingSoon } from "@/components/hv/ComingSoon";

export const Route = createFileRoute("/app/settings")({ component: Settings });

function Row({ label, hint, control }: { label: string; hint?: string; control: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div>
        <div className="text-sm text-foreground">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      {control}
    </div>
  );
}

function Select({ options }: { options: string[] }) {
  return (
    <select className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs focus:border-cyan/40 focus:outline-none">
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function Settings() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle
        eyebrow="Preferences"
        title="Settings"
        description="Personalize your HydroVision console."
        right={<StatusPill tone="info">v1.0</StatusPill>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-3 text-xs uppercase tracking-wider text-cyan/80">
            Appearance & locale
          </div>
          <div className="flex flex-col gap-2">
            <Row
              label="Theme"
              hint="Dark by default"
              control={<Select options={["Dark", "Light", "System"]} />}
            />
            <Row
              label="Language"
              control={<Select options={["English", "हिन्दी", "தமிழ்", "Español"]} />}
            />
            <Row
              label="Units"
              hint="Temperature / concentration"
              control={<Select options={["Metric", "Imperial"]} />}
            />
          </div>
        </GlassCard>

        <GlassCard delay={0.05}>
          <div className="mb-3 text-xs uppercase tracking-wider text-cyan/80">Alert thresholds</div>
          <div className="flex flex-col gap-2">
            <Row
              label="TDS upper bound"
              control={
                <input
                  defaultValue={500}
                  className="w-24 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-right text-xs"
                />
              }
            />
            <Row
              label="Turbidity upper bound"
              control={
                <input
                  defaultValue={5}
                  className="w-24 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-right text-xs"
                />
              }
            />
            <Row
              label="pH range"
              control={
                <input
                  defaultValue="6.5 – 8.5"
                  className="w-32 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-right text-xs"
                />
              }
            />
          </div>
        </GlassCard>

        <GlassCard delay={0.05}>
          <div className="mb-3 text-xs uppercase tracking-wider text-cyan/80">
            Firebase configuration
          </div>
          <div className="flex flex-col gap-2">
            <Row
              label="Project ID"
              control={
                <code className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs">
                  hydrovision-prod
                </code>
              }
            />
            <Row
              label="Database URL"
              control={
                <code className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs">
                  hydrovision.firebaseio.com
                </code>
              }
            />
            <Row
              label="API keys"
              hint="Managed securely"
              control={<StatusPill tone="good">Rotated 3d ago</StatusPill>}
            />
          </div>
        </GlassCard>

        <GlassCard delay={0.1}>
          <div className="mb-3 text-xs uppercase tracking-wider text-cyan/80">AI settings</div>
          <div className="flex flex-col gap-2">
            <Row
              label="Primary model"
              control={<Select options={["Random Forest", "XGBoost", "LSTM Ensemble"]} />}
            />
            <Row
              label="Confidence threshold"
              control={
                <input
                  defaultValue={85}
                  className="w-24 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-right text-xs"
                />
              }
            />
            <Row label="Auto retrain" control={<StatusPill tone="good">Weekly</StatusPill>} />
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ComingSoon
          tag="Ready for AI Model"
          title="TinyML settings"
          description="On-device inference tuning arrives with the ESP32 model bundle."
        />
        <ComingSoon
          tag="Coming Soon"
          title="Export settings profile"
          description="Portable JSON export/import of your entire configuration."
        />
      </div>
    </div>
  );
}
