// Sales Tracker
// Authentication

import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

// Current logged-in user
let currentUser = null;

// Listen for authentication changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;

  if (user) {
    console.log("User is logged in:", user.uid);
  } else {
    console.log("No user is logged in.");
  }
});

// Get the currently logged-in user
export function getCurrentUser() {
  return currentUser;
}

// Log the user out
export async function logout() {
  await signOut(auth);
}
