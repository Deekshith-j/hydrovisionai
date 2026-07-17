import { useEffect, useState, useMemo } from "react";
import { firebaseService } from "../services/firebaseService";
import { makeHistory } from "../lib/hv-data";

export type FilterType = "hour" | "day" | "week" | "month" | "custom";

export interface HistoryPoint {
  timestamp: number;
  label: string;
  temperature: number;
  ph: number;
  tds: number;
  ntu: number;
  wqi: number;
  state: string;
  latitude?: number;
  longitude?: number;
}

export function useHistory() {
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("day");
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date(),
  });

  const isActive = firebaseService.hasCredentials;

  useEffect(() => {
    if (isActive) {
      setLoading(true);
      // Listen to last 1000 items in RTDB
      const unsub = firebaseService.listenHistory((list) => {
        const formatted: HistoryPoint[] = list.map((item) => {
          // Normalize timestamp from seconds to milliseconds if needed
          const ms = item.timestamp < 200000000000 ? item.timestamp * 1000 : item.timestamp;
          const dateObj = new Date(ms);
          
          return {
            timestamp: ms,
            label: `${dateObj.getHours().toString().padStart(2, "0")}:00`,
            temperature: item.temperature,
            ph: item.ph,
            tds: item.tds,
            ntu: item.ntu,
            wqi: item.wqi,
            state: item.state || "GOOD",
            latitude: item.latitude,
            longitude: item.longitude,
          };
        });
        setHistoryData(formatted);
        setLoading(false);
      });
      return () => unsub();
    } else {
      // Fallback: Generate mock history matching standard structure
      const mockPoints = makeHistory(100); // 100 historical readings
      const formattedMock: HistoryPoint[] = mockPoints.map((item) => {
        const ms = new Date(item.t).getTime();
        return {
          timestamp: ms,
          label: item.label,
          temperature: item.temperature,
          ph: item.ph,
          tds: item.tds,
          ntu: item.ntu,
          wqi: item.wqi,
          state: item.wqi >= 80 ? "GOOD" : item.wqi >= 60 ? "POOR" : "UNSAFE",
        };
      });
      setHistoryData(formattedMock);
      setLoading(false);
    }
  }, [isActive]);

  // Apply filtering locally
  const filteredData = useMemo(() => {
    const now = Date.now();
    let cutoff = now - 24 * 60 * 60 * 1000; // default last day

    if (filter === "hour") {
      cutoff = now - 60 * 60 * 1000;
    } else if (filter === "day") {
      cutoff = now - 24 * 60 * 60 * 1000;
    } else if (filter === "week") {
      cutoff = now - 7 * 24 * 60 * 60 * 1000;
    } else if (filter === "month") {
      cutoff = now - 30 * 24 * 60 * 60 * 1000;
    } else if (filter === "custom") {
      const startMs = customRange.start.getTime();
      const endMs = customRange.end.getTime();
      return historyData.filter(
        (item) => item.timestamp >= startMs && item.timestamp <= endMs
      );
    }

    return historyData.filter((item) => item.timestamp >= cutoff);
  }, [historyData, filter, customRange]);

  // Generate sub-histories for simple Recharts integrations
  const temperatureHistory = useMemo(() => filteredData.map(d => ({ label: d.label, value: d.temperature })), [filteredData]);
  const phHistory = useMemo(() => filteredData.map(d => ({ label: d.label, value: d.ph })), [filteredData]);
  const tdsHistory = useMemo(() => filteredData.map(d => ({ label: d.label, value: d.tds })), [filteredData]);
  const ntuHistory = useMemo(() => filteredData.map(d => ({ label: d.label, value: d.ntu })), [filteredData]);
  const wqiHistory = useMemo(() => filteredData.map(d => ({ label: d.label, value: d.wqi })), [filteredData]);

  return {
    historyData: filteredData,
    rawHistoryData: historyData,
    temperatureHistory,
    phHistory,
    tdsHistory,
    ntuHistory,
    wqiHistory,
    loading,
    filter,
    setFilter,
    customRange,
    setCustomRange,
  };
}
