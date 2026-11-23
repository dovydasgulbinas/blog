Self-hosted Google Fonts (latin and latin-ext subsets), all under the SIL Open Font License 1.1:

- Pixelify Sans — https://fonts.google.com/specimen/Pixelify+Sans
- Silkscreen — https://fonts.google.com/specimen/Silkscreen
- VT323 — https://fonts.google.com/specimen/VT323

Liberation Serif 2.1.5 (from nixpkgs `liberation_ttf`, converted with `woff2_compress`, then subset to Latin and Latin Extended with `pyftsubset`) — SIL Open Font License 1.1, https://github.com/liberationfonts/liberation-fonts. Used only for the printed résumé.

`../../assets/fonts/` holds full TTF builds of Pixelify Sans (bold) and Silkscreen from Google Fonts (same SIL OFL 1.1). Hugo's `images.Text` needs TTF; they are used only to draw share images at build time and are never served.
