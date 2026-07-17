import { cn } from "@/lib/utils";

type Tone = "good" | "warn" | "bad" | "info" | "muted";

const tones: Record<Tone, string> = {
  good: "bg-emerald/15 text-emerald border-emerald/25",
  warn: "bg-warning/15 text-warning border-warning/25",
  bad: "bg-danger/15 text-danger border-danger/25",
  info: "bg-cyan/15 text-cyan border-cyan/25",
  muted: "bg-white/5 text-muted-foreground border-white/10",
};

export function StatusPill({
  tone = "info",
  children,
  dot = true,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "good" && "bg-emerald animate-pulse",
            tone === "warn" && "bg-warning animate-pulse",
            tone === "bad" && "bg-danger animate-pulse",
            tone === "info" && "bg-cyan animate-pulse",
            tone === "muted" && "bg-muted-foreground",
          )}
        />
      )}
      {children}
    </span>
  );
}
