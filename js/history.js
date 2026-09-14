// Sales Tracker
// Sales history data module

import { db } from "./firebase.js";

import {
  collection,
  getDocs
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

  const snapshot = await getDocs(salesRef);

  const sales = snapshot.docs.map((saleDoc) => {
    const sale = saleDoc.data();

    return {
      id: saleDoc.id,

      businessId: sale.businessId || businessId,

      items: (sale.items || []).map((item) => ({
        productId: item.productId || null,
        name: item.name || "",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity ?? item.qty) || 0,
        lineTotal:
          Number(item.lineTotal) ||
          (Number(item.price) || 0) *
          (Number(item.quantity ?? item.qty) || 0)
      })),

      total:
  Number(sale.total) ||
  Number(sale.paid) ||
  (sale.items || []).reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity ?? item.qty) || 0;

    return sum + (price * quantity);
  }, 0),

      paymentMethod:
        sale.paymentMethod ||
        getLegacyPaymentMethod(sale.payments),

      status: sale.status || "completed",

      createdBy:
        sale.createdBy ||
        sale.soldBy ||
        null,

      createdAt:
        sale.createdAt ||
        sale.date ||
        null
    };
  });

  // Newest sales first.
  sales.sort((a, b) => {
    return getSaleTime(b.createdAt) - getSaleTime(a.createdAt);
  });

  return sales;
}


// Convert old payment information into one payment method
function getLegacyPaymentMethod(payments) {
  if (!payments) {
    return "cash";
  }

  if (Number(payments.mpesa) > 0) {
    return "mpesa";
  }

  if (Number(payments.bank) > 0) {
    return "bank";
  }

  return "cash";
}


// Convert Firestore timestamps and old date strings
// into a number that can be used for sorting.
function getSaleTime(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}
