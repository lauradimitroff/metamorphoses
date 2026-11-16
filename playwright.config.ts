import { defineConfig, devices } from '@playwright/test'

const enCI = Boolean(process.env.CI)

// Les tests tournent sur la version construite du site (comme en production),
// servie par `vite preview` sur le port 4173.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: enCI,
  retries: enCI ? 1 : 0,
  reporter: enCI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    locale: 'fr-FR',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !enCI,
    timeout: 120_000,
  },
})
