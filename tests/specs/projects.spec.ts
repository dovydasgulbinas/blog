import { expect, test } from "@playwright/test";

test("Hilbert curve generator loads its script and draws", async ({ page }) => {
  await page.goto("/projects/hilbert-curve-generator/");
  await expect(page.locator("hilbert-curve canvas")).toBeVisible();
});

test("Haiku mixer remixes haikus", async ({ page }) => {
  await page.goto("/projects/haiku-mixer/");
  await page.getByRole("button", { name: "Remix!" }).click();
  await expect(page.locator("#result")).not.toBeEmpty();
});

test("old project-category URLs still work", async ({ page }) => {
  const res = await page.goto("/project-categories/haiku/");
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Haiku Mixer" })).toBeVisible();
});
