// Sales Tracker
// Main application controller

import { getCurrentUser } from "./auth.js";

// Start the application
function startApp() {
  const user = getCurrentUser();

  if (user) {
    console.log("Sales Tracker starting for user:", user.uid);
  } else {
    console.log("Sales Tracker starting without a logged-in user.");
  }
}

startApp();
