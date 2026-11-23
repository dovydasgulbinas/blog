import { defineConfig, devices } from "@playwright/test";

// Tests run against the production build in ../public (`just build` first; `just test` does both).
const PORT = 3000;
const SITE_DIR = process.env.SITE_DIR ?? "../public";

export default defineConfig({
  testDir: "./specs",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx http-server ${SITE_DIR} -p ${PORT} -a 127.0.0.1 -s -c-1`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop", testIgnore: /visual/, use: { ...devices["Desktop Chrome"] } },
    { name: "phone", testIgnore: /visual/, use: { ...devices["Pixel 7"] } },
    // Screenshot baselines are OS-specific; run with `just test-visual` locally.
    { name: "visual", testMatch: /visual/, use: { ...devices["Desktop Chrome"] } },
  ],
});
