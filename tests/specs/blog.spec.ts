import { expect, test } from "@playwright/test";

test("blog index lists posts newest first and paginates", async ({ page }) => {
  await page.goto("/blog/");
  const rows = page.locator("[data-post-list] li");
  await expect(rows).toHaveCount(10);
  await expect(rows.first()).toContainText("Install Node on Pop!_OS");
  await page.getByRole("navigation", { name: "Pages" }).getByRole("link", { name: "2" }).click();
  await expect(page).toHaveURL(/\/blog\/page\/2\/$/);
});

test("search finds posts beyond the current page", async ({ page }) => {
  await page.goto("/blog/");
  const search = page.getByRole("searchbox", { name: "Search posts" });
  await search.fill("hitomezashi");
  const rows = page.locator("[data-post-list] li");
  await expect(rows).toHaveCount(1);
  await expect(rows).toContainText("3D Printing Hitomezashi Patterns");

  await search.fill("zzzz-nothing");
  await expect(page.getByText("No posts match")).toBeVisible();
  await search.fill("");
  await expect(rows).toHaveCount(10);
});

test("category chip filters to that category", async ({ page }) => {
  await page.goto("/blog/");
  await page.getByRole("link", { name: "hardware", exact: true }).click();
  await expect(page).toHaveURL(/\/categories\/hardware\/$/);
  const rows = page.locator(".post-list li");
  await expect(rows).toHaveCount(2);
  for (const row of await rows.all()) await expect(row).toContainText("hardware");
});

test("post shows meta, alerts, code and older/newer links", async ({ page }) => {
  await page.goto("/blog/upgrade-linuxservernextcloud-container-manually/");
  await expect(page.getByRole("link", { name: "self-host" })).toHaveAttribute("href", "/categories/self-host/");
  await expect(page.locator("time").first()).toHaveAttribute("datetime", "2022-04-26");
  await expect(page.locator(".callout--warning")).toContainText("Upgrade one major version at a time");
  await expect(page.locator(".prose pre").first()).toBeVisible();
  await expect(page.getByRole("navigation", { name: "More posts" }).getByRole("link")).toHaveCount(2);
});

test("reading progress bar fills as you scroll", async ({ page }) => {
  await page.goto("/blog/introduction-on-rest-authentication/");
  const bar = page.getByRole("progressbar", { name: "Reading progress" });
  await expect(bar).toHaveAttribute("aria-valuenow", "0");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(bar).toHaveAttribute("aria-valuenow", "100");
});

test("RSS feed lists blog posts at /feed.xml", async ({ request }) => {
  const res = await request.get("/feed.xml");
  expect(res.ok()).toBeTruthy();
  const xml = await res.text();
  expect(xml).toContain("<title>Install Node on Pop!_OS</title>");
  expect(xml).toContain("https://dovydas.xyz/blog/install-nodejs-on-pop-os/");
});
