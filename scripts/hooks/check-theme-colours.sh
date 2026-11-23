#!/usr/bin/env bash
# Theme rule (CLAUDE.md): hex colours live only in tokens.css; everything else uses the palette tokens.
set -euo pipefail
status=0
for f in "$@"; do
  if hits=$(grep -nE '#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?\b' -- "$f"); then
    echo "$f: hex colour outside tokens.css, use a var(--token):"
    echo "$hits"
    status=1
  fi
done
exit $status
