// QR Contact Generator: form → vCard 3.0 → QR code, drawn as SVG and exported as PNG or SVG.
// No framework; the QR encoder is qrcode-generator (MIT, Kazuhiko Arase) vendored as ./qrcode.mjs.
import { qrcode } from "./qrcode.mjs";

// Encode text as UTF-8 so names like "Šarūnas Žemaitė" survive the scan.
qrcode.stringToBytes = (s) => Array.from(new TextEncoder().encode(s));

const QUIET_ZONE = 4; // modules of white border the QR spec asks for
const PNG_SCALE = 12; // pixels per module in the downloaded PNG
const DARK = "#000000";
const LIGHT = "#ffffff";

const root = document.querySelector("[data-qr-app]");
if (root) init(root);

function init(root) {
  const form = root.querySelector("[data-qr-form]");
  const output = root.querySelector("[data-qr-output]");
  const empty = root.querySelector("[data-qr-empty]");
  const meta = root.querySelector("[data-qr-meta]");
  const text = root.querySelector("[data-qr-text]");
  const buttons = {
    png: root.querySelector("[data-qr-png]"),
    svg: root.querySelector("[data-qr-svg]"),
    copy: root.querySelector("[data-qr-copy]"),
  };

  const rules = {
    fullName: (v) => v.length > 0,
    phone: (v) => !v || /^[+\d][\d\s()-]{4,}$/.test(v),
    email: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    url: (v) => !v || /^(https?:\/\/)?[^\s.]+(\.[^\s.]+)+(\/\S*)?$/i.test(v),
  };
  const touched = new Set();
  let current = null; // { qr, vcard, name }

  const values = () => Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));

  function validate(v, showAll) {
    let ok = true;
    for (const [name, rule] of Object.entries(rules)) {
      const valid = rule(v[name] ?? "");
      ok &&= valid;
      const show = !valid && (showAll || touched.has(name));
      const input = form.elements[name];
      input.setAttribute("aria-invalid", String(show));
      const err = root.querySelector(`#qr-${name}-err`);
      if (err) err.hidden = !show;
    }
    return ok;
  }

  function render() {
    const v = values();
    const ok = validate(v, false);
    const vcard = ok ? toVCard(v) : "";
    text.textContent = vcard || "—";
    for (const b of Object.values(buttons)) b.disabled = !ok;

    if (!ok) {
      current = null;
      output.hidden = true;
      empty.hidden = false;
      empty.textContent = v.fullName ? "Pataisykite pažymėtus laukus." : "Įrašykite vardą – kodas atsiras čia.";
      meta.textContent = "";
      return;
    }
    const qr = qrcode(0, v.ecl || "M"); // 0 = smallest version that fits
    qr.addData(vcard, "Byte");
    qr.make();
    current = { qr, vcard, name: fileName(v) };
    output.innerHTML = toSvg(qr);
    output.hidden = false;
    empty.hidden = true;
    const n = qr.getModuleCount();
    meta.textContent = `${n}×${n} moduliai · ${new TextEncoder().encode(vcard).length} B`;
  }

  let timer;
  form.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(render, 120);
  });
  form.addEventListener("focusout", (e) => {
    if (e.target.name && e.target.value) {
      touched.add(e.target.name);
      render();
    }
  });
  form.addEventListener("submit", (e) => e.preventDefault());

  buttons.png.addEventListener("click", async () => {
    if (!current) return;
    const blob = await toPng(current.qr);
    download(blob, `${current.name}.png`);
  });
  buttons.svg.addEventListener("click", () => {
    if (!current) return;
    download(new Blob([toSvg(current.qr, true)], { type: "image/svg+xml" }), `${current.name}.svg`);
  });
  buttons.copy.addEventListener("click", async () => {
    if (!current) return;
    const b = buttons.copy;
    const label = b.textContent;
    try {
      await navigator.clipboard.writeText(current.vcard);
      b.textContent = "Nukopijuota ✓";
      b.classList.add("is-done");
    } catch {
      b.textContent = "Nepavyko";
    }
    setTimeout(() => {
      b.textContent = label;
      b.classList.remove("is-done");
    }, 1500);
  });

  render();
}

// vCard 3.0 (RFC 2426). Empty fields are left out; text values are escaped.
export function toVCard(v) {
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
  const parts = v.fullName.split(/\s+/);
  const family = parts.length > 1 ? parts.pop() : "";
  const given = parts.join(" ");
  const url = v.url && !/^https?:\/\//i.test(v.url) ? `https://${v.url}` : v.url;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(v.fullName)}`,
    v.organization && `ORG:${esc(v.organization)}`,
    v.title && `TITLE:${esc(v.title)}`,
    v.phone && `TEL;TYPE=CELL:${v.phone.replace(/[^\d+]/g, "")}`,
    v.email && `EMAIL;TYPE=INTERNET:${v.email}`,
    url && `URL:${url}`,
    v.address && `ADR;TYPE=WORK:;;${esc(v.address)};;;;`,
    "END:VCARD",
  ];
  return lines.filter(Boolean).join("\r\n");
}

function fileName(v) {
  const base = [v.organization, v.fullName].filter(Boolean).join(" - ") || "kontaktas";
  return base.replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, " ").trim();
}

// One <path> of 1×1 squares, crisp at any size. `standalone` adds the XML header for downloads.
function toSvg(qr, standalone = false) {
  const n = qr.getModuleCount();
  const size = n + QUIET_ZONE * 2;
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c + QUIET_ZONE} ${r + QUIET_ZONE}h1v1h-1z`;
    }
  }
  const head = standalone ? '<?xml version="1.0" encoding="UTF-8"?>\n' : "";
  return `${head}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"${standalone ? ` width="${size * PNG_SCALE}" height="${size * PNG_SCALE}"` : ""}><rect width="${size}" height="${size}" fill="${LIGHT}"/><path fill="${DARK}" d="${d}"/></svg>`;
}

function toPng(qr) {
  const n = qr.getModuleCount();
  const size = (n + QUIET_ZONE * 2) * PNG_SCALE;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = LIGHT;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = DARK;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) ctx.fillRect((c + QUIET_ZONE) * PNG_SCALE, (r + QUIET_ZONE) * PNG_SCALE, PNG_SCALE, PNG_SCALE);
    }
  }
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

function download(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
