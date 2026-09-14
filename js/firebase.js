// Sales Tracker
// Firebase configuration and initialization

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKTh3mipwCyjwnUeffmE_cpHbYwmWb8dI",
  authDomain: "sales-tracker-24b20.firebaseapp.com",
  projectId: "sales-tracker-24b20",
  storageBucket: "sales-tracker-24b20.firebasestorage.app",
  messagingSenderId: "697672956513",
  appId: "1:697672956513:web:a06c5020b93eb7bba58820"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
