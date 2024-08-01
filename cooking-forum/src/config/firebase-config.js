import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBCcBfVihNGSboXxGRo_aS8-71dFgL8k_g",
  authDomain: "webteamproject2.firebaseapp.com",
  projectId: "webteamproject2",
  storageBucket: "webteamproject2.appspot.com",
  messagingSenderId: "352863300996",
  appId: "1:352863300996:web:8ed587c419b8df7924c1d1",
  // measurementId: "G-1BLW2S4JLH",
  databaseURL: "https://webteamproject2-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);