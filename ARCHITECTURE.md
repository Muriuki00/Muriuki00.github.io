# Sales Tracker — V1 Architecture

## 1. Product Purpose

Sales Tracker helps small businesses easily and efficiently manage and track their sales.

The V1 application focuses on four core activities:

1. Manage products and inventory
2. Record sales
3. View sales history
4. Secure business data through user roles and permissions

The application should remain simple for the business owner while having a foundation that can grow into a larger product.

---

## 2. Core Architecture Principle

Firebase is the primary source of truth for business data.

The browser/device is responsible for:

- User interface
- Current cart
- Temporary application state
- Local/offline data required to continue operating when connectivity is unavailable

Business data must not depend permanently on a particular device.

---

## 3. Technology Structure

### Frontend

- HTML — application structure
- CSS — visual design
- JavaScript modules — application logic

### Firebase

- Firebase Authentication — user identity
- Cloud Firestore — business data
- Firestore Security Rules — authorization
- Firebase Cloud Functions — secure server-side operations when required
- Firebase App Check — additional protection when appropriate

### Future integrations

- Safaricom Daraja API — M-Pesa payment requests
- Additional payment providers may be added later

---

## 4. User Model

A user has one Sales Tracker account.

A user may own or belong to multiple businesses.

Example:

User
- Business A — Owner
- Business B — Owner
- Business C — Staff

The user account identifies the person.

Business membership determines which business the person can access and what they are allowed to do.

---

## 5. Business Model

A business is the main container for business data.

Example:

businesses/
  business_001/
    name
    location
    createdAt
    createdBy

All business-specific records belong to a business.

A user's access to a business is determined through business membership.

---

## 6. Firestore Data Structure

The initial V1 structure is:

users/{userId}

businesses/{businessId}

businesses/{businessId}/members/{userId}

businesses/{businessId}/products/{productId}

businesses/{businessId}/sales/{saleId}

Business data should be scoped by businessId.

A user must never be able to access another business's private data unless they are explicitly a member of that business.

---

## 7. User Document

Path:

users/{userId}

Example fields:

- name
- email
- createdAt

The user document stores information about the person.

Business roles and permissions belong to business membership rather than being stored only on the user.

---

## 8. Business Membership

Path:

businesses/{businessId}/members/{userId}

Example:

{
  role: "owner",
  joinedAt: timestamp
}

Initial V1 roles:

### Owner

Can:

- Manage products
- View sales
- Make sales
- Void sales
- Manage business members

### Staff

Can:

- View products
- Make sales
- View permitted sales information

Staff cannot perform owner-only actions.

Permissions must ultimately be enforced through Firestore Security Rules.

The user interface may hide unavailable actions, but the security rules are the real protection.

---

## 9. Product Model

Path:

businesses/{businessId}/products/{productId}

Example:

{
  name: "Black T-Shirt",
  price: 1500,
  stock: 20,
  createdBy: "userId",
  createdAt: timestamp,
  updatedBy: "userId",
  updatedAt: timestamp
}

V1 product information:

- Name
- Selling price
- Stock quantity
- Created by
- Created date
- Last updated by
- Last updated date

Product document IDs should normally be generated automatically by Firestore.

---

## 10. Inventory

The product document stores the current stock quantity.

Example:

stock: 20

When a sale is completed, stock is reduced.

When a valid sale is voided, the appropriate stock is restored.

Future versions may introduce a dedicated inventory movement/history system.

The architecture should leave room for:

- Stock additions
- Stock reductions
- Manual adjustments
- Sale deductions
- Sale reversals

---

## 11. Cart

The cart is temporary application state.

The cart is local to the current user/device.

It is NOT shared between users.

Example:

Product
  ↓
Local cart
  ↓
Checkout
  ↓
Sale created in Firestore

A user's cart should not become business-wide data.

---

## 12. Sale Model

Path:

businesses/{businessId}/sales/{saleId}

A sale must contain enough information to understand exactly what happened.

Example:

{
  saleNumber: 42,
  date: "2026-09-14",
  createdAt: timestamp,
  createdBy: "userId",
  status: "completed",
  items: [
    {
      productId: "product_001",
      name: "Black T-Shirt",
      price: 1500,
      qty: 2
    }
  ],
  subtotal: 3000,
  discount: 0,
  total: 3000,
  payments: {
    cash: 3000,
    mpesa: 0,
    bank: 0
  }
}

A sale should preserve the product name and price at the time of sale.

This prevents historical sales from changing when the product's current name or price changes later.

---

## 13. Sale Audit Information

Every sale must answer:

- What was sold?
- How much was sold?
- When was it sold?
- Who sold it?
- How was it paid?
- What is its current status?

Important fields include:

- createdBy
- createdAt
- status

If a sale is voided, it must additionally record:

- voidedBy
- voidedAt

Optional future field:

- voidReason

Example:

{
  status: "voided",
  voidedBy: "userId",
  voidedAt: timestamp
}

The original seller must remain recorded even after a sale is voided.

---

## 14. Sale Status

Initial statuses:

- completed
- voided

Future payment workflows may introduce additional payment states such as:

- pending
- failed
- cancelled
- paid

A payment being initiated must not automatically mean that a sale has been successfully paid.

---

## 15. Payments

V1 supports recording:

- Cash
- M-Pesa
- Bank

Payment information belongs to the sale.

The application should be designed so payment methods can be expanded later.

For example:

