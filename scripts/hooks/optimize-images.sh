#!/usr/bin/env bash
# Lossless only: strip metadata (EXIF/GPS) and recompress PNG/JPEG without changing pixels.
# (A lossy cap like jpegoptim --max=85 re-encodes some JPEGs on every run, so it is not used.)
# pre-commit fails the commit when a file changes, so re-stage and commit again.
set -euo pipefail
for f in "$@"; do
  case "${f,,}" in
    *.jpg | *.jpeg) jpegoptim --quiet --strip-all --preserve -- "$f" ;;
    *.png) oxipng --quiet --opt 4 --strip safe -- "$f" ;;
  esac
done
