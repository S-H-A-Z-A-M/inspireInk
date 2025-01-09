// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-15ad3.firebaseapp.com",
  projectId: "mern-blog-15ad3",
  storageBucket: "mern-blog-15ad3.firebasestorage.app",
  messagingSenderId: "932704085644",
  appId: "1:932704085644:web:dab67903b37baec3bafda9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);