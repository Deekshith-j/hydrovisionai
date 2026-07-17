import { 
  ref, 
  onValue, 
  set, 
  get, 
  update, 
  query, 
  orderByKey, 
  limitToLast, 
  startAt, 
  endAt 
} from "firebase/database";
import { db } from "./firebase";

/**
 * Interface representing a water quality reading in Firebase
 */
export interface CurrentReading {
  temperature: number;
  ph: number;
  tds: number;
  ntu: number;
  wqi: number;
  state?: string; // e.g. GOOD, POOR, UNSAFE
  latitude: number;
  longitude: number;
  altitude?: number;
  speed?: number;
  satellites?: number;
  wifiStrength?: number;
  deviceStatus?: string;
  timestamp: number;
}

/**
 * Interface representing an Alert
 */
export interface WaterAlert {
  id?: string;
  timestamp: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "critical";
  ack?: boolean;
}

/**
 * Listen to current readings in real-time
 */
export function listenCurrentData(callback: (data: CurrentReading) => void) {
  if (!db) return () => {};
  const currentRef = ref(db, "current");
  return onValue(
    currentRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as CurrentReading);
      }
    },
    (err) => {
      console.error("Firebase listenCurrentData error:", err);
    }
  );
}

/**
 * Listen to history in real-time (up to latest 1000 entries)
 */
export function listenHistory(callback: (historyList: any[]) => void) {
  if (!db) return () => {};
  const historyRef = ref(db, "history");
  const historyQuery = query(historyRef, orderByKey(), limitToLast(1000));
  
  return onValue(
    historyQuery,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.entries(val)
          .filter(([key]) => key !== "alerts" && !isNaN(Number(key)))
          .map(([key, item]: [string, any]) => ({
            timestamp: Number(key),
            ...item,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        callback(list);
      } else {
        callback([]);
      }
    },
    (err) => {
      console.error("Firebase listenHistory error:", err);
    }
  );
}

/**
 * Listen to alerts under history in real-time
 */
export function listenAlerts(callback: (alertsList: WaterAlert[]) => void) {
  if (!db) return () => {};
  const alertsRef = ref(db, "history/alerts");
  return onValue(
    alertsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.entries(val).map(([key, item]: [string, any]) => ({
          id: key,
          ...item,
        })) as WaterAlert[];
        // Sort alerts by timestamp descending (newest first)
        list.sort((a, b) => b.timestamp - a.timestamp);
        callback(list);
      } else {
        callback([]);
      }
    },
    (err) => {
      console.error("Firebase listenAlerts error:", err);
    }
  );
}

/**
 * Save current reading to history
 */
export async function saveHistory(data: CurrentReading) {
  if (!db) return;
  // Use Unix timestamp in seconds as key
  const ts = data.timestamp;
  if (!ts) return;
  const historyRef = ref(db, `history/${ts}`);
  const snapshot = await get(historyRef);
  if (!snapshot.exists()) {
    await set(historyRef, {
      temperature: data.temperature,
      ph: data.ph,
      tds: data.tds,
      ntu: data.ntu,
      wqi: data.wqi,
      state: data.state || "GOOD",
      latitude: data.latitude,
      longitude: data.longitude,
      altitude: data.altitude || 0,
      speed: data.speed || 0,
      satellites: data.satellites || 0,
    });
  }
}

/**
 * Save an alert
 */
export async function saveAlert(alert: WaterAlert) {
  if (!db) return;
  const ts = alert.timestamp || Date.now();
  const alertRef = ref(db, `history/alerts/${ts}`);
  await set(alertRef, {
    title: alert.title,
    description: alert.description,
    severity: alert.severity,
    timestamp: ts,
    ack: alert.ack || false,
  });
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: string) {
  if (!db) return;
  const alertRef = ref(db, `history/alerts/${alertId}/ack`);
  await set(alertRef, true);
}

/**
 * Get history by date range
 */
export async function getHistoryByDate(startDate: Date, endDate: Date) {
  if (!db) return [];
  const startTs = Math.floor(startDate.getTime() / 1000);
  const endTs = Math.floor(endDate.getTime() / 1000);
  
  const historyRef = ref(db, "history");
  const rangeQuery = query(
    historyRef,
    orderByKey(),
    startAt(startTs.toString()),
    endAt(endTs.toString())
  );
  
  const snapshot = await get(rangeQuery);
  if (snapshot.exists()) {
    const val = snapshot.val();
    return Object.entries(val)
      .filter(([key]) => key !== "alerts" && !isNaN(Number(key)))
      .map(([key, item]: [string, any]) => ({
        timestamp: Number(key),
        ...item,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }
  return [];
}

/**
 * Delete older history items to maintain a limit of 1000 entries
 */
export async function deleteOldHistory() {
  if (!db) return;
  const historyRef = ref(db, "history");
  const snapshot = await get(historyRef);
  if (snapshot.exists()) {
    const val = snapshot.val();
    const keys = Object.keys(val).filter((key) => key !== "alerts" && !isNaN(Number(key)));
    if (keys.length > 1000) {
      keys.sort((a, b) => Number(a) - Number(b));
      const toDeleteCount = keys.length - 1000;
      const updates: Record<string, null> = {};
      for (let i = 0; i < toDeleteCount; i++) {
        updates[`history/${keys[i]}`] = null;
      }
      await update(ref(db), updates);
    }
  }
}
