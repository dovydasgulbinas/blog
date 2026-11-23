---
short: "Your phone and e-mail as a vCard QR code."
cart_bg: "light"
cart_alt: "QR code linking to dovydas.xyz"
summary: "Type in your phone and e-mail, get a vCard QR code. One scan saves you to someone’s contacts."
date: 2025-03-20
lastmod: 2026-11-23
title: "QR Contact Generator"
js: "qr.mjs"
css: "qr.css"
---

> Fill in your details and scan the code with a phone camera: it offers to save you as a contact. Everything runs in your browser; nothing is sent anywhere.

<noscript><p class="form-error">This tool needs JavaScript to draw the QR code.</p></noscript>

<div class="qr-app" data-qr-app lang="lt">
<form class="form qr-form" data-qr-form novalidate>
  <div class="form-row">
    <label class="form-label" for="qr-fullName">Vardas ir pavardė <span class="req" aria-hidden="true">*</span></label>
    <input class="field" id="qr-fullName" name="fullName" autocomplete="name" required aria-describedby="qr-fullName-err">
    <span class="form-error" id="qr-fullName-err" hidden>Įrašykite vardą ir pavardę.</span>
  </div>
  <div class="form-row">
    <label class="form-label" for="qr-organization">Įmonė</label>
    <input class="field" id="qr-organization" name="organization" autocomplete="organization">
  </div>
  <div class="form-row">
    <label class="form-label" for="qr-title">Pareigos</label>
    <input class="field" id="qr-title" name="title" autocomplete="organization-title">
  </div>
  <div class="form-row">
    <label class="form-label" for="qr-phone">Telefonas</label>
    <input class="field" id="qr-phone" name="phone" type="tel" autocomplete="tel" placeholder="+370 600 00000" aria-describedby="qr-phone-err">
    <span class="form-error" id="qr-phone-err" hidden>Tik skaičiai, tarpai, +, -, ( ir ).</span>
  </div>
  <div class="form-row">
    <label class="form-label" for="qr-email">El. paštas</label>
    <input class="field" id="qr-email" name="email" type="email" autocomplete="email" placeholder="vardas@pavyzdys.lt" aria-describedby="qr-email-err">
    <span class="form-error" id="qr-email-err" hidden>Patikrinkite el. pašto adresą.</span>
  </div>
  <div class="form-row">
    <label class="form-label" for="qr-url">Interneto puslapis</label>
    <input class="field" id="qr-url" name="url" inputmode="url" autocomplete="url" placeholder="pavyzdys.lt" aria-describedby="qr-url-err">
    <span class="form-error" id="qr-url-err" hidden>Patikrinkite adresą, pvz. pavyzdys.lt.</span>
  </div>
  <div class="form-row">
    <label class="form-label" for="qr-address">Fizinis adresas</label>
    <input class="field" id="qr-address" name="address" autocomplete="street-address">
  </div>
  <div class="form-row">
    <label class="form-label" for="qr-ecl">Klaidų taisymas</label>
    <span class="select">
      <select class="field" id="qr-ecl" name="ecl" aria-describedby="qr-ecl-hint">
        <option value="L">L · 7 %</option>
        <option value="M" selected>M · 15 %</option>
        <option value="Q">Q · 25 %</option>
        <option value="H">H · 30 %</option>
      </select>
    </span>
    <span class="form-hint" id="qr-ecl-hint">Daugiau taisymo – kodas veikia net nusitrynęs, bet būna didesnis.</span>
  </div>
</form>
<section class="qr-preview" aria-label="QR kodas">
  <div class="qr-screen px" data-qr-screen>
    <div class="qr-code" data-qr-output role="img" aria-label="vCard QR kodas" hidden></div>
    <p class="empty-state" data-qr-empty>Įrašykite vardą – kodas atsiras čia.</p>
  </div>
  <p class="form-hint" data-qr-meta aria-live="polite"></p>
  <div class="btn-row">
    <button type="button" class="btn-ui btn-ui--primary" data-qr-png disabled>Atsisiųsti PNG</button>
    <button type="button" class="btn-ui btn-ui--secondary" data-qr-svg disabled>Atsisiųsti SVG</button>
    <button type="button" class="btn-ui btn-ui--ghost" data-qr-copy disabled>Kopijuoti vCard</button>
  </div>
  <details class="qr-vcard">
    <summary class="form-label">vCard tekstas</summary>
    <pre><code data-qr-text></code></pre>
  </details>
</section>
</div>
