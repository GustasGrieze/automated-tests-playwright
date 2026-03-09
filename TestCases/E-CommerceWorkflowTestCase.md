# Test Case – E-Commerce Workflow

## Test Case Information

| Attribute | Value |
|---|---|
| **Test Case ID** | TC_ECOM_001 |
| **Title** | Add multiple products above 900 USD to shopping cart and manage cart |
| **Target Application** | https://demowebshop.tricentis.com/ |
| **Module** | Product Catalog / Shopping Cart |
| **Objective** | Verify that a user can navigate through the store, identify products priced above 900 USD, add multiple such products to the shopping cart, update cart content, and remove products successfully. |
| **Test Type** | Functional UI Test |
| **Scenario Type** | End-to-End Happy Path |
| **Preconditions** | Application is accessible; homepage is opened; product catalog is available; at least two products priced above 900 USD exist. |
| **Test Data** | Product price condition: more than 900 USD; minimum products to add: 2 |
| **Expected Result** | Products above 900 USD are added to the cart, cart is updated correctly, and products can be removed successfully. |
| **Postconditions** | Shopping cart is empty after test execution. |
| **Priority** | High |

---

## Test Scenario

The user opens the Demo Web Shop website, navigates through product categories, selects at least two products priced above 900 USD, adds them to the shopping cart, verifies cart content, updates product quantity, and removes the products from the cart.

---

## Test Steps

| Step No. | Test Step | Expected Result |
|---|---|---|
| 1 | Open web browser. | Browser is opened successfully. |
| 2 | Navigate to `https://demowebshop.tricentis.com/`. | Demo Web Shop homepage is displayed. |
| 3 | Verify that homepage is loaded correctly. | Header, logo, and navigation menu are visible. |
| 4 | Click **Computers** in the top menu. | Computers category page is opened. |
| 5 | Open a subcategory such as **Desktops** or **Notebooks**. | Product listing page is displayed. |
| 6 | Review available products in the selected subcategory. | Product list with names and prices is visible. |
| 7 | Identify the first product with price greater than 900 USD. | A product matching the price condition is found. |
| 8 | Open the first matching product. | Product details page is displayed. |
| 9 | Verify that product price is greater than 900 USD. | Product satisfies the price condition. |
| 10 | Click **Add to cart**. | First product is added to the cart. |
| 11 | Verify add-to-cart confirmation. | Success notification or cart count update is shown. |
| 12 | Return to the product listing page. | Product listing page is displayed again. |
| 13 | Identify the second product with price greater than 900 USD. | Another matching product is found. |
| 14 | Open the second matching product. | Product details page is displayed. |
| 15 | Verify that second product price is greater than 900 USD. | Second product satisfies the price condition. |
| 16 | Click **Add to cart**. | Second product is added to the cart. |
| 17 | Verify that shopping cart count is updated. | Cart count reflects multiple added items. |
| 18 | Click **Shopping cart**. | Shopping cart page is opened. |
| 19 | Verify that both selected products are present in the cart. | Both added products are displayed in the cart. |
| 20 | Verify that each product price is above 900 USD. | All cart items meet the price requirement. |
| 21 | Verify that default quantity is 1 for each product. | Each product quantity is displayed as 1. |
| 22 | Change quantity of one product from 1 to 2. | New quantity value is entered. |
| 23 | Click **Update shopping cart**. | Cart is refreshed with updated quantity. |
| 24 | Verify that updated quantity is saved. | Selected product shows quantity 2. |
| 25 | Verify that cart total/subtotal is recalculated. | Total is updated according to new quantity. |
| 26 | Select added products for removal. | Products are marked for deletion. |
| 27 | Click **Update shopping cart**. | Selected products are removed from the cart. |
| 28 | Verify that shopping cart is empty. | Empty cart message is displayed. |

---

## CRUD Coverage

| Action | Description |
|---|---|
| **Create** | Add products to shopping cart |
| **Read** | View product details, prices, and cart content |
| **Update** | Change product quantity in shopping cart |
| **Delete** | Remove products from shopping cart |