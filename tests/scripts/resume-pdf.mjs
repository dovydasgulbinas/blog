// Print /resume/ from a built site to PDF, the way a browser's "Save as PDF" would.
// usage: node scripts/resume-pdf.mjs <site dir> <output.pdf>
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "@playwright/test";

const [siteArg, outArg] = process.argv.slice(2);
if (!siteArg || !outArg) {
  console.error("usage: node scripts/resume-pdf.mjs <site dir> <output.pdf>");
  process.exit(2);
}
const root = resolve(siteArg);
const out = resolve(outArg);

const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

// Minimal static server so absolute /fonts/… URLs resolve (file:// would break them).
const server = createServer((req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  let file = join(root, path);
  if (!file.startsWith(root)) return res.writeHead(403).end();
  try {
    if (statSync(file).isDirectory()) file = join(file, "index.html");
    statSync(file);
  } catch {
    return res.writeHead(404).end();
  }
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/resume/`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready);
  const missing = await page.evaluate(() => !document.fonts.check('10pt "Liberation Serif"'));
  if (missing) throw new Error("Liberation Serif did not load; refusing to print with a fallback font");
  // Letter, like the original PDF. Margins come from the résumé's print CSS.
  await page.pdf({ path: out, format: "Letter", preferCSSPageSize: true, printBackground: false, tagged: true, outline: true });
  console.log(`wrote ${out}`);
} finally {
  await browser.close();
  server.close();
}
