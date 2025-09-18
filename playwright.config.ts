import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:5000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video recording */
    video: 'retain-on-failure',

    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.api\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    
    {
      name: 'Authentication Tests',
      testMatch: /.*\.auth\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'Integration Tests',
      testMatch: /.*\.integration\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'Smoke Tests',
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Global setup and teardown */
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'python app.py',
    url: 'http://localhost:5000/health',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
    env: {
      FLASK_ENV: 'testing',
    },
  },
});
