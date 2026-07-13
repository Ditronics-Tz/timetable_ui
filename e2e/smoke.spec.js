/**
 * Optional Playwright smoke (Phase 10).
 * Requires: frontend + backend running, Playwright installed.
 *
 *   npx playwright test e2e/smoke.spec.js
 */
// @ts-check
const { test, expect } = require("@playwright/test");

const BASE = process.env.E2E_BASE_URL || "http://localhost:5173";

test.describe("SACAS smoke", () => {
  test("admin login reaches dashboard", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill("#email", "admin@example.com");
    await page.fill("#password", "password");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard", { timeout: 15000 });
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });
});
