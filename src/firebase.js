// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfEgkt-LkA9F5CriH8g1hrb-Q8LSzOcrE",
  authDomain: "students-list-7deac.firebaseapp.com",
  projectId: "students-list-7deac",
  storageBucket: "students-list-7deac.firebasestorage.app",
  messagingSenderId: "976038545146",
  appId: "1:976038545146:web:db345f46719ec1bd69eb43",
  measurementId: "G-23L7DM76NF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);