import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", heading: /Dovydas\s*Gulbinas/ },
  { path: "/blog/", heading: "Blog" },
  { path: "/projects/", heading: "Projects" },
  { path: "/music/", heading: "Music" },
  { path: "/contact-me/", heading: "Contact Me" },
  { path: "/resume/", heading: "Dovydas Gulbinas" },
  { path: "/blog/modify-android-phone-to-run-without-a-battery/", heading: "Modify Android Phone To Run Without a Battery" },
];

for (const { path, heading } of pages) {
  test(`${path} renders without errors or sideways scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await expect(page).toHaveTitle(/dovydas\.xyz/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`^https://dovydas\\.xyz${path}$`));

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("unknown URL serves the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-page/");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("SYNTAX ERROR LINE 404")).toBeVisible();
});
