// Firebase Analytics Configuration
// Spark (Free) Plan - Frontend Only Integration

import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | undefined;
let analytics: Analytics | undefined;

// Initialize Firebase only on client-side
export const initFirebase = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!app) {
    app = initializeApp(firebaseConfig);
  }

  // Check if Analytics is supported (e.g., not blocked by ad blockers)
  const analyticsSupported = await isSupported();
  
  if (analyticsSupported && !analytics) {
    analytics = getAnalytics(app);
  }

  return analytics;
};

export const getFirebaseAnalytics = () => analytics;
