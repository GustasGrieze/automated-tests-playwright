import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60000,
  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/junit-results.xml' }]
  ],
  use: {
    browserName: 'chromium',
    headless: true,
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 10,
      args: ['--start-maximized'],
    },
  },
});