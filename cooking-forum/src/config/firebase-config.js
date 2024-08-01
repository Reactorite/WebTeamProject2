import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC2cLBFaSICqW0e7ISgJ5Wq-u3Np3dk2h8",
  authDomain: "not-twitter-a62.firebaseapp.com",
  projectId: "not-twitter-a62",
  storageBucket: "not-twitter-a62.appspot.com",
  messagingSenderId: "484648585008",
  appId: "1:484648585008:web:3c4d47b48c0686035beaf5",
  databaseURL: "https://not-twitter-a62-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// the Firebase authentication handler
export const auth = getAuth(app);
// the Realtime Database handler
export const db = getDatabase(app);