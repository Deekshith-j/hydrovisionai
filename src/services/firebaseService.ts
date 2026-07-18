import { connectFirebase, hasFirebaseCredentials, db, auth } from "../lib/firebase";
import {
  listenCurrentData,
  listenHistory,
  listenAlerts,
  saveHistory,
  saveAlert,
  acknowledgeAlert,
  getHistoryByDate,
  deleteOldHistory,
  type CurrentReading,
  type WaterAlert,
} from "../lib/database";

export const firebaseService = {
  /**
   * Flag indicating if credentials are provided in env
   */
  hasCredentials: hasFirebaseCredentials,

  /**
   * Initializes connections, performs anonymous authentication.
   */
  async initialize() {
    if (!hasFirebaseCredentials) {
      console.warn("Firebase credentials missing, running in Simulation Mode.");
      return null;
    }
    try {
      const user = await connectFirebase();
      console.log("Firebase connection established successfully. Authenticated anonymously.");
      return user;
    } catch (error) {
      console.error("Firebase service initialization failed:", error);
      throw error;
    }
  },

  /**
   * Subscribes to current reading changes
   */
  listenCurrent(callback: (data: CurrentReading) => void) {
    return listenCurrentData(callback);
  },

  /**
   * Subscribes to history changes
   */
  listenHistory(callback: (historyList: any[]) => void) {
    return listenHistory(callback);
  },

  /**
   * Subscribes to alerts
   */
  listenAlerts(callback: (alertsList: WaterAlert[]) => void) {
    return listenAlerts(callback);
  },

  /**
   * Saves historical readings
   */
  async pushHistory(data: CurrentReading) {
    await saveHistory(data);
    await deleteOldHistory();
  },

  /**
   * Saves dynamic alert
   */
  async pushAlert(alert: WaterAlert) {
    await saveAlert(alert);
  },

  /**
   * Acknowledges alerts
   */
  async ackAlert(alertId: string) {
    await acknowledgeAlert(alertId);
  },

  /**
   * Fetches historical ranges
   */
  async getHistoryRange(startDate: Date, endDate: Date) {
    return await getHistoryByDate(startDate, endDate);
  },
};
