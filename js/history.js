// Sales Tracker
// Sales history data module

import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// Get sales history for a business
export async function getSalesHistory(businessId) {
  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  const salesRef = collection(
    db,
    "businesses",
    businessId,
    "sales"
  );

  const salesQuery = query(
    salesRef,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(salesQuery);

  return snapshot.docs.map((saleDoc) => ({
    id: saleDoc.id,
    ...saleDoc.data()
  }));
}
