import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCTgPHIaw0duOb14YRWsLRA8LYKnG5EnPg",
  authDomain: "teleremate-a72e2.firebaseapp.com",
  projectId: "teleremate-a72e2",
  storageBucket: "teleremate-a72e2.firebasestorage.app",
  messagingSenderId: "952040424972",
  appId: "1:952040424972:web:69c49214f403ab2fbdd029",
  measurementId: "G-THT3TB11PM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

export const VAPID_KEY = "BBGLyyhDEq6api0qr6Se20Hsx9ZOzq51NYUaJ9v0t5AYyxvFKk2lHHKKIkUUqKmfWsZLzhrLj2zTFQU-6IK7c6c";

export { getToken, onMessage };
