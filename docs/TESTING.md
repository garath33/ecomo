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

## Primární jazyk a další mutace

Vývoj, úpravy layoutu a průběžné testy běží jen na originálu.

- Chrome texty (menu, výzvy, jazyk dokumentu, popisky poptávky) jsou v `src/locales/cs.json`.
- Delší texty stránek zůstávají v českých šablonách. To je verze, kterou při úpravě layoutu otevíráme.
- `src/locales/index.ts` načítá jen `cs.json`, takže další jazyky nejsou součástí běžného bundlu.
- Nový jazyk je další JSON se stejnými klíči. Do šablon ani do Playwrighte se v pull requestu nepřidává.
- `npm run test:i18n` porovná klíče. Workflow `Locale release check` se spouští ručně, nebo při vydání release. Vizuální kontrola mutací patří sem, jednou před vydáním.

## Údržba testů

U každé změny uprav test, který pokrývá dotčený scénář. Sadu nerozšiřuj o případy, kterých se změna netýká. Klíčové scénáře jsou úvod, nabídka, kontakt a poptávka, podstránky služeb, O nás, čtyři šířky a shoda firemních údajů.

## Screenshoty v pull requestu

`tests/e2e/visual.spec.ts` uloží celou úvodní stránku na čtyřech šířkách. CI je přiloží jako artefakty `visual-screenshots` a `playwright-report`. Slouží k rychlému pohledu na vzhled v PR. Pixelové baseline v gitu nejsou, aby každá vizuální úprava nemusela přepisovat sadu obrázků.

## Odkazy

Job **Broken links** v `.github/workflows/ci.yml` po vytvoření pull requestu sestaví web s `PUBLIC_BASE_PATH=/` a spustí Lychee (`--offline`, `--index-files index.html`, včetně kotev). Pipeline hlásí interní 404. V Cursoru se odkazy neprocházejí ručně.
