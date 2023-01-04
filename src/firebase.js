// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBiVwrqaoBtiEMIwG9mTVGs5AoiSSt9DNA",
  authDomain: "projects-86d58.firebaseapp.com",
  projectId: "projects-86d58",
  storageBucket: "projects-86d58.appspot.com",
  messagingSenderId: "167570515418",
  appId: "1:167570515418:web:e36fee3281bf91c0a98ce3",
  measurementId: "G-D60DN92S20",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
//const analytics = getAnalytics(app);
