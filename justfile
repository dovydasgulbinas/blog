# dovydas.xyz — run `just` to list recipes. Tools come from `nix develop`.

set shell := ["bash", "-euo", "pipefail", "-c"]

default:
    @just --list

# Live preview with drafts at http://localhost:1313
dev:
    hugo server --buildDrafts --disableFastRender

# Production build into public/
build:
    hugo build --minify --gc --panicOnWarning

# Check internal links and anchors in public/ (add --external to also check outbound links)
links *flags: build
    htmltest --conf .htmltest.yml {{ if flags == "--external" { "" } else { "--skip-external" } }} public

# Install test dependencies and the Chromium build Playwright uses
test-setup:
    cd tests && npm ci && npx playwright install chromium

# Playwright smoke tests against public/
test *args: build
    cd tests && npx playwright test {{ args }}

# Visual snapshots (macOS baselines; run locally, not in CI)
test-visual *args: build
    cd tests && npx playwright test --project=visual {{ args }}

# Print /resume/ to content/resume/dovydas-gulbinas-resume.pdf (CI also regenerates it on every deploy)
resume-pdf: build
    cd tests && node scripts/resume-pdf.mjs ../public ../content/resume/dovydas-gulbinas-resume.pdf

# Everything CI runs
ci: links test

# Scaffold a post bundle: just post my-new-post
post slug:
    hugo new content "blog/{{ slug }}/index.md"
    @echo "Edit content/blog/{{ slug }}/index.md (set categories and remove draft)"

# Run every git hook on every file (build, htmltest, content, SEO, images), as CI does
nix-check:
    nix flake check -L
