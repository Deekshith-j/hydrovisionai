import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { db, hasFirebaseCredentials } from "../lib/firebase";
import { firebaseService } from "../services/firebaseService";
import { 
  current as mockCurrent, 
  prediction as mockPrediction, 
  stations as mockStations, 
  alerts as mockAlerts,
  makeHistory,
  type CurrentReading,
  type Prediction
} from "../lib/hv-data";
import { type WaterAlert } from "../lib/database";

interface FirebaseContextType {
  current: CurrentReading;
  prediction: Prediction;
  stations: any[];
  alerts: any[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  isFirebaseActive: boolean;
  updateCurrent: (newReading: Partial<CurrentReading>) => Promise<void>;
  updatePrediction: (newPrediction: Partial<Prediction>) => Promise<void>;
  ackAlert: (alertId: string | number) => Promise<void>;
}

export const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [current, setCurrent] = useState<CurrentReading>(mockCurrent);
  const [prediction, setPrediction] = useState<Prediction>(mockPrediction);
  const [stations, setStations] = useState<any[]>(mockStations);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState(hasFirebaseCredentials && !!db);

  const lastSavedTimestamp = useRef<number | null>(null);
  const lastAlertTimestamp = useRef<number | null>(null);

  useEffect(() => {
    // 1. If Firebase is active and initialized, listen to data
    if (isFirebaseActive && db) {
      setLoading(true);
      
      // A. Setup Connection Listener via .info/connected
      const connectedRef = ref(db, ".info/connected");
      const unsubConnected = onValue(connectedRef, (snap) => {
        setIsConnected(snap.val() === true);
      });

      // Initialize/Authenticate & Seed defaults if missing
      firebaseService.initialize().catch((err) => {
        console.error("Auth error, continuing with DB listeners:", err);
      });

      // Seed current telemetry if not existing
      get(ref(db, "current")).then((snap) => {
        if (!snap.exists()) {
          set(ref(db, "current"), mockCurrent);
        }
      });

      // Seed prediction & stations if not existing
      get(ref(db, "stations")).then((snap) => {
        if (!snap.exists()) {
          set(ref(db, "stations"), mockStations);
        }
      });
      get(ref(db, "prediction")).then((snap) => {
        if (!snap.exists()) {
          set(ref(db, "prediction"), mockPrediction);
        }
      });

      // Seed history records if empty
      get(ref(db, "history")).then((snap) => {
        if (!snap.exists()) {
          const initialHistory = makeHistory(24);
          const historyUpdate: Record<string, any> = {};
          initialHistory.forEach((h, i) => {
            const ts = Math.floor((Date.now() - (24 - i) * 3600 * 1000) / 1000);
            historyUpdate[ts] = {
              temperature: h.temperature,
              ph: h.ph,
              tds: h.tds,
              ntu: h.ntu,
              wqi: h.wqi,
              state: h.wqi >= 80 ? "GOOD" : h.wqi >= 60 ? "POOR" : "UNSAFE",
              latitude: mockCurrent.latitude + (Math.random() - 0.5) * 0.01,
              longitude: mockCurrent.longitude + (Math.random() - 0.5) * 0.01,
              altitude: 0,
              speed: 0,
              satellites: 8
            };
          });
          set(ref(db, "history"), historyUpdate);
        }
      });

      // Seed alerts database path if empty
      get(ref(db, "history/alerts")).then((snap) => {
        if (!snap.exists()) {
          const alertsUpdate: Record<string, any> = {};
          mockAlerts.forEach((a) => {
            const ts = Date.now() - (a.id * 10 * 60 * 1000);
            alertsUpdate[ts] = {
              title: a.title,
              description: `Incidence reported for ${a.station}. Critical parameter thresholds crossed.`,
              severity: a.severity,
              timestamp: ts,
              ack: a.ack
            };
          });
          set(ref(db, "history/alerts"), alertsUpdate);
        }
      });

      // B. Setup Current Telemetry Listener
      const unsubCurrent = firebaseService.listenCurrent((data) => {
        if (data) {
          setCurrent((prev) => ({ ...prev, ...data }));
          
          // Automatic History Storage: Triggered on client side
          const ts = data.timestamp;
          if (ts && ts !== lastSavedTimestamp.current) {
            lastSavedTimestamp.current = ts;
            firebaseService.pushHistory(data).catch((err) => {
              console.error("Failed to automatically copy history:", err);
            });
          }

          // Automatic Alert checking
          // WQI < 60 OR state == POOR OR state == UNSAFE
          const wqi = data.wqi;
          const state = data.state || (data as any).status || "GOOD";
          if ((wqi < 60 || state === "POOR" || state === "UNSAFE") && ts !== lastAlertTimestamp.current) {
            lastAlertTimestamp.current = ts;
            const severity = (wqi < 50 || state === "UNSAFE") ? "critical" : "medium";
            const alertPayload: WaterAlert = {
              timestamp: ts,
              title: wqi < 60 ? "Critical WQI Alert" : "Unsafe Water Quality",
              description: `Sensor reading: WQI is ${wqi} (${state}). Temp: ${data.temperature}°C, pH: ${data.ph}, TDS: ${data.tds}ppm, NTU: ${data.ntu}.`,
              severity,
              ack: false,
            };
            firebaseService.pushAlert(alertPayload).catch((err) => {
              console.error("Failed to save alert:", err);
            });
          }
        }
      });

      // C. Setup History Listener
      // To get static list of alerts & other paths
      const unsubStations = onValue(ref(db, "stations"), (snap) => {
        if (snap.exists()) {
          const val = snap.val();
          setStations(Array.isArray(val) ? val : Object.values(val));
        }
      });

      const unsubPrediction = onValue(ref(db, "prediction"), (snap) => {
        if (snap.exists()) {
          setPrediction(snap.val());
        }
      });

      // D. Setup Alerts Listener
      const unsubAlerts = firebaseService.listenAlerts((list) => {
        setAlerts(list);
        setLoading(false);
      });

      return () => {
        unsubConnected();
        unsubCurrent();
        unsubStations();
        unsubPrediction();
        unsubAlerts();
      };
    } else {
      // 2. Simulation / Mock Data Fallback Mode
      setLoading(false);
      setIsConnected(true); // Treat local as connected
      
      // Initialize alerts with mock list
      setAlerts(mockAlerts);

      const interval = setInterval(() => {
        setCurrent((prev) => {
          const nextTemp = +(prev.temperature + (Math.random() - 0.5) * 0.2).toFixed(1);
          const nextPh = +(Math.max(4.5, Math.min(10.5, prev.ph + (Math.random() - 0.5) * 0.1))).toFixed(2);
          const nextTds = Math.max(80, Math.min(800, prev.tds + Math.round((Math.random() - 0.5) * 6)));
          const nextNtu = +(Math.max(0.2, Math.min(15, prev.ntu + (Math.random() - 0.5) * 0.25))).toFixed(2);
          
          // Calculate mock WQI dynamically
          let nextWqi = 85;
          if (nextPh < 6.5 || nextPh > 8.5) nextWqi -= 15;
          if (nextTds > 500) nextWqi -= 20;
          if (nextNtu > 5) nextWqi -= 20;
          nextWqi = Math.max(10, Math.min(100, nextWqi + Math.round((Math.random() - 0.5) * 2)));

          // Derive Water State
          let nextState = "GOOD";
          if (nextWqi < 60) nextState = "POOR";
          if (nextWqi < 45 || nextPh < 5.0 || nextPh > 9.5) nextState = "UNSAFE";

          const nextTs = Date.now();

          const updatedCurrent: CurrentReading = {
            ...prev,
            temperature: nextTemp,
            ph: nextPh,
            tds: nextTds,
            ntu: nextNtu,
            wqi: nextWqi,
            state: nextState,
            timestamp: nextTs,
          };

          // Handle simulated alert generation
          if (nextWqi < 60 || nextState === "POOR" || nextState === "UNSAFE") {
            const severity = (nextWqi < 50 || nextState === "UNSAFE") ? "critical" : "medium";
            const newSimAlert = {
              id: nextTs.toString(),
              timestamp: nextTs,
              title: nextWqi < 60 ? "Critical WQI Violation (Simulated)" : "Unsafe Water (Simulated)",
              description: `Simulated threshold crossed! WQI: ${nextWqi}, State: ${nextState}. pH: ${nextPh}, TDS: ${nextTds}ppm.`,
              severity,
              ack: false
            };
            setAlerts((prevAlerts) => [newSimAlert, ...prevAlerts]);
          }

          return updatedCurrent;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isFirebaseActive]);

  // Operations
  const updateCurrent = async (newReading: Partial<CurrentReading>) => {
    if (isFirebaseActive && db) {
      await set(ref(db, "current"), { ...current, ...newReading });
    } else {
      setCurrent((prev) => ({ ...prev, ...newReading }));
    }
  };

  const updatePrediction = async (newPrediction: Partial<Prediction>) => {
    if (isFirebaseActive && db) {
      await set(ref(db, "prediction"), { ...prediction, ...newPrediction });
    } else {
      setPrediction((prev) => ({ ...prev, ...newPrediction }));
    }
  };

  const ackAlert = async (alertId: string | number) => {
    if (isFirebaseActive && db) {
      await firebaseService.ackAlert(alertId.toString());
    } else {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId || a.timestamp === alertId ? { ...a, ack: true } : a))
      );
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        current,
        prediction,
        stations,
        alerts,
        loading,
        error,
        isConnected,
        isFirebaseActive,
        updateCurrent,
        updatePrediction,
        ackAlert,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export function useHydroData() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useHydroData must be used within a FirebaseProvider");
  }
  return context;
}
