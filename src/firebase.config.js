// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs3eFPEbaDMsQQdBSn0yBqImL_jDzvATE",
  authDomain: "pay-bill-a10.firebaseapp.com",
  projectId: "pay-bill-a10",
  storageBucket: "pay-bill-a10.firebasestorage.app",
  messagingSenderId: "574441001369",
  appId: "1:574441001369:web:f9a78b9c2e8d86c09a0308",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
