import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGYPL7zgwth-g3OlKV-DXOmClNyHmZ6YU",
  authDomain: "elpatron-946d7.firebaseapp.com",
  projectId: "elpatron-946d7",
  storageBucket: "elpatron-946d7.firebasestorage.app",
  messagingSenderId: "1029129714663",
  appId: "1:1029129714663:web:159c822d0cb026c3d45b42",
  measurementId: "G-PWRYMEG6JB",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

isSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(firebaseApp);
    }
  })
  .catch(() => {
    // Analytics not supported (SSR or blocked). Ignore.
  });
