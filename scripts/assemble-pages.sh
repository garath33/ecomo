#!/usr/bin/env bash
# Složí GitHub Pages: ostří z origin/main v kořeni a náhled této větve v dist/preview.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"

tmp="${RUNNER_TEMP:-$(mktemp -d)}"
preview_dist="$tmp/ecomo-preview-dist"
main_dir="$tmp/ecomo-main-src"
site_url="${PUBLIC_SITE_URL:-https://garath33.github.io}"

rm -rf "$preview_dist" "$main_dir"

echo "Náhled z $(git rev-parse --short HEAD)"
PUBLIC_SITE_ENV=preview PUBLIC_BASE_PATH=/ecomo/preview PUBLIC_SITE_URL="$site_url" npm run build
mkdir -p "$preview_dist"
cp -a dist/. "$preview_dist/"

git fetch origin main --depth=1
git worktree add --detach "$main_dir" origin/main

cleanup() {
  git worktree remove --force "$main_dir" >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Ostří z origin/main"
(
  cd "$main_dir"
  npm ci
  PUBLIC_SITE_ENV=production PUBLIC_BASE_PATH=/ecomo PUBLIC_SITE_URL="$site_url" npm run build
)

rm -rf dist
mkdir -p dist/preview
cp -a "$main_dir/dist/." dist/
cp -a "$preview_dist/." dist/preview/

node scripts/assert-preview-banner.mjs dist split
