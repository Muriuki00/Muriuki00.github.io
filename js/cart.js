// Sales Tracker
// Shopping cart module

// Current cart contents
let cartItems = [];

// Get everything currently in the cart
export function getCart() {
  return [...cartItems];
}

// Add a product to the cart
export function addToCart(product, quantity = 1) {
  if (!product || !product.id) {
    throw new Error("A valid product is required.");
  }

  const amount = Number(quantity);

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Quantity must be a positive whole number.");
  }

  const existingItem = cartItems.find(
    (item) => item.productId === product.id
  );

  if (existingItem) {
    existingItem.quantity += amount;
  } else {
    cartItems.push({
      productId: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      quantity: amount
    });
  }

  return getCart();
}

// Change the quantity of an item
export function updateCartQuantity(productId, quantity) {
  const amount = Number(quantity);

  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error("Quantity must be zero or a positive whole number.");
  }

  const item = cartItems.find(
    (cartItem) => cartItem.productId === productId
  );

  if (!item) {
    throw new Error("Item is not in the cart.");
  }

  if (amount === 0) {
    removeFromCart(productId);
  } else {
    item.quantity = amount;
  }

  return getCart();
}

// Remove an item from the cart
export function removeFromCart(productId) {
  cartItems = cartItems.filter(
    (item) => item.productId !== productId
  );

  return getCart();
}

// Empty the entire cart
export function clearCart() {
  cartItems = [];
}

// Calculate the cart total
export function getCartTotal() {
  return cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

// Check whether the cart has anything inside
export function isCartEmpty() {
  return cartItems.length === 0;
}
