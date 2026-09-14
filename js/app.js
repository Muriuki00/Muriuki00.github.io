// Sales Tracker
// Main application controller

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import { auth } from "./firebase.js";

// Start the application after Firebase tells us
// whether a user is logged in.
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Sales Tracker starting for user:", user.uid);
  } else {
    console.log("Sales Tracker starting without a logged-in user.");
  }
});
