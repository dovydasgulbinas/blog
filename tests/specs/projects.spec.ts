import { readFile } from "node:fs/promises";
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

test.describe("QR Contact Generator", () => {
  const fill = async (page, values: Record<string, string>) => {
    for (const [label, value] of Object.entries(values)) await page.getByRole("textbox", { name: label, exact: true }).fill(value);
  };

  test("the downloaded PNG scans back to the vCard, UTF-8 intact", async ({ page }) => {
    await page.goto("/projects/qr-contact-generator/");
    const png = page.getByRole("button", { name: "Atsisiųsti PNG" });
    await expect(png).toBeDisabled();

    await fill(page, {
      "Vardas ir pavardė": "Šarūnas Žemaitis",
      "Įmonė": "Pavyzdys, UAB",
      "Telefonas": "+370 600 12345",
      "El. paštas": "sarunas@pavyzdys.lt",
      "Interneto puslapis": "pavyzdys.lt",
    });
    await expect(page.locator("[data-qr-output] svg")).toBeVisible();
    await expect(page.locator("[data-qr-empty]")).toBeHidden();

    const [download] = await Promise.all([page.waitForEvent("download"), png.click()]);
    expect(download.suggestedFilename()).toBe("Pavyzdys, UAB - Šarūnas Žemaitis.png");
    const b64 = (await readFile(await download.path())).toString("base64");

    await page.addScriptTag({ path: require.resolve("jsqr/dist/jsQR.js") });
    const decoded = await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
      // @ts-expect-error jsQR is a global from the injected script
      return jsQR(data, width, height)?.data ?? null;
    }, `data:image/png;base64,${b64}`);

    expect(decoded).toContain("N:Žemaitis;Šarūnas;;;");
    expect(decoded).toContain("ORG:Pavyzdys\\, UAB");
    expect(decoded).toContain("TEL;TYPE=CELL:+37060012345");
    expect(decoded).toContain("URL:https://pavyzdys.lt");
  });

  test("invalid e-mail shows the error state and blocks downloads", async ({ page }) => {
    await page.goto("/projects/qr-contact-generator/");
    await fill(page, { "Vardas ir pavardė": "Jonas Jonaitis", "El. paštas": "jonas@" });
    await page.getByRole("textbox", { name: "Telefonas", exact: true }).focus();
    await expect(page.getByRole("textbox", { name: "El. paštas", exact: true })).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Patikrinkite el. pašto adresą.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Atsisiųsti SVG" })).toBeDisabled();
    await expect(page.getByText("Pataisykite pažymėtus laukus.")).toBeVisible();
  });
});
