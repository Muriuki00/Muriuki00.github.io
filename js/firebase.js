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
  // Firebase configuration will go here
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
