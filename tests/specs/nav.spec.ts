import { expect, test } from "@playwright/test";

test("main nav links to every section and marks the current one", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const [name, href] of [
    ["Blog", "/blog/"],
    ["Projects", "/projects/"],
    ["Music", "/music/"],
    ["Contact Me", "/contact-me/"],
  ]) {
    await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
  }

  await nav.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(nav.getByRole("link", { name: "Projects", exact: true })).toHaveAttribute("aria-current", "page");
});

test("posts mark the Blog section in the nav", async ({ page }) => {
  await page.goto("/blog/intro-to-python-generators/");
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Blog", exact: true })).toHaveClass(/is-section/);
});