- Card
- Multiple payment methods in one sale
- Automated M-Pesa payments

---

## 16. Future M-Pesa / Daraja Architecture

Daraja credentials and sensitive payment operations must not be placed in browser JavaScript.

The future architecture is:

Customer/Seller
  ↓
Sales Tracker
  ↓
Secure backend
  ↓
Safaricom Daraja
  ↓
Customer phone
  ↓
Daraja callback
  ↓
Secure backend
  ↓
Firestore
  ↓
Sales Tracker

The browser should never directly expose sensitive Daraja credentials.

---

## 17. Sale Number

Firestore document IDs and human-readable sale numbers serve different purposes.

Firestore should normally use automatically generated document IDs.

The sale should additionally have a human-readable saleNumber.

Example:

Sale #00042

The sale number is for users and business records.

The Firestore document ID is for database identification.

The system must prevent duplicate sale numbers within the same business.

---

## 18. Real-Time Data

Firestore should eventually use real-time listeners for data where immediate synchronization is valuable.

Examples:

- Product stock
- Product changes
- Sales
- Important business activity

Example:

Laptop
  ↓
Firestore
  ↓
Phone
  ↓
Updated stock

The user should not need to close and reopen the application to see important changes.

Real-time listeners should be used deliberately to avoid unnecessary reads and costs.

---

## 19. Offline Capability

Firebase remains the source of truth.

When network connectivity is unavailable, the application should provide an appropriate local/offline experience.

The offline system must:

- Preserve necessary local state
- Allow appropriate actions while offline
- Queue data that needs synchronization
- Synchronize when connectivity returns
- Avoid duplicate sales
- Handle synchronization failures safely

Offline functionality must not create a second permanent database that conflicts with Firestore.

---

## 20. Application State

Application state should be separated from UI rendering.

The application should have clear state for things such as:

- Current user
- Current business
- Current role
- Products
- Current cart
- Current sales/history data
- Connection state

Modules should communicate through clear functions and shared application state rather than relying on global variables or ad-hoc window properties.

---

## 21. JavaScript Module Responsibilities

### firebase.js

Responsible for:

- Firebase initialization
- Authentication service
- Firestore service
- Shared Firebase configuration

### auth.js

Responsible for:

- Authentication state
- Login/logout support
- Current user

### app.js

Responsible for:

- Starting the application
- Coordinating modules
- Current business selection
- Application initialization

### products.js

Responsible for:

- Loading products
- Adding products
- Editing products
- Deleting products
- Inventory display
- Product-related Firestore operations

### cart.js

Responsible for:

- Local cart
- Adding/removing items
- Quantity changes
- Cart totals

### sales.js

Responsible for:

- Checkout
- Creating sales
- Payment recording
- Stock updates
- Sale audit information

### history.js

Responsible for:

- Loading sales
- Displaying sales history
- Sale details
- Voiding sales
- Recording void actions
- Restoring stock when appropriate

---

## 22. UI Principle

The existing Sales Tracker visual design is retained.

The rebuild focuses primarily on the application's internal architecture and data flow.

The goal is:

Same familiar interface
+
Clean application architecture
+
Firebase-backed data
=
Reliable Sales Tracker

The UI should remain simple and efficient.

---

## 23. Security Principle

Security must be enforced at the database level.

The application should use:

- Firebase Authentication
- Firestore Security Rules
- Business membership
- Role-based permissions

The browser must never be trusted to enforce authorization by itself.

For example, hiding a Delete button is not sufficient.

Firestore must reject an unauthorized delete even if someone attempts it manually.

---

## 24. Testing Principle

Testing is part of development, not a final step.

For every significant feature:

1. Build the smallest change
2. Test the change
3. Test related functionality
4. Check the browser console
5. Fix errors
6. Test again
7. Commit the working change

No large groups of untested features should be built before testing.

---

## 25. V1 Core User Journey

The fundamental user journey is:

Login
  ↓
Select business
  ↓
Manage products
  ↓
Add products to cart
  ↓
Checkout
  ↓
Record payment
  ↓
Create sale
  ↓
Update stock
  ↓
View sale in History

The application must make this journey simple and reliable.

---

## 26. V1 Definition of Done

V1 is successful when a business can:

- Create/access a business
- Add products
- Edit products
- Delete products according to permissions
- Track stock
- Make a sale
- Record payment
- Automatically reduce stock
- View sales history
- Know who made each sale
- Void a sale when permitted
- Know who voided a sale
- Restore appropriate stock after a valid void
- Access the business from another device
- Keep user carts separate
- Respect owner/staff permissions
- Protect business data with Firestore Security Rules
- Handle poor connectivity appropriately
- Synchronize data reliably when connectivity returns

---

## 27. Future Growth

The V1 architecture should leave room for:

- Daraja M-Pesa integration
- Multiple businesses per user
- Multiple branches
- Customers
- Suppliers
- Expenses
- Advanced inventory history
- Advanced reports
- Profit/loss
- Subscriptions
- Additional payment providers
- Analytics
- Audit history
- Larger-scale usage

These features are not part of the V1 build unless specifically required.

---

## 28. Product Principle

Every feature should support the core purpose:

> Help small businesses easily and efficiently manage and track their sales.

The application should prioritize:

- Simplicity
- Speed
- Reliability
- Accuracy
- Security
- Ease of use

Sales Tracker should be simple enough for a small business owner to use every day while having an architecture capable of growing with the business.
