import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBNRfhFWaYXDrgR01Y0quCn5pcfCI57vTg",
  authDomain: "final-project-tasklist.firebaseapp.com",
  projectId: "final-project-tasklist",
  storageBucket: "final-project-tasklist.firebasestorage.app",
  messagingSenderId: "230196433119",
  appId: "1:230196433119:web:284ba430095ff8a380d96a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)