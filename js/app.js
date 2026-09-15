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

import {
  getProducts
} from "./products.js";


// ==============================
// Application elements
// ==============================

const businessNameElement =
  document.getElementById("businessName");

const logoutButton =
  document.getElementById("logoutButton");

const appContent =
  document.getElementById("appContent");


// ==============================
// Display business information
// ==============================

async function loadBusiness() {
  try {
    const business = await getCurrentBusiness();

    businessNameElement.textContent =
      business.name || "Sales Tracker";

    console.log("Current business:", business);

    return business;

  } catch (error) {
    console.error(
      "Could not load business:",
      error
    );

    businessNameElement.textContent =
      "Sales Tracker";

    return null;
  }
}


// ==============================
// Display products
// ==============================

function renderProducts(products) {

  if (!products || products.length === 0) {

    appContent.innerHTML = `
      <div class="no-products">
        No products found.
      </div>
    `;

    return;
  }


  const productsList =
    document.createElement("div");

  productsList.className =
    "products-list";


  products.forEach((product) => {

    const productCard =
      document.createElement("div");

    productCard.className =
      "product-card";


    const productInfo =
      document.createElement("div");

    productInfo.className =
      "product-info";


    const productName =
      document.createElement("h3");

    productName.className =
      "product-name";

    productName.textContent =
      product.name || "Unnamed product";


    const productPrice =
      document.createElement("div");

    productPrice.className =
      "product-price";

    productPrice.textContent =
      `KSh ${Number(product.price || 0).toLocaleString()}`;


    const productStock =
      document.createElement("div");

    productStock.className =
      "product-stock";

    productStock.textContent =
      `Stock: ${Number(product.stock || 0).toLocaleString()}`;


    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);
    productInfo.appendChild(productStock);


    productCard.appendChild(productInfo);

    productsList.appendChild(productCard);

  });


  appContent.innerHTML = "";

  appContent.appendChild(productsList);


  console.log(
    "Products displayed:",
    products
  );
}


// ==============================
// Load products for business
// ==============================

async function loadProducts(businessId) {

  try {

    const products =
      await getProducts(businessId);

    renderProducts(products);

  } catch (error) {

    console.error(
      "Could not load products:",
      error
    );

    appContent.innerHTML = `
      <div class="no-products">
        Could not load products.
      </div>
    `;
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

onAuthStateChanged(
  auth,
  async (user) => {

    if (user) {

      console.log(
        "Sales Tracker starting for user:",
        user.uid
      );


      const business =
        await loadBusiness();


      if (business) {

        await loadProducts(
          business.id
        );

      }

    } else {

      console.log(
        "Sales Tracker starting without a logged-in user."
      );

      businessNameElement.textContent =
        "Sales Tracker";

      appContent.innerHTML = `
        <div class="empty-state">
          Please log in to continue.
        </div>
      `;

    }

  }
);
