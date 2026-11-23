import { expect, test } from "@playwright/test";

test("home shows latest posts and project carts", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".card")).toHaveCount(3);
  await expect(page.locator(".cart")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /All \d+ posts/ })).toHaveAttribute("href", "/blog/");
});

test("pal() buttons swap the portrait ramp", async ({ page }) => {
  await page.goto("/");
  const img = page.getByRole("img", { name: "Dithered portrait of Dovydas" });
  const before = await img.getAttribute("src");
  const sea = page.getByRole("button", { name: "Sea ramp" });
  await sea.click();
  await expect(sea).toHaveAttribute("aria-pressed", "true");
  await expect(img).not.toHaveAttribute("src", before!);
});
