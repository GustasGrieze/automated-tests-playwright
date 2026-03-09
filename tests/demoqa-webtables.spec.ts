import { test, expect, Page } from '@playwright/test';

type RecordData = {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
};

function createRecord(index: number): RecordData {
  return {
    firstName: `Auto${index}`,
    lastName: `User${index}`,
    email: `auto.user${index}@example.com`,
    age: `${25 + index}`,
    salary: `${4000 + index}`,
    department: `QA${index}`,
  };
}

async function getPopulatedRowCount(page: Page): Promise<number> {
  return await page.locator('span[title="Delete"]').count();
}

async function addRecord(page: Page, record: RecordData) {
  await page.locator('#addNewRecordButton').click();
  await expect(page.locator('.modal-content')).toBeVisible();

  await page.locator('#firstName').fill(record.firstName);
  await page.locator('#lastName').fill(record.lastName);
  await page.locator('#userEmail').fill(record.email);
  await page.locator('#age').fill(record.age);
  await page.locator('#salary').fill(record.salary);
  await page.locator('#department').fill(record.department);

  await page.locator('#submit').click();
  await expect(page.locator('.modal-content')).toBeHidden();
}

test('Create second page in Web Tables, delete record from page 2, and verify pagination returns to page 1', async ({
  page,
}) => {
  console.log('Step 1: Open DemoQA homepage');
  await page.goto('https://demoqa.com/');

  console.log('Step 2: Open Elements section');
  const elementsCard = page.locator('.card').filter({ hasText: 'Elements' });
  await expect(elementsCard).toBeVisible();
  await elementsCard.click();

  console.log('Step 3: Open Web Tables page');
  const webTablesMenuItem = page.locator('.element-list .menu-list').getByText('Web Tables');
  await expect(webTablesMenuItem).toBeVisible();
  await webTablesMenuItem.click();

  await expect(page).toHaveURL(/webtables/);
  await expect(page.locator('.web-tables-wrapper')).toBeVisible();

  console.log('Step 4: Read current table state');
  const initialRowCount = await getPopulatedRowCount(page);
  const rowsPerPage = 10;
  const recordsNeededForSecondPage = rowsPerPage + 1 - initialRowCount;

  // Verification 1
  expect(initialRowCount).toBeGreaterThan(0);

  // Verification 2
  expect(rowsPerPage).toBe(10);

  // Verification 3
  expect(recordsNeededForSecondPage).toBeGreaterThan(0);

  console.log(`Initial populated rows: ${initialRowCount}`);
  console.log(`Rows per page: ${rowsPerPage}`);
  console.log(`Records needed to create page 2: ${recordsNeededForSecondPage}`);

  const createdRecords: RecordData[] = [];

  console.log('Step 5: Add enough records to create a second page');
  for (let i = 1; i <= recordsNeededForSecondPage; i++) {
    const record = createRecord(i);
    createdRecords.push(record);
    console.log(`Adding record: ${record.email}`);
    await addRecord(page, record);
  }

  // Verification 4
  await expect(page.getByText('Page 1 of 2')).toBeVisible();

  console.log('Step 6: Navigate to page 2');
  const nextButton = page.getByRole('button', { name: 'Next' });
  await expect(nextButton).toBeEnabled();
  await nextButton.click();

  // Verification 5
  await expect(page.getByText('Page 2 of 2')).toBeVisible();

  const recordToDelete = createdRecords[createdRecords.length - 1];
  console.log(`Step 7: Delete record on page 2: ${recordToDelete.email}`);

  // Verification 6
  await expect(page.getByText(recordToDelete.email, { exact: true })).toBeVisible();

  const deleteIcon = page.locator('span[title="Delete"]:visible').first();

  // Verification 7
  await expect(deleteIcon).toBeVisible();
  await deleteIcon.click();

  console.log('Step 8: Verify pagination returns to page 1 and total pages becomes 1');

  // Verification 8
  await expect(page.getByText('Page 1 of 1')).toBeVisible();

  // Verification 9
  await expect(page.getByText(recordToDelete.email, { exact: true })).toHaveCount(0);

  // Verification 10
  await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();

  console.log('Test completed successfully');
  await page.waitForTimeout(5000);
});