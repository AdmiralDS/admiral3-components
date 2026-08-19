import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  timeout: 180_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: 'playwright-visual-report', open: 'never' }],
  ],
  outputDir: 'test-results/visual',
  use: {
    baseURL: 'http://localhost:4173/',
    colorScheme: 'light',
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixels: 0,
      threshold: 0,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}-{platform}{ext}',
  webServer: {
    command: 'npm run playground:serve',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
