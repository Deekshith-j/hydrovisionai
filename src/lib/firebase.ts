import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, onValue, set, get, type Database } from "firebase/database";
import { getAuth, signInAnonymously, type Auth } from "firebase/auth";

// Firebase Config from env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Check if credentials exist (at least apiKey and databaseURL)
export const hasFirebaseCredentials = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_DATABASE_URL
);

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;

if (typeof window !== "undefined" && hasFirebaseCredentials) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getDatabase(app);
    auth = getAuth(app);
  } catch (err) {
    console.error("Failed to initialize Firebase:", err);
  }
}

/**
 * Anonymous Authentication sign-in helper
 */
export async function connectFirebase() {
  if (!hasFirebaseCredentials || !auth) {
    throw new Error("Firebase credentials missing or Firebase not initialized.");
  }
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Anonymous Auth Failed:", error);
    throw error;
  }
}

export { app, db, auth };

// Re-export the legacy hook from context to avoid breaking existing imports
export { useHydroData } from "../context/FirebaseContext";
