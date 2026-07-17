// Mock data mimicking Firebase RTDB "hydrovision" structure.
// Wire replace: swap generators with `onValue(ref(db, 'hydrovision/current'), ...)`.

export type Status = "GOOD" | "WARNING" | "CRITICAL";

export interface CurrentReading {
  temperature: number;
  ph: number;
  ph_adc: number;
  tds: number;
  tds_adc: number;
  ntu: number;
  turb_adc: number;
  wqi: number;
  water_health_score: number;
  status: Status;
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Prediction {
  risk: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  recommendation: string;
  algal_bloom_probability: number;
  water_safety: number;
  future_prediction_24h: number;
  future_prediction_48h: number;
  future_prediction_72h: number;
}

export const current: CurrentReading = {
  temperature: 24.6,
  ph: 7.2,
  ph_adc: 2048,
  tds: 312,
  tds_adc: 1420,
  ntu: 3.4,
  turb_adc: 890,
  wqi: 82,
  water_health_score: 88,
  status: "GOOD",
  latitude: 12.9716,
  longitude: 77.5946,
  timestamp: Date.now(),
};

export const prediction: Prediction = {
  risk: "LOW",
  confidence: 95,
  recommendation: "Water quality is safe. Continue routine monitoring of TDS and turbidity.",
  algal_bloom_probability: 18,
  water_safety: 92,
  future_prediction_24h: 84,
  future_prediction_48h: 81,
  future_prediction_72h: 79,
};

export function makeHistory(points = 48, base = 24.5, jitter = 1.4) {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const t = new Date(now - (points - i) * 60 * 60 * 1000);
    const temp = base + Math.sin(i / 4) * jitter + (Math.random() - 0.5) * 0.4;
    const ph = 7.2 + Math.sin(i / 6) * 0.25 + (Math.random() - 0.5) * 0.1;
    const tds = 300 + Math.sin(i / 5) * 30 + (Math.random() - 0.5) * 12;
    const ntu = 3 + Math.cos(i / 4) * 1.4 + (Math.random() - 0.5) * 0.3;
    const wqi = 82 + Math.sin(i / 3) * 6 + (Math.random() - 0.5) * 2;
    return {
      t: t.toISOString(),
      label: `${t.getHours().toString().padStart(2, "0")}:00`,
      temperature: +temp.toFixed(2),
      ph: +ph.toFixed(2),
      tds: +tds.toFixed(0),
      ntu: +ntu.toFixed(2),
      wqi: +wqi.toFixed(1),
    };
  });
}

export const stations = [
  { id: "HV-001", name: "Ulsoor Lake North", lat: 12.9829, lng: 77.6197, status: "ONLINE", battery: 87, wqi: 82, updated: "2m ago" },
  { id: "HV-002", name: "Bellandur Inlet", lat: 12.9366, lng: 77.6742, status: "ONLINE", battery: 64, wqi: 41, updated: "4m ago" },
  { id: "HV-003", name: "Hebbal Reservoir", lat: 13.0450, lng: 77.5960, status: "ONLINE", battery: 92, wqi: 74, updated: "1m ago" },
  { id: "HV-004", name: "Varthur Lake", lat: 12.9410, lng: 77.7410, status: "OFFLINE", battery: 12, wqi: 0, updated: "2h ago" },
  { id: "HV-005", name: "Sankey Tank", lat: 13.0090, lng: 77.5710, status: "ONLINE", battery: 78, wqi: 88, updated: "3m ago" },
];

export const alerts = [
  { id: 1, severity: "critical" as const, title: "High TDS detected", station: "HV-002", time: "12m ago", ack: false },
  { id: 2, severity: "medium" as const, title: "Turbidity spike", station: "HV-003", time: "34m ago", ack: false },
  { id: 3, severity: "critical" as const, title: "Possible algal bloom", station: "HV-002", time: "1h ago", ack: false },
  { id: 4, severity: "low" as const, title: "GPS drift detected", station: "HV-005", time: "2h ago", ack: true },
  { id: 5, severity: "medium" as const, title: "Sensor calibration due", station: "HV-001", time: "3h ago", ack: true },
  { id: 6, severity: "critical" as const, title: "Station offline", station: "HV-004", time: "2h ago", ack: false },
];
