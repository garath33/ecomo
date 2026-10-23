# Testovací strategie

Běžná úprava se ověřuje na primární češtině. Cílem je chytit rozbitý build, layout a odkazy, a zároveň nespouštět vizuální kontrolu každé jazykové mutace v každém pull requestu.

## Smoke po buildu

`npm run test:smoke` čte `dist/` a skončí chybou, když:

- chybí `index.html`
- úvodní stránka neodkazuje na neprázdné CSS webu
- interní odkaz (včetně kotvy) nevede na soubor v sestavení

Externí adresy, `mailto:` a `tel:` smoke přeskakuje. Playwright smoke navíc otevře úvod a ověří, že se styl opravdu aplikuje (`lang="cs"`, font Sansation, žlutá hlavička).

## Responsivita

Šířky v `tests/e2e/viewports.ts`: **320, 768, 1024, 1440**. Na každé z nich drží úvod bez vodorovného přetečení. Do 1100 px je hamburger, na 1440 px zůstává horní menu.

## HTML a CSS

`npm run test:validate` po buildu:

- HTML v `dist/` prochází html-validate (sada recommended, jen chyby)
- CSS v `src/` a v `dist/` musí jít parsovat

## Jazyk

Web je jen v češtině. Další jazyk se nepřidává, dokud o něj uživatel výslovně nepožádá.

- Všechny texty webu jsou v `src/locales/cs.json`. Šablony jen skládají tyto texty s firemními údaji ze `src/site.config.ts`.
- `src/locales/index.ts` načítá jen `cs.json`.
- Testy v pull requestu renderují jen češtinu.
- `npm run test:i18n` a workflow Locale release check se nespouští, dokud v `src/locales/` není další jazyk, o který uživatel požádal.

## Údržba testů

U každé změny uprav test, který pokrývá dotčený scénář. Sadu nerozšiřuj o případy, kterých se změna netýká. Klíčové scénáře jsou úvod, nabídka, kontakt a poptávka, podstránky služeb, O nás, čtyři šířky a shoda firemních údajů.

## Regrese, E2E a screenshoty

| Příkaz | Co spouští |
| --- | --- |
| `npm run test:regression` | Unit testy a funkční Playwright označený `@regression` |
| `npm run test:e2e` | Celý Playwright: regrese, smoke v prohlížeči a `@visual` |
| `npm run test:visual` | Jen vizuální regrese úvodu na 320, 768, 1024 a 1440 px |

`tests/e2e/visual.spec.ts` porovná celou úvodní stránku s baseline v gitu a stejný snímek přiloží do artefaktů `visual-screenshots` a `playwright-report`. Po záměrné změně vzhledu se baseline obnoví příkazem `npx playwright test --grep @visual --update-snapshots`.

## Odkazy

Job **Broken links** v `.github/workflows/ci.yml` po vytvoření pull requestu sestaví web s `PUBLIC_BASE_PATH=/` a spustí Lychee (`--offline`, `--index-files index.html`, včetně kotev). Pipeline hlásí interní 404. V Cursoru se odkazy neprocházejí ručně.
