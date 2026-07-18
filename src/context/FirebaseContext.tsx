import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { ref, onValue, set, get } from "firebase/database";
import { signInAnonymously } from "firebase/auth";
import { db, auth, hasFirebaseCredentials } from "../lib/firebase";
import { firebaseService } from "../services/firebaseService";
import {
  current as mockCurrent,
  prediction as mockPrediction,
  stations as mockStations,
  alerts as mockAlerts,
  type CurrentReading,
  type Prediction,
} from "../lib/hv-data";
import { type WaterAlert } from "../lib/database";

export interface DeviceInfo {
  status: string;
  lastSeen: number | string;
  firmware: string;
}

interface FirebaseContextType {
  current: CurrentReading;
  prediction: Prediction;
  stations: any[];
  alerts: any[];
  device: DeviceInfo;
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
  const [device, setDevice] = useState<DeviceInfo>({
    status: "Offline",
    lastSeen: "Never",
    firmware: "v1.0.0",
  });
  const [loading, setLoading] = useState(hasFirebaseCredentials && !!db);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState(hasFirebaseCredentials && !!db);

  useEffect(() => {
    let isSubscribed = true;

    if (isFirebaseActive && db && auth) {
      setLoading(true);

      // Track paths loaded to set loading to false
      let loadedCurrent = false;
      let loadedPrediction = false;
      let loadedStations = false;
      let loadedAlerts = false;
      let loadedDevice = false;

      const checkLoadingFinished = () => {
        if (
          isSubscribed &&
          loadedCurrent &&
          loadedPrediction &&
          loadedStations &&
          loadedAlerts &&
          loadedDevice
        ) {
          setLoading(false);
        }
      };

      // 1. Setup Connection Listener via .info/connected
      const connectedRef = ref(db, ".info/connected");
      const unsubConnected = onValue(connectedRef, (snap) => {
        if (isSubscribed) {
          setIsConnected(snap.val() === true);
        }
      });

      // 2. Setup Anonymous Auth with retry on failure
      const authenticateAnonymously = async () => {
        while (isSubscribed) {
          try {
            await signInAnonymously(auth);
            if (isSubscribed) {
              console.log("Firebase Anonymous Auth Successful");
              setError(null);
            }
            break;
          } catch (err) {
            console.error("Anonymous authentication failed, retrying in 5 seconds...", err);
            if (isSubscribed) {
              setError(err instanceof Error ? err.message : String(err));
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }
      };
      authenticateAnonymously();

      // 3. Setup Current Telemetry Listener
      const unsubCurrent = firebaseService.listenCurrent((data) => {
        if (isSubscribed && data) {
          setCurrent((prev) => ({ ...prev, ...data }));
          loadedCurrent = true;
          checkLoadingFinished();
        }
      });

      // 4. Setup Stations Listener
      const unsubStations = onValue(ref(db, "HydroVisionAI/stations"), (snap) => {
        if (isSubscribed) {
          if (snap.exists()) {
            const val = snap.val();
            setStations(Array.isArray(val) ? val : Object.values(val));
          }
          loadedStations = true;
          checkLoadingFinished();
        }
      });

      // 5. Setup Prediction Listener
      const unsubPrediction = onValue(ref(db, "HydroVisionAI/prediction"), (snap) => {
        if (isSubscribed) {
          if (snap.exists()) {
            setPrediction(snap.val());
          }
          loadedPrediction = true;
          checkLoadingFinished();
        }
      });

      // 6. Setup Alerts Listener
      const unsubAlerts = firebaseService.listenAlerts((list) => {
        if (isSubscribed) {
          setAlerts(list);
          loadedAlerts = true;
          checkLoadingFinished();
        }
      });

      // 7. Setup Device Info Listener
      const unsubDevice = onValue(ref(db, "HydroVisionAI/device"), (snap) => {
        if (isSubscribed) {
          if (snap.exists()) {
            setDevice(snap.val() as DeviceInfo);
          }
          loadedDevice = true;
          checkLoadingFinished();
        }
      });

      return () => {
        isSubscribed = false;
        unsubConnected();
        unsubCurrent();
        unsubStations();
        unsubPrediction();
        unsubAlerts();
        unsubDevice();
      };
    } else {
      // Simulation / Mock Data Fallback Mode
      setLoading(false);
      setIsConnected(true);
      setAlerts(mockAlerts);
      setDevice({
        status: "Connected",
        lastSeen: Date.now(),
        firmware: "v1.4.2",
      });

      const interval = setInterval(() => {
        if (!isSubscribed) return;
        setCurrent((prev) => {
          const nextTemp = +(prev.temperature + (Math.random() - 0.5) * 0.2).toFixed(1);
          const nextPh = +Math.max(
            4.5,
            Math.min(10.5, prev.ph + (Math.random() - 0.5) * 0.1),
          ).toFixed(2);
          const nextTds = Math.max(
            80,
            Math.min(800, prev.tds + Math.round((Math.random() - 0.5) * 6)),
          );
          const nextNtu = +Math.max(
            0.2,
            Math.min(15, prev.ntu + (Math.random() - 0.5) * 0.25),
          ).toFixed(2);

          let nextWqi = 85;
          if (nextPh < 6.5 || nextPh > 8.5) nextWqi -= 15;
          if (nextTds > 500) nextWqi -= 20;
          if (nextNtu > 5) nextWqi -= 20;
          nextWqi = Math.max(10, Math.min(100, nextWqi + Math.round((Math.random() - 0.5) * 2)));

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

          if (nextWqi < 60 || nextState === "POOR" || nextState === "UNSAFE") {
            const severity = nextWqi < 50 || nextState === "UNSAFE" ? "critical" : "medium";
            const newSimAlert = {
              id: nextTs.toString(),
              timestamp: nextTs,
              title:
                nextWqi < 60 ? "Critical WQI Violation (Simulated)" : "Unsafe Water (Simulated)",
              description: `Simulated threshold crossed! WQI: ${nextWqi}, State: ${nextState}. pH: ${nextPh}, TDS: ${nextTds}ppm.`,
              severity,
              ack: false,
            };
            setAlerts((prevAlerts) => [newSimAlert, ...prevAlerts]);
          }

          return updatedCurrent;
        });
      }, 5000);

      return () => {
        isSubscribed = false;
        clearInterval(interval);
      };
    }
  }, [isFirebaseActive]);

  // Operations
  const updateCurrent = async (newReading: Partial<CurrentReading>) => {
    if (isFirebaseActive && db) {
      await set(ref(db, "HydroVisionAI/current"), { ...current, ...newReading });
    } else {
      setCurrent((prev) => ({ ...prev, ...newReading }));
    }
  };

  const updatePrediction = async (newPrediction: Partial<Prediction>) => {
    if (isFirebaseActive && db) {
      await set(ref(db, "HydroVisionAI/prediction"), { ...prediction, ...newPrediction });
    } else {
      setPrediction((prev) => ({ ...prev, ...newPrediction }));
    }
  };

  const ackAlert = async (alertId: string | number) => {
    if (isFirebaseActive && db) {
      await firebaseService.ackAlert(alertId.toString());
    } else {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId || a.timestamp === alertId ? { ...a, ack: true } : a)),
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
        device,
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
