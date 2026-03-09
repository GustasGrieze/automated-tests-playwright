import { test, expect } from '@playwright/test';

test('Application home page should be opened', async ({ page }) => {
  await page.goto('https://demowebshop.tricentis.com/');
  await expect(page).toHaveURL('https://demowebshop.tricentis.com/');
  await expect(page.locator('.header-logo')).toBeVisible();

  await page.waitForTimeout(5000);
});