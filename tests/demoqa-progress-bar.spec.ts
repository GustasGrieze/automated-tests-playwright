import { test, expect } from '@playwright/test';

test('Progress Bar start, stop, complete, and reset', async ({ page }) => {
  console.log('Step 1: Open DemoQA homepage');
  await page.goto('https://demoqa.com/');

  console.log('Step 2: Open Widgets section');
  const widgetsCard = page.locator('.card').filter({ hasText: 'Widgets' });
  await expect(widgetsCard).toBeVisible();
  await widgetsCard.click();

  console.log('Step 3: Open Progress Bar page');
  const progressBarMenuItem = page.locator('.element-list .menu-list').getByText('Progress Bar');
  await expect(progressBarMenuItem).toBeVisible();
  await progressBarMenuItem.click();

  await expect(page).toHaveURL(/progress-bar/);

  const progressBar = page.locator('#progressBar');
  const progressValue = page.locator('#progressBar .progress-bar');
  const startStopButton = page.locator('#startStopButton');
  const resetButton = page.locator('#resetButton');

  console.log('Step 4: Verify initial state');
  await expect(progressBar).toBeVisible();
  await expect(progressValue).toHaveAttribute('aria-valuenow', '0');

  // Verification 1
  await expect(progressValue).toContainText('0%');

  console.log('Step 5: Start progress');
  await expect(startStopButton).toHaveText('Start');
  await startStopButton.click();

  console.log('Step 6: Wait until progress reaches at least 40%');
  await expect
    .poll(
      async () => {
        const value = await progressValue.getAttribute('aria-valuenow');
        return Number(value);
      },
      { timeout: 10000 }
    )
    .toBeGreaterThanOrEqual(40);

  console.log('Step 7: Stop progress');
  await expect(startStopButton).toHaveText('Stop');
  await startStopButton.click();

  const stoppedValueText = (await progressValue.getAttribute('aria-valuenow')) ?? '0';
  const stoppedValue = Number(stoppedValueText);

  console.log(`Stopped at: ${stoppedValue}%`);

  // Verification 2
  expect(stoppedValue).toBeGreaterThanOrEqual(40);

  // Verification 3
  expect(stoppedValue).toBeLessThan(100);

  console.log('Step 8: Resume progress');
  await expect(startStopButton).toHaveText('Start');
  await startStopButton.click();

  console.log('Step 9: Wait until progress reaches 100%');
  await expect
    .poll(
      async () => {
        const value = await progressValue.getAttribute('aria-valuenow');
        return Number(value);
      },
      { timeout: 15000 }
    )
    .toBe(100);

  // Verification 4
  await expect(progressValue).toContainText('100%');

  console.log('Step 10: Verify Reset button is visible');
  // Verification 5
  await expect(resetButton).toBeVisible();

  console.log('Step 11: Reset progress');
  await resetButton.click();

  console.log('Step 12: Verify progress returns to 0%');
  await expect(progressValue).toHaveAttribute('aria-valuenow', '0');

  // Verification 6
  await expect(progressValue).toContainText('0%');
});