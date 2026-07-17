import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function Sparkline({
  data,
  dataKey,
  color = "var(--color-cyan)",
  height = 56,
}: {
  data: Array<Record<string, any>>;
  dataKey: string;
  color?: string;
  height?: number;
}) {
  const gid = `spark-${dataKey}-${color.replace(/[^a-z]/gi, "")}`;
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gid})`}
            isAnimationActive
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
