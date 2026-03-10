# Test Case – E-Commerce Workflow

## Test Case Information

| Attribute | Value |
|---|---|
| **Test Case ID** | TC_ECOM_001 |
| **Title** | Add multiple products above 900 USD to shopping cart, update quantity, and empty cart |
| **Target Application** | https://demowebshop.tricentis.com/ |
| **Module** | Product Catalog / Shopping Cart |
| **Objective** | Verify that a user can open the store, scan product categories, dynamically identify products priced above 900 USD, add two valid products to the shopping cart, update quantity, verify subtotal calculation, and remove all added products successfully. |
| **Test Type** | Functional UI Test |
| **Automation Type** | UI Automation |
| **Preconditions** | Application is accessible; homepage is available; Notebooks and Desktops category pages are accessible; at least two addable products priced above 900 USD exist in scanned categories. |
| **Test Data** | Product price condition: more than 900 USD; scanned categories: Notebooks and Desktops; minimum products to add: 2; updated quantity for first product: 2 |
| **Expected Result** | Two products priced above 900 USD are added to the cart, quantity of one product is updated successfully, row subtotals are calculated correctly, and the shopping cart is empty after removal. |
| **Postconditions** | Shopping cart is empty after test execution. |
| **Priority** | High |

---

## Test Scenario

The user opens the Demo Web Shop homepage, verifies that the page is loaded, clears the shopping cart if needed, scans the Notebooks and Desktops product listing pages, dynamically identifies products with price greater than 900 USD, opens candidate product pages, selects required product attributes if present, adds two valid products to the cart, verifies cart content, updates quantity of the first product, verifies row subtotal calculations, and removes all products from the shopping cart.

---

## Test Steps

| Step No. | Test Step | Expected Result |
|---|---|---|
| 1 | Open web browser. | Browser is opened successfully. |
| 2 | Navigate to `https://demowebshop.tricentis.com/`. | Demo Web Shop homepage is displayed. |
| 3 | Verify that the homepage URL is correct. | URL contains `demowebshop.tricentis.com`. |
| 4 | Verify that the website header logo is visible. | Header logo is displayed. |
| 5 | Navigate to the shopping cart page to prepare test data. | Shopping cart page is opened. |
| 6 | Check whether any products already exist in the cart. | Existing cart items, if any, are visible. |
| 7 | If products exist, select all cart items for removal and update the cart. | Shopping cart is cleaned before main test flow. |
| 8 | Navigate to the **Notebooks** category page. | Notebooks product listing page is displayed. |
| 9 | Review all product cards in the Notebooks category. | Product names, links, and prices are available for scan. |
| 10 | Identify products with price greater than 900 USD in the Notebooks category. | Matching candidate products are collected. |
| 11 | Navigate to the **Desktops** category page. | Desktops product listing page is displayed. |
| 12 | Review all product cards in the Desktops category. | Product names, links, and prices are available for scan. |
| 13 | Identify products with price greater than 900 USD in the Desktops category. | Additional matching candidate products are collected. |
| 14 | Verify that at least two candidate products priced above 900 USD were found. | Candidate list contains at least 2 products. |
| 15 | Open the first candidate product page. | Product details page is displayed. |
| 16 | Verify that the product title matches the expected candidate name. | Correct product page is opened. |
| 17 | Check whether the product has required attributes such as dropdowns or radio buttons. | Required product options are identified if present. |
| 18 | Select valid required product options if needed. | Product becomes eligible for add-to-cart action. |
| 19 | Click **Add to cart** for the first candidate product. | Add-to-cart action is triggered. |
| 20 | Verify that add-to-cart notification is displayed and product is added successfully. | Success notification confirms product was added. |
| 21 | Open the next candidate product page. | Product details page is displayed. |
| 22 | Verify that the product title matches the expected candidate name. | Correct product page is opened. |
| 23 | Check whether the product has required attributes such as dropdowns or radio buttons. | Required product options are identified if present. |
| 24 | Select valid required product options if needed. | Product becomes eligible for add-to-cart action. |
| 25 | Click **Add to cart** for the second candidate product. | Add-to-cart action is triggered. |
| 26 | Verify that add-to-cart notification is displayed and product is added successfully. | Success notification confirms product was added. |
| 27 | Verify that exactly two products were added successfully. | Added product list contains 2 products. |
| 28 | Navigate to the shopping cart page. | Shopping cart page is opened. |
| 29 | Verify that the cart URL is correct. | URL contains `/cart`. |
| 30 | Verify that exactly two product rows are displayed in the cart. | Cart contains 2 rows for added products. |
| 31 | Verify that the first added product is present in the cart. | Matching cart row is displayed. |
| 32 | Verify that the first product unit price is greater than 900 USD. | Product satisfies price condition. |
| 33 | Verify that the second added product is present in the cart. | Matching cart row is displayed. |
| 34 | Verify that the second product unit price is greater than 900 USD. | Product satisfies price condition. |
| 35 | Verify that the default quantity of the first selected product is `1`. | Quantity input shows value `1`. |
| 36 | Change quantity of the first product from `1` to `2`. | New quantity is entered successfully. |
| 37 | Click **Update shopping cart**. | Cart is refreshed with updated values. |
| 38 | Verify that the updated quantity of the first product is `2`. | Quantity update is saved correctly. |
| 39 | For each cart row, read unit price, quantity, and row subtotal. | Row pricing data is available for calculation. |
| 40 | Verify that each row subtotal equals `unit price × quantity`. | Arithmetic validation passes for every row. |
| 41 | Select all cart items for removal. | All products are marked for deletion. |
| 42 | Click **Update shopping cart**. | Selected products are removed from the cart. |
| 43 | Verify that the shopping cart is empty. | Empty cart message is displayed. |

---

## CRUD Coverage

| Action | Description |
|---|---|
| **Create** | Add products to shopping cart |
| **Read** | Read product names, prices, cart rows, quantities, and subtotals |
| **Update** | Change product quantity in shopping cart |
| **Delete** | Remove all products from shopping cart |

---

## Verification Coverage

| Verification No. | Description |
|---|---|
| **V1** | Homepage URL is correct |
| **V2** | Header logo is visible |
| **V3** | At least two candidate products above 900 USD are found |
| **V4** | Exactly two products are added successfully |
| **V5** | Shopping cart URL is correct |
| **V6** | Shopping cart contains exactly two rows |
| **V7** | Added products are present in the cart |
| **V8** | Each cart item price is above 900 USD |
| **V9** | Default quantity before update is `1` |
| **V10** | Updated quantity is saved as `2` |
| **V11** | Each row subtotal equals `unit price × quantity` |
| **V12** | Shopping cart is empty after cleanup |