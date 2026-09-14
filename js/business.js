// Sales Tracker
// Business module

import { auth, db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Get the currently logged-in user's profile
export async function getUserProfile() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No user is currently logged in.");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    throw new Error("User profile was not found.");
  }

  return {
    id: userSnapshot.id,
    ...userSnapshot.data()
  };
}

// Get the business belonging to the current user
export async function getCurrentBusiness() {
  const userProfile = await getUserProfile();

  if (!userProfile.businessId) {
    throw new Error("No business is assigned to this user.");
  }

  const businessRef = doc(
    db,
    "businesses",
    userProfile.businessId
  );

  const businessSnapshot = await getDoc(businessRef);

  if (!businessSnapshot.exists()) {
    throw new Error("Business was not found.");
  }

  return {
    id: businessSnapshot.id,
    ...businessSnapshot.data()
  };
}

// Get the current business ID
export async function getCurrentBusinessId() {
  const business = await getCurrentBusiness();

  return business.id;
}
