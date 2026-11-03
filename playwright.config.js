import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  use: {
    baseURL: process.env.LAB_URL || 'http://127.0.0.1:5173',
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' },
    trace: 'retain-on-failure',
  },
});
