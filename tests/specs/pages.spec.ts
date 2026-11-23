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

const jsonLd = [
  { path: "/", type: "WebSite" },
  { path: "/blog/3d-printing-hitomezashi-patterns/", type: "BlogPosting" },
  { path: "/projects/qr-contact-generator/", type: "WebApplication" },
  { path: "/music/post-war-bliss/", type: "MusicRecording" },
  { path: "/resume/", type: "ProfilePage" },
  { path: "/contact-me/", type: "ContactPage" },
  { path: "/blog/", type: "CollectionPage" },
];

for (const { path, type } of jsonLd) {
  test(`${path} has ${type} structured data`, async ({ request }) => {
    const html = await (await request.get(path)).text();
    const raw = html.match(/<script type=["']?application\/ld\+json["']?>(.*?)<\/script>/s)?.[1];
    expect(raw).toBeTruthy();
    const graph: Record<string, unknown>[] = JSON.parse(raw!)["@graph"];
    const types = graph.map((n) => n["@type"]);
    expect(graph.find((n) => n["@type"] === "Person")?.sameAs).toContain("https://github.com/dovydasgulbinas");
    expect(types).toContain(type);
    if (path !== "/") {
      expect(graph.find((n) => n["@type"] === type)?.url).toBe(`https://dovydas.xyz${path}`);
      expect(types).toContain("BreadcrumbList");
    }
  });
}

test("pages have a 1200×630 share image", async ({ page, request }) => {
  for (const path of ["/", "/blog/3d-printing-hitomezashi-patterns/", "/projects/qr-contact-generator/"]) {
    await page.goto(path);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toBe(`https://dovydas.xyz${path}og.png`);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    const png = await (await request.get(`${path}og.png`)).body();
    expect(png.readUInt32BE(16)).toBe(1200); // PNG IHDR width
    expect(png.readUInt32BE(20)).toBe(630);
  }
});

test("analytics beacon never loads outside dovydas.xyz", async ({ page }) => {
  const beacon: string[] = [];
  page.on("request", (r) => r.url().includes("cloudflareinsights") && beacon.push(r.url()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(beacon).toEqual([]);
});

test("posts show related posts and the Mastodon author tag", async ({ page }) => {
  await page.goto("/blog/3d-printing-hitomezashi-patterns/");
  await expect(page.locator('meta[name="fediverse:creator"]')).toHaveAttribute("content", "@dovydas@mastodon.social");
  const related = page.getByRole("region", { name: "Related posts" });
  await expect(related.getByRole("link")).toHaveCount(3);
});
