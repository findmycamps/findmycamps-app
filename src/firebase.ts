import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBWWySUe4OohnxU3AjZ17fzkw5QypoUJso",
  authDomain: "findmycamps-a679d.firebaseapp.com",
  projectId: "findmycamps-a679d",
  storageBucket: "findmycamps-a679d.appspot.com",
  messagingSenderId: "626000402198",
  appId: "1:626000402198:web:794d15bdeee89d65752237",
  measurementId: "G-9J3TS901NX",
};

// Prevent duplicate app initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optional: Analytics (safe for browser only)
let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((enabled) => {
  if (enabled) {
    analytics = getAnalytics(app);
  }
});

export { app, db, analytics };
