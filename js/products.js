// Sales Tracker
// Products data module

import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


// Get all products for a business
export async function getProducts(businessId) {
  const productsRef = collection(
    db,
    "businesses",
    businessId,
    "products"
  );

  const snapshot = await getDocs(productsRef);

  return snapshot.docs.map((productDoc) => ({
    id: productDoc.id,
    ...productDoc.data()
  }));
}


// Add a new product
export async function addProduct(businessId, product) {
  const productsRef = collection(
    db,
    "businesses",
    businessId,
    "products"
  );

  const newProduct = {
    name: product.name,
    price: product.price,
    stock: product.stock,
    createdBy: product.createdBy || null,
    createdAt: serverTimestamp()
  };

  const productRef = await addDoc(productsRef, newProduct);

  return productRef.id;
}


// Update an existing product
export async function updateProduct(businessId, productId, changes) {
  const productRef = doc(
    db,
    "businesses",
    businessId,
    "products",
    productId
  );

  await updateDoc(productRef, {
    ...changes,
    updatedAt: serverTimestamp()
  });
}


// Delete a product
export async function deleteProduct(businessId, productId) {
  const productRef = doc(
    db,
    "businesses",
    businessId,
    "products",
    productId
  );

  await deleteDoc(productRef);
}
