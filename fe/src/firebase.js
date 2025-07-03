import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "munch-quest.firebaseapp.com",
  projectId: "munch-quest",
  storageBucket: "munch-quest.firebasestorage.app",
  messagingSenderId: "1091387439435",
  appId: import.meta.env.VITE_API_ID,
  measurementId:import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

//to signout, have instance of auth.
export const auth = getAuth(app);