# Subset the résumé's Liberation Serif fonts, without a glyph-coverage check

The printed résumé (and the PDF CI makes from it) uses Liberation Serif so it matches the original PDF. The full fonts were about 145 KB each, and preloading them pushed the page's Lighthouse LCP to 3.3 s. So `themes/pico8/static/fonts/liberation-serif-*.woff2` are subset with `pyftsubset` to these ranges: Latin and Latin Extended (`U+0000-024F`), general punctuation, €, ™, arrows (`U+2190-21FF`) and geometric shapes (`U+25A0-25FF`, for the `▪` bullets). That brings each file to about 42 KB.

We chose not to add a hook that checks the résumé's characters against the subset fonts. The résumé changes rarely, and a missing glyph only shows up as one character in a fallback font, not as a broken page.

## Consequences

- If the résumé starts using a symbol outside those ranges (★, ✓, Cyrillic…), re-subset from the full Liberation Serif 2.1.5 (nixpkgs `liberation_ttf`) with the wider range, or add the check then:

  ```sh
  python3 -m fontTools.subset <full-font>.woff2 --flavor=woff2 --layout-features="kern,liga" \
    --unicodes="U+0000-024F,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0308,U+2000-206F,U+20AC,U+2122,U+2190-21FF,U+2212,U+2215,U+25A0-25FF,U+FEFF,U+FFFD" \
    --output-file=liberation-serif-<style>.woff2
  ```

  (needs `fonttools` and `brotli`)
- Don't replace these files with the full fonts "to be safe" without measuring the résumé's LCP again.
