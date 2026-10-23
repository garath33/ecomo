# Roadmap — Ecomo web

Živý přehled plánovaných a odložených prací. Detailní obsahový plán zůstává v `docs/PLAN.md`.

## Hotovo (nedávno)

- [x] Tokenová optimalizace Cursoru: `.cursorignore` + `.cursorrules` (minimalizace kontextu)

## Další malé PR (bez vlastní domény)

- [ ] Kontrola broken links v CI (Lychee / htmlproofer) — pravidlo v `.cursorrules`, zatím není v pipeline
- [ ] Další fotky (hlavně tepelná čerpadla) a popisy zakázek se souhlasem klienta
- [ ] Vlastní SVG wordmark, pokud designér dodá čistý vektor
- [ ] Napojení formuláře bez mailto
- [ ] GDPR text podle způsobu odesílání poptávek

## Odloženo do vlastní domény (ecomo.cz)

Až bude doména aktivní a nasměrovaná na hosting, dokončit:

- [ ] GitHub Pages: custom domain `www.ecomo.cz` / `ecomo.cz` (CNAME / DNS A/AAAA)
- [ ] Build env: `PUBLIC_SITE_URL=https://www.ecomo.cz` a `PUBLIC_BASE_PATH=/` (místo `/ecomo` na github.io)
- [ ] Ověřit sitemap, `robots.txt`, canonical a Open Graph absolutní URL na ostré doméně
- [ ] Search Console / Bing Webmaster (ověření vlastnictví + odeslání sitemap)
- [ ] Aktualizovat odkazy v README / CONTRIBUTING z `garath33.github.io/ecomo` na produkční URL
