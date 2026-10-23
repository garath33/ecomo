# Changelog — Ecomo web

## [Unreleased]

### Added

- Git workflow v `.cursorrules` a `CONTRIBUTING.md`: větve `feature/<nazev>` (cloud agent `cursor/…`), conventional commits, merge do `main` až po schválení, náhled a screenshoty.
- CI na pull requestu odmítne commit bez předpony `feat:`, `fix:`, `docs:`, `ci:`, `chore:`, `test:` nebo `refactor:`. Nový PR má šablonu s náhledem, kontrolou a screenshoty.
- CI ukládá desktop screenshoty klíčových stránek jako artifact `preview-screenshots`. Deploy na Pages běží i z větví `feature/**`.
- `.cursorignore` — vyloučení `node_modules/`, build výstupů, lockfile, logů, `.git/` a generovaných složek Astro/Playwright z indexování AI.
- `.cursorrules` — systémová pravidla Cursor AI (minimalizace tokenů, architektura, dokumentace do ROADMAP/CHANGELOG).
- `docs/ROADMAP.md` — roadmap včetně odložených kroků po zapojení vlastní domény.
