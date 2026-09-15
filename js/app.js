// Sales Tracker
// Main application controller

import { auth } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  logout
} from "./auth.js";

import {
  getCurrentBusiness
} from "./business.js";


// ==============================
// Application elements
// ==============================

const businessNameElement =
  document.getElementById("businessName");

const logoutButton =
  document.getElementById("logoutButton");


// ==============================
// Display business information
// ==============================

async function loadBusiness() {
  try {
    const business = await getCurrentBusiness();

    businessNameElement.textContent =
      business.name || "Sales Tracker";

    console.log("Current business:", business);

  } catch (error) {
    console.error(
      "Could not load business:",
      error
    );

    businessNameElement.textContent =
      "Sales Tracker";
  }
}


// ==============================
// Logout
// ==============================

logoutButton.addEventListener(
  "click",
  async () => {
    try {
      await logout();

      console.log("User logged out.");

    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }
);


// ==============================
// Authentication state
// ==============================

onAuthStateChanged(auth, async (user) => {

  if (user) {

    console.log(
      "Sales Tracker starting for user:",
      user.uid
    );

    await loadBusiness();

  } else {

    console.log(
      "Sales Tracker starting without a logged-in user."
    );

    businessNameElement.textContent =
      "Sales Tracker";
  }

});
