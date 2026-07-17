import { useContext } from "react";
import { FirebaseContext } from "../context/FirebaseContext";

export function useRealtimeData() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useRealtimeData must be used within a FirebaseProvider");
  }
  return {
    current: context.current,
    loading: context.loading,
    error: context.error,
    isConnected: context.isConnected,
    isFirebaseActive: context.isFirebaseActive,
    updateCurrent: context.updateCurrent,
  };
}
