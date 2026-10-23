#!/bin/sh
# Ověří, že předměty commitů mezi BASE a HEAD jsou Conventional Commits.
# Použití: scripts/check-commit-messages.sh <base-sha> <head-sha>
set -eu

base=$1
head=$2
pattern='^(feat|fix|docs|ci|chore|test|refactor)(\([^)]+\))?: [^ ].+'
# Commit z doby před zavedením tohoto pravidla.
legacy='Add Cursor token-optimization rules and docs'
fail=0

subjects=$(git log --format=%s "$base".."$head")
if [ -z "$subjects" ]; then
  echo "Mezi $base a $head nejsou žádné commity."
  exit 0
fi

printf '%s\n' "$subjects" | while IFS= read -r subject; do
  [ -z "$subject" ] && continue
  if printf '%s\n' "$subject" | grep -Eq "$pattern"; then
    continue
  fi
  if [ "$subject" = "$legacy" ]; then
    continue
  fi
  echo "Commit message neodpovídá Conventional Commits: $subject"
  echo "Očekáváno např.: feat: add responsive navigation menu"
  exit 1
done
