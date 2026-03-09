import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

type TestData = {
  baseUrl: string;
  credentials: {
    email: string;
    password: string;
  };
  sourcePages: string[];
  priceThreshold: number;
  productsToAdd: number;
};

type Product = {
  name: string;
  price: number;
  url: string;
};

function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}

function loadTestData(): TestData {
  const filePath = path.resolve(process.cwd(), 'tests', 'test-data', 'ecommerce-data.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as TestData;
}

async function login(page: Page, baseUrl: string, email: string, password: string) {
  console.log('Precondition: logging in');

  await page.goto(baseUrl);
  await page.getByRole('link', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/login/);

  await page.locator('#Email').fill(email);
  await page.locator('#Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
}

async function logout(page: Page) {
  console.log('Postcondition: logging out');

  await page.getByRole('link', { name: 'Log out' }).click();
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
}

async function cleanCart(page: Page, baseUrl: string) {
  console.log('Cleaning shopping cart');

  await page.goto(`${baseUrl}/cart`);

  const removeCheckboxes = page.locator('input[name="removefromcart"]');
  const count = await removeCheckboxes.count();

  if (count > 0) {
    for (let i = 0; i < count; i++) {
      await removeCheckboxes.nth(i).check();
    }

    await page.getByRole('button', { name: /Update shopping cart/i }).click();
  }

  await expect(page.locator('.order-summary-content')).toContainText('Your Shopping Cart is empty!');
}

async function selectRequiredOptions(page: Page) {
  const selects = page.locator('.attributes select');
  const selectCount = await selects.count();

  for (let i = 0; i < selectCount; i++) {
    const select = selects.nth(i);
    const options = select.locator('option');
    const optionCount = await options.count();

    for (let j = 0; j < optionCount; j++) {
      const option = options.nth(j);
      const value = await option.getAttribute('value');
      const text = ((await option.textContent()) || '').trim();

      if (value && value !== '0' && text !== '') {
        await select.selectOption(value);
        break;
      }
    }
  }

  const optionLists = page.locator('.attributes ul.option-list');
  const listCount = await optionLists.count();

  for (let i = 0; i < listCount; i++) {
    const list = optionLists.nth(i);
    const checkedRadio = list.locator('input[type="radio"]:checked');
    const checkedCount = await checkedRadio.count();

    if (checkedCount === 0) {
      const firstRadio = list.locator('input[type="radio"]').first();
      const radioCount = await list.locator('input[type="radio"]').count();

      if (radioCount > 0) {
        await firstRadio.check();
      }
    }
  }
}

async function tryAddProductToCart(page: Page, product: Product): Promise<boolean> {
  console.log(`Opening product page: ${product.name}`);

  await page.goto(product.url);
  await expect(page.locator('h1')).toContainText(product.name);

  const addToCartButton = page.locator('[id^="add-to-cart-button-"]').first();
  const addButtonCount = await addToCartButton.count();

  if (addButtonCount === 0) {
    console.log(`Skipping ${product.name} - no Add to cart button found`);
    return false;
  }

  await selectRequiredOptions(page);
  await addToCartButton.click();

  const notification = page.locator('#bar-notification');
  await expect(notification).toBeVisible();

  const notificationText = ((await notification.textContent()) || '').trim();
  console.log(`Notification for ${product.name}: ${notificationText}`);

  if (notificationText.includes('The product has been added')) {
    return true;
  }

  return false;
}

test('Data-driven Demo Web Shop workflow with login, preconditions, and postconditions', async ({ page }) => {
  const testData = loadTestData();

  const {
    baseUrl,
    credentials,
    sourcePages,
    priceThreshold,
    productsToAdd,
  } = testData;

  const candidateProducts: Product[] = [];
  const addedProducts: Product[] = [];

  console.log('Step 1: Open homepage');
  await page.goto(baseUrl);

  // Verification 1
  await expect(page).toHaveURL(/demowebshop\.tricentis\.com/);

  // Verification 2
  await expect(page.locator('.header-logo')).toBeVisible();

  // Preconditions
  await login(page, baseUrl, credentials.email, credentials.password);
  await cleanCart(page, baseUrl);

  console.log('Step 2: Collect products dynamically using external JSON data');
  for (const relativePage of sourcePages) {
    const sourcePageUrl = `${baseUrl}${relativePage}`;
    console.log(`Scanning page: ${sourcePageUrl}`);

    await page.goto(sourcePageUrl);

    const productCards = page.locator('.product-grid .item-box');
    const count = await productCards.count();

    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);

      const name = (await card.locator('.product-title a').innerText()).trim();
      const priceText = (await card.locator('.prices').innerText()).trim();
      const price = parsePrice(priceText);
      const href = await card.locator('.product-title a').getAttribute('href');

      if (!href) continue;

      if (price > priceThreshold) {
        candidateProducts.push({
          name,
          price,
          url: `${baseUrl}${href}`,
        });

        console.log(`Candidate found: ${name} | ${price}`);
      }
    }
  }

  // Verification 3
  expect(candidateProducts.length).toBeGreaterThanOrEqual(productsToAdd);

  console.log('Step 3: Add products to cart');
  for (const product of candidateProducts) {
    const added = await tryAddProductToCart(page, product);

    if (added) {
      addedProducts.push(product);
    }

    if (addedProducts.length === productsToAdd) {
      break;
    }
  }

  // Verification 4
  expect(addedProducts.length).toBe(productsToAdd);

  console.log('Step 4: Open shopping cart');
  await page.goto(`${baseUrl}/cart`);

  // Verification 5
  await expect(page).toHaveURL(/cart/);

  const cartRows = page.locator('table.cart tbody tr');

  // Verification 6
  await expect(cartRows).toHaveCount(productsToAdd);

  for (const product of addedProducts) {
    const row = cartRows.filter({ hasText: product.name }).first();

    // Verification 7
    await expect(row).toContainText(product.name);

    const unitPriceText = (await row.locator('.product-unit-price').innerText()).trim();
    const unitPrice = parsePrice(unitPriceText);

    // Verification 8
    expect(unitPrice).toBeGreaterThan(priceThreshold);

    const rowSubtotalText = (await row.locator('.product-subtotal').innerText()).trim();
    const rowSubtotal = parsePrice(rowSubtotalText);

    // Verification 9 - arithmetic verification
    expect(rowSubtotal).toBe(unitPrice);
  }

  // Postconditions
  await cleanCart(page, baseUrl);
  await logout(page);

  // Verification 10
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();

  console.log('Test completed successfully');
});