import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxr8ELxFIg9DEPzhLwb8q4eyJFOxlVFow",
  authDomain: "efms-31100.firebaseapp.com",
  databaseURL: "https://efms-31100-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "efms-31100",
  storageBucket: "efms-31100.firebasestorage.app",
  messagingSenderId: "969568204378",
  appId: "1:969568204378:web:bed2e0572728befe2f4a63",
  measurementId: "G-HXZW3KWMW4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);
