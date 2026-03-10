import { test, expect, Page } from '@playwright/test';

type Product = {
  name: string;
  price: number;
  url: string;
};

function parsePrice(text: string): number {
  return Number(text.replace(/[^0-9.]/g, ''));
}

async function cleanCart(page: Page, baseUrl: string) {
  console.log('Precondition: cleaning shopping cart');

  await page.goto(`${baseUrl}/cart`);

  const removeCheckboxes = page.locator('input[name="removefromcart"]');
  const count = await removeCheckboxes.count();

  if (count > 0) {
    for (let i = 0; i < count; i++) {
      await removeCheckboxes.nth(i).check();
    }

    await page.getByRole('button', { name: /Update shopping cart/i }).click();
  }
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
    console.log(`Added successfully: ${product.name}`);
    return true;
  }

  if (notificationText.includes('Please select')) {
    console.log(`Skipping ${product.name} - required options were not accepted`);
    return false;
  }

  console.log(`Skipping ${product.name} - add to cart not successful`);
  return false;
}

test('Add multiple products above 900 USD to cart, update quantity, and verify subtotal', async ({ page }) => {
  const baseUrl = 'https://demowebshop.tricentis.com';

  const sourcePages = [
    `${baseUrl}/notebooks`,
    `${baseUrl}/desktops`,
  ];

  const candidates: Product[] = [];
  const addedProducts: Product[] = [];

  console.log('Step 1: Open homepage');
  await page.goto(baseUrl);

  // Verification 1
  await expect(page).toHaveURL(/demowebshop\.tricentis\.com/);

  // Verification 2
  await expect(page.locator('.header-logo')).toBeVisible();

  await cleanCart(page, baseUrl);

  console.log('Step 2: Collect candidate products from category pages');

  for (const sourcePage of sourcePages) {
    console.log(`Scanning category: ${sourcePage}`);
    await page.goto(sourcePage);

    const productCards = page.locator('.product-grid .item-box');
    const count = await productCards.count();

    for (let i = 0; i < count; i++) {
      const card = productCards.nth(i);

      const name = (await card.locator('.product-title a').innerText()).trim();
      const priceText = (await card.locator('.prices').innerText()).trim();
      const price = parsePrice(priceText);
      const href = await card.locator('.product-title a').getAttribute('href');

      if (!href) continue;

      if (price > 900) {
        console.log(`Candidate found: ${name} | price: ${price}`);
        candidates.push({
          name,
          price,
          url: `${baseUrl}${href}`,
        });
      }
    }
  }

  // Verification 3
  expect(candidates.length).toBeGreaterThanOrEqual(2);

  console.log('Step 3: Add two qualifying products to cart');

  for (const product of candidates) {
    const added = await tryAddProductToCart(page, product);

    if (added) {
      addedProducts.push(product);
    }

    if (addedProducts.length === 2) {
      break;
    }
  }

  // Verification 4
  expect(addedProducts.length).toBe(2);

  console.log('Added products:');
  for (const product of addedProducts) {
    console.log(`- ${product.name} | ${product.price}`);
  }

  console.log('Step 4: Open shopping cart');
  await page.goto(`${baseUrl}/cart`);

  // Verification 5
  await expect(page).toHaveURL(/cart/);

  const cartRows = page.locator('table.cart tbody tr');

  // Verification 6
  await expect(cartRows).toHaveCount(2);

  console.log('Step 5: Verify both selected products are present in cart');

  for (const product of addedProducts) {
    const row = cartRows.filter({ hasText: product.name }).first();

    // Verification 7
    await expect(row).toContainText(product.name);

    const unitPriceText = (await row.locator('.product-unit-price').innerText()).trim();
    const unitPrice = parsePrice(unitPriceText);

    // Verification 8
    expect(unitPrice).toBeGreaterThan(900);
  }

  console.log('Step 6: Update quantity of the first product from 1 to 2');

  const firstProduct = addedProducts[0];
  const firstRow = cartRows.filter({ hasText: firstProduct.name }).first();
  const firstQtyInput = firstRow.locator('input.qty-input');

  // Verification 9 - default quantity check
  await expect(firstQtyInput).toHaveValue('1');

  await firstQtyInput.fill('2');

  const updateCartButton = page.getByRole('button', { name: /Update shopping cart/i });
  await updateCartButton.click();

  // Verification 10
  await expect(firstQtyInput).toHaveValue('2');

  console.log('Step 7: Verify arithmetic for each cart row');

  let calculatedTotal = 0;

  const updatedRows = page.locator('table.cart tbody tr');
  const updatedCount = await updatedRows.count();

  for (let i = 0; i < updatedCount; i++) {
    const row = updatedRows.nth(i);

    const unitPriceText = (await row.locator('.product-unit-price').innerText()).trim();
    const unitPrice = parsePrice(unitPriceText);

    const qtyValue = await row.locator('input.qty-input').inputValue();
    const quantity = Number(qtyValue);

    const subtotalText = (await row.locator('.product-subtotal').innerText()).trim();
    const subtotal = parsePrice(subtotalText);

    // Verification 11 - arithmetic verification
    expect(subtotal).toBe(unitPrice * quantity);

    calculatedTotal += subtotal;

    console.log(`Row ${i + 1}: unit=${unitPrice}, qty=${quantity}, subtotal=${subtotal}`);
  }

  console.log(`Calculated cart total from row subtotals: ${calculatedTotal}`);

  console.log('Step 8: Clean cart after test');

  const removeCheckboxes = page.locator('input[name="removefromcart"]');
  const removeCount = await removeCheckboxes.count();

  for (let i = 0; i < removeCount; i++) {
    await removeCheckboxes.nth(i).check();
  }

  await page.getByRole('button', { name: /Update shopping cart/i }).click();

  // Verification 12
  await expect(page.locator('.order-summary-content')).toContainText('Your Shopping Cart is empty!');

  console.log('Test completed successfully');
});