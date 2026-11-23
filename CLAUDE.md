# dovydas.xyz

Personal blog built with [Hugo](https://gohugo.io) and the in-repo `pico8` theme (`themes/pico8/`).
Deployed to GitHub Pages at https://dovydas.xyz from `master`.
Words used here (Post, Project, Song, Category, Ramp…) are defined in [GLOSSARY.md](GLOSSARY.md).

## Commands

Toolchain comes from the flake: run `nix develop` (or use direnv) first. Hugo is pinned by `flake.lock`, never by a global install.

| Task | Command |
| --- | --- |
| Live preview with drafts | `just dev` |
| Production build into `public/` | `just build` |
| Internal link check | `just links` |
| Playwright smoke tests (desktop + phone) | `just test` (once: `just test-setup`) |
| Visual snapshots (macOS baselines, not in CI) | `just test-visual` |
| Everything CI runs | `just ci` |
| New post | `just post my-slug` |
| Résumé PDF from the HTML page | `just resume-pdf` (CI does this on every deploy) |

`nix build` builds the site reproducibly into `./result`; `nix flake check` builds it and runs htmltest.

## Layout

```
hugo.toml            site config (menus, taxonomies, outputs, params)
content/             one page bundle per page: <section>/<slug>/index.md + its files
static/              files copied verbatim (PDFs, zips)
themes/pico8/        the theme: layouts/, assets/ (css, js, sprites), static/fonts
tests/               Playwright tests, run against `public/` served on :3000
```

## Content rules

- Every Post is a **page bundle**: `content/blog/<slug>/index.md` with its images next to it. Never put post images in `static/`.
- The folder name is the slug and the URL (`/blog/<slug>/`). Never rename a published folder; if you must, add the old path to `aliases`.
- Front matter is YAML. A Post has `title`, `date`, optional `lastmod`, exactly one `categories` entry, optional `summary` and `cover` (a bundle image filename).
- `categories` must be one of the keys in `params.categories` in `hugo.toml`; each key sets the tag colour and dither Ramp.
- Use `<!--more-->` or `summary` for list excerpts, not truncated HTML.
- Callouts use GitHub alert syntax: `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`. Do not invent shortcodes for things Markdown can express.
- Raw HTML is allowed (`markup.goldmark.renderer.unsafe = true`) but keep it rare; prefer render hooks.
- Code fences always carry a language (```` ```python ````) so Chroma can highlight them.
- Drafts: `draft: true`; they render in `just dev` only.

## Theme rules (`themes/pico8`)

- The design source of truth is the "dovydas.xyz — PICO-8 redesign" canvas. Its rules: 16 PICO-8 colours only, no `rgba()`/opacity/blur/gradients, hard 4px offsets, ordered dither for "in between".
- Colours live as CSS custom properties in `assets/css/tokens.css` (`--c0`…`--c15` plus role names). Never write a hex value anywhere else.
- Fonts are self-hosted woff2 in `static/fonts/` (Pixelify Sans display, Silkscreen labels, VT323 body/code). No third-party requests from pages.
- CSS and JS go through Hugo Pipes (`resources.Get` → `minify` → `fingerprint`), linked with `integrity`. No npm build step, no frameworks.
- JS is progressive enhancement only: every page must read and navigate with JS off.
- Images: process with `.Process`/`images.Dither` via `partials/func/dither.html` (Atkinson; Hugo has no Bayer); always emit `width`, `height` and `alt`. Pixel art uses the `.pixel` class (`image-rendering: pixelated`) and integer scales only.
- Keep layouts small: `baseof.html` + section templates + partials. Logic that repeats goes in a partial; never copy markup between templates.
- Use Hugo's own features before writing code: taxonomies for tags, `.Paginate` for paging, `.NextInSection` for older/newer, output formats for RSS and the search index, render hooks for headings/links/images/alerts.
- Prefer `hugo.toml` `params` over hard-coded strings in templates (author, socials, intro text).

## Accessibility and quality bar

- Text contrast ≥ 4.5:1 (the canvas lists the allowed text/background pairs). Dark grey `--c5` is for rules only.
- Real `<a>`/`<button>`, visible focus (`4px dashed` yellow), touch targets ≥ 44px, `aria-current` on the active nav link.
- Heading IDs are `github-ascii` so old Lektor anchors (`#jeruzale`) keep working; pin an id with `{#id}` if a title change would break a link.
- Every page has a unique `<title>`, meta description, canonical URL and Open Graph tags (from `partials/head.html`).
- `just ci` must pass before merging: build with `--panicOnWarning`, htmltest, Playwright.

## Things to avoid

- Don't add a `node_modules`-based build for the site; Node exists only for `tests/`.
- Don't commit `public/`, `resources/_gen/` or `.hugo_build.lock`.
- Don't use `.Site.Data` for content that belongs in front matter.
- Don't use `absURL` with leading slashes for internal links; use `.RelPermalink` / `relURL`.
