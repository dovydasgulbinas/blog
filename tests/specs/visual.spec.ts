import { expect, test } from "@playwright/test";

const paths = ["/", "/blog/", "/blog/modify-android-phone-to-run-without-a-battery/", "/projects/", "/music/", "/contact-me/", "/resume/"];

for (const path of paths) {
  test(`visual ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot({ fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.01 });
  });
}
