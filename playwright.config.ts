import { defineConfig, devices } from '@playwright/test';

const PORT = 3001;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    locale: 'vi-VN',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Dev server bật MSW nên E2E không cần backend thật.
  webServer: {
    command: 'pnpm dev',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    // Lần đầu sau khi đổi lockfile Vite re-optimize dependency, có thể quá 60s.
    timeout: 120_000,
    // Hiện stderr của dev server để khi không lên được thì biết vì sao.
    stderr: 'pipe',
  },
});
