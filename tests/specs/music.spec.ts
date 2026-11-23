import { expect, test } from "@playwright/test";

test("music player plays and pauses the track", async ({ page }) => {
  await page.goto("/music/");
  const play = page.getByRole("button", { name: "Play Post-War Bliss" });
  await expect(play).toBeVisible();
  const audio = page.locator("audio");
  await expect(audio).toHaveAttribute("src", /\.ogg$/);

  await page.evaluate(() => {
    // Headless browsers may refuse to decode audio; stub play/pause to test the skin only.
    const a = document.querySelector("audio")!;
    let paused = true;
    Object.defineProperty(a, "paused", { get: () => paused });
    a.play = async () => { paused = false; a.dispatchEvent(new Event("play")); };
    a.pause = () => { paused = true; a.dispatchEvent(new Event("pause")); };
  });
  await play.click();
  await expect(page.getByRole("button", { name: "Pause Post-War Bliss" })).toBeVisible();
  await expect(page.locator("[data-player]")).toHaveClass(/is-playing/);
});

test("track download link points at the audio file", async ({ request, page }) => {
  await page.goto("/music/post-war-bliss/");
  const href = await page.getByRole("link", { name: /Download \.ogg/ }).getAttribute("href");
  const res = await request.head(href!);
  expect(res.ok()).toBeTruthy();
});
