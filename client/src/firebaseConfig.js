import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCho3dcQo7abTEFCbSDxdy7U2Lcdq4drjM",
  authDomain: "fakey-fb622.firebaseapp.com",
  projectId: "fakey-fb622",
  storageBucket: "fakey-fb622.appspot.com",
  messagingSenderId: "893717719884",
  appId: "1:893717719884:web:f8432c774ecb122d547de9",
  measurementId: "G-SGLQLZV7DG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const Firebase = app;
