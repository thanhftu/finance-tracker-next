// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwR0il3lIZvbIPhLMVUMzdfj2tMvdd3J0",
  authDomain: "finance-tracker-next.firebaseapp.com",
  projectId: "finance-tracker-next",
  storageBucket: "finance-tracker-next.appspot.com",
  messagingSenderId: "93140707376",
  appId: "1:93140707376:web:1ddcfb3ebaed34370fa5f5",
  measurementId: "G-M8CGRDZY96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)


// const analytics = getAnalytics(app);