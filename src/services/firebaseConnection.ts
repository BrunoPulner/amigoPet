import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUwBKG_lQwUq1vMHN5-Ike7jAuJrK-9-k",
  authDomain: "amigopet-reboucas.firebaseapp.com",
  projectId: "amigopet-reboucas",
  storageBucket: "amigopet-reboucas.firebasestorage.app",
  messagingSenderId: "376980963511",
  appId: "1:376980963511:web:826a1762381c1d4869cd32",
  measurementId: "G-XQS943E43B",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);