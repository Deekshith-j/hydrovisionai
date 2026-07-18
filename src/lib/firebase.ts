import { type FirebaseApp } from "firebase/app";
import { type Database } from "firebase/database";
import { signInAnonymously, type Auth } from "firebase/auth";
import {
  app as jsApp,
  db as jsDb,
  auth as jsAuth,
  hasFirebaseCredentials as jsHasCredentials,
} from "../firebase/firebase.js";

export const app = jsApp as FirebaseApp | null;
export const db = jsDb as Database | null;
export const auth = jsAuth as Auth | null;
export const hasFirebaseCredentials = jsHasCredentials;

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

// Re-export the legacy hook from context to avoid breaking existing imports
export { useHydroData } from "../context/FirebaseContext";
