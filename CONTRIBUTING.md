# Vývojový postup

Ostří je větev `main`. Do ní se nic nemerguje, dokud není změna otestovaná a schválená.

## Tok jedné změny

1. Malá větev z `main` (`cursor/<kratky-nazev>-35b8`).
2. Jedna věc: jedna sekce, jeden bug, jeden obsahový balík.
3. Lokálně: `npm run test:all` (lint, unit, build, smoke, validace HTML/CSS, Playwright).
4. Push a **draft pull request** do `main`.
5. CI na PR musí být zelené.
6. GitHub Pages nasadí náhled z feature větve: https://garath33.github.io/ecomo/
7. Až po vašem schválení se PR označí jako ready a sloučí do `main`.
8. Merge na `main` nasadí ostrou verzi stejné adresy, bez náhledového pruhu.

## Testy

| Příkaz | Co ověřuje |
| --- | --- |
| `npm run lint` | ESLint |
| `npm test` | unit testy obsahu a formuláře |
| `npm run build` | TypeScript + produkční sestavení |
| `npm run test:smoke` | Po buildu: `index.html`, načtené CSS, interní odkazy |
| `npm run test:validate` | Validita HTML (html-validate) a CSS (syntaktická) |
| `npm run test:regression` | Unit testy a funkční Playwright (`@regression`) |
| `npm run test:e2e` | Playwright včetně regrese, responsivity a vizuální regrese |
| `npm run test:visual` | Screenshotová regrese úvodu na 320 / 768 / 1024 / 1440 px |
| `npm run test:i18n` | Před vydáním: klíče dalších locale proti `cs.json` |

Podrobnosti jsou v [docs/TESTING.md](docs/TESTING.md).

Každá změna se testuje samostatně. Uprav test, který změna rozbije, a nepřidávej nové scénáře k částem, kterých se netýká. V e2e vždy běží:

- layout na 320 / 768 / 1024 / 1440 px bez vodorovného overflow (do 1100 px hamburger, na desktopu horní menu)
- stejné IČO, DIČ, sídlo, telefon, e-mail a web jako v `src/site.config.ts` (zdroj pravdy pro náhled i ostří)
- jen primární čeština (`src/locales/cs.json` a české šablony)

Rozbité odkazy v pull requestu hlídá job **Broken links** (Lychee, offline, proti sestavenému `dist/`). V editoru se odkazy neprocházejí ručně.

Neslučujeme více nesouvisejících věcí v jednom PR.

## Náhled vs. ostří

GitHub Pages umí v tomto repu jednu veřejnou adresu. Proto:

- push na `cursor/**` → prostředí `preview`
- push na `main` → prostředí `production`

Dokud je otevřený PR, na adrese běží náhled. Po merge přepne na ostří.
