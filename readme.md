# dovydas.xyz

Source of https://dovydas.xyz: a [Hugo](https://gohugo.io) site with the in-repo `pico8` theme.

```sh
nix develop          # hugo, htmltest, just, node; installs the git hooks
just dev             # http://localhost:1313
just ci              # build, link check, Playwright smoke tests (run `just test-setup` once)
```

- Content: `content/<section>/<slug>/index.md` page bundles. See [CLAUDE.md](CLAUDE.md) for the rules.
- Theme: `themes/pico8/`, built from the "dovydas.xyz — PICO-8 redesign" design canvas.
- Deploy: every push to `master` builds with Nix, runs the tests and publishes to GitHub Pages (`.github/workflows/site.yml`).
- `nix build` gives the built site in `./result`; `nix flake check` runs the git hooks, including a build and htmltest.
