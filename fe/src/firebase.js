import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAGb1lZOk5q3lGv4etchqNwy_65JEwane0",
  authDomain: "munch-quest.firebaseapp.com",
  projectId: "munch-quest",
  storageBucket: "munch-quest.firebasestorage.app",
  messagingSenderId: "1091387439435",
  appId: "1:1091387439435:web:e67d62588d9a854580d0ce",
  measurementId: "G-9N404HB6LY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);