// Sales Tracker
// Sales data module

import { db } from "./firebase.js";

import {
  collection,
  doc,
  runTransaction,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// Record a completed sale
export async function recordSale({
  businessId,
  sellerId,
  items,
  paymentMethod
}) {
  if (!businessId) {
    throw new Error("Business ID is required.");
  }

  if (!sellerId) {
    throw new Error("Seller ID is required.");
  }

  if (!items || items.length === 0) {
    throw new Error("A sale must contain at least one item.");
  }

  const saleRef = doc(
    collection(db, "businesses", businessId, "sales")
  );

  await runTransaction(db, async (transaction) => {
    const saleItems = [];
    let total = 0;

    for (const item of items) {
      const productRef = doc(
        db,
        "businesses",
        businessId,
        "products",
        item.productId
      );

      const productSnapshot = await transaction.get(productRef);

      if (!productSnapshot.exists()) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const product = productSnapshot.data();

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Quantity must be a positive whole number.");
      }

      const currentStock = Number(product.stock) || 0;

      if (currentStock < quantity) {
        throw new Error(
          `Not enough stock for ${product.name}. Available: ${currentStock}`
        );
      }

      const price = Number(product.price) || 0;
      const lineTotal = price * quantity;

      saleItems.push({
        productId: item.productId,
        name: product.name,
        price,
        quantity,
        lineTotal
      });

      total += lineTotal;

      transaction.update(productRef, {
        stock: currentStock - quantity,
        updatedBy: sellerId,
        updatedAt: serverTimestamp()
      });
    }

    transaction.set(saleRef, {
      items: saleItems,
      total,
      paymentMethod: paymentMethod || "cash",
      status: "completed",
      createdBy: sellerId,
      createdAt: serverTimestamp()
    });
  });

  return saleRef.id;
}
