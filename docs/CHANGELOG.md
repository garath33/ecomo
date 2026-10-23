# Historie změn

Formát vychází z [Keep a Changelog](https://keepachangelog.com/cs/1.1.0/). Verze se shoduje s polem `version` v `package.json`. Datum je den, kdy se verze sešla na `main`, v čase Europe/Prague.

## [Unreleased]

### Přidáno

- `.cursorignore` a `.cursorrules`: AI neindexuje `node_modules/`, build, lockfile, logy ani `.git/` a drží se pravidel minimalizace kontextu, architektury a dokumentace.
- Git workflow: člověk pracuje na `feature/<nazev>`, cloud agent na `cursor/<nazev>-<id>`. Merge do `main` až po schválení. CI kontroluje conventional commits (`feat`, `fix`, `docs`, `ci`, `chore`, `test`, `refactor`) a šablona PR žádá náhled, kontrolu a screenshoty.
- CI ukládá desktop screenshoty úvodu, fotovoltaiky, tepelných čerpadel a kontaktu jako artifact `preview-screenshots`. Deploy na Pages běží i z větví `feature/**`.
- Jazyk webu zůstává jen čeština, dokud uživatel nenahlásí další.

## [0.1.0] — 2026-10-02

První veřejná podoba prezentačního webu. Nasazuje se na GitHub Pages.

### Přidáno

- Statický web v Astro 5 a TypeScriptu: úvod, fotovoltaika, tepelná čerpadla, O nás a stránka 404.
- Branding: žlutá `#D8E716`, černá, písmo Sansation, wordmark ecomo.
- Firemní údaje, navigace, témata poptávky a dvě hotové zakázky v `src/site.config.ts`.
- Hero, nabídka dvou oborů, kontakt a patička s IČO, DIČ, sídlem a přímými kontakty.
- Formulář nezávazné poptávky: validace v prohlížeči, honeypot a sestavení `mailto`.
- Lokální SEO: titulky, popisy, canonical, Open Graph, Twitter card, JSON-LD `LocalBusiness`, sitemap a `robots.txt`.
- Náhledový pruh, když `PUBLIC_SITE_ENV` není `production`.
- CI (lint, unit testy, build, Playwright) a workflow pro GitHub Pages. Push na `cursor/**` je náhled, push na `main` je ostří.
- Testy responsivity (375 / 768 / 1024 / 1280 px) a shody firemních údajů s konfigurací.

### Změněno

- Úvod drží hero, nabídku a kontakt. Sekce hotových zakázek a O nás se na úvodu nevykreslují. O nás je samostatná stránka a odkaz v menu (2. 10. 2026, 9:26).
- Kontakt je v patičce. Nad formulářem je jedna výzva „Ozvěte se nezávazně“, bez duplicitního seznamu kontaktů.
- Texty mluví za firmu. Hero má jedno tlačítko „Kontaktujte nás“.
- Karta tepelného čerpadla na úvodu používá světlejší fotografii venkovní jednotky (`images/nabidka-tc.jpg`). Fotovoltaika na úvodu ukazuje tmavé panely.
- Nabídka tepelných čerpadel popisuje vzduch–voda, návrh výkonu, šetření na místě a spojení s fotovoltaikou. Stránka říká, co orientační cena obvykle obsahuje.

### Opraveno

- Kotva `#poptavka` doscrolluje formulář do viditelné oblasti.
- Menu do 1100 px se otevírá hamburgerem; testy čtou položku „Co nabízíme“ v otevřeném menu.
- Kontrola shody telefonu počítá s tím, že číslo je na stránce ve více odkazech `tel:`.
