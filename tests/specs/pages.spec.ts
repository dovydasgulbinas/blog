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

test("résumé PDF is served", async ({ request }) => {
  const res = await request.get("/resume/dovydas-gulbinas-resume.pdf");
  expect(res.ok()).toBeTruthy();
  expect(res.headers()["content-type"]).toContain("pdf");
  expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("robots.txt points crawlers at the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Sitemap: https://dovydas.xyz/sitemap.xml");
});

test("llms.txt lists every post as a Markdown link that resolves", async ({ request, page }) => {
  const body = await (await request.get("/llms.txt")).text();
  expect(body).toMatch(/^# dovydas\.xyz\n\n> /);
  const links = [...body.matchAll(/\]\(https:\/\/dovydas\.xyz(\/blog\/[^)]+\/index\.md)\)/g)].map((m) => m[1]);
  expect(links.length).toBeGreaterThan(20);
  const md = await (await request.get(links[0])).text();
  expect(md).toMatch(/^# .+\n/);
  expect(md).toContain("- URL: https://dovydas.xyz/blog/");

  await page.goto(links[0].replace(/index\.md$/, ""));
  await expect(page.locator('link[rel="alternate"][type="text/markdown"]')).toHaveAttribute("href", `https://dovydas.xyz${links[0]}`);
});

test("llms-full.txt holds the text of every post", async ({ request }) => {
  const body = await (await request.get("/llms-full.txt")).text();
  expect(body).toContain("# 3D Printing Hitomezashi Patterns");
  expect(body.split("\n---\n").length).toBeGreaterThan(20);
});
