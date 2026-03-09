import { test, expect } from '@playwright/test';

test('Dynamic Properties - verify enablement, visibility, and color change', async ({ page }) => {
  console.log('Step 1: Open DemoQA homepage');
  await page.goto('https://demoqa.com/');

  console.log('Step 2: Open Elements section');
  const elementsCard = page.locator('.card').filter({ hasText: 'Elements' });
  await expect(elementsCard).toBeVisible();
  await elementsCard.click();

  console.log('Step 3: Open Dynamic Properties page');
  const dynamicPropertiesMenuItem = page.locator('.element-list .menu-list').getByText('Dynamic Properties');
  await expect(dynamicPropertiesMenuItem).toBeVisible();
  await dynamicPropertiesMenuItem.click();

  await expect(page).toHaveURL(/dynamic-properties/);

  const enableAfterButton = page.locator('#enableAfter');
  const colorChangeButton = page.locator('#colorChange');
  const visibleAfterButton = page.locator('#visibleAfter');

  console.log('Step 4: Verify initial state');

  // Verification 1: button is initially disabled
  await expect(enableAfterButton).toBeDisabled();

  // Verification 2: color change button is visible initially
  await expect(colorChangeButton).toBeVisible();

  // Verification 3: visible-after button is initially hidden
  await expect(visibleAfterButton).toBeHidden();

  const initialClass = (await colorChangeButton.getAttribute('class')) ?? '';
  console.log(`Initial colorChange class: ${initialClass}`);

  console.log('Step 5: Wait until the disabled button becomes enabled');

  // Verification 4
  await expect(enableAfterButton).toBeEnabled({ timeout: 10000 });

  console.log('Step 6: Wait until the hidden button becomes visible');

  // Verification 5
  await expect(visibleAfterButton).toBeVisible({ timeout: 10000 });

  console.log('Step 7: Wait until the color change button style/class changes');

  await expect
    .poll(
      async () => {
        return (await colorChangeButton.getAttribute('class')) ?? '';
      },
      { timeout: 10000 }
    )
    .not.toBe(initialClass);

  const updatedClass = (await colorChangeButton.getAttribute('class')) ?? '';
  console.log(`Updated colorChange class: ${updatedClass}`);

  // Verification 6
  expect(updatedClass).not.toBe(initialClass);

  console.log('Test completed successfully');
});