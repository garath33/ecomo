# Vývojový postup

Repozitář: [garath33/ecomo](https://github.com/garath33/ecomo). Ostří je větev `main`. Do ní se necommituje napřímo a nic se nemerguje, dokud není změna otestovaná a schválená.

## Větve

| Větev | Kdo | Účel |
| --- | --- | --- |
| `main` | nikdo přímo | ostrá verze |
| `feature/<nazev-funkce>` | člověk v Cursoru / lokálně | jedna úprava |
| `cursor/<nazev>-<id>` | Cursor Cloud Agent | totéž co `feature/`; platforma jiný prefix nepovolí |

Příklad: `feature/responsive-navigation`.

## Tok jedné změny

1. Větev z aktuálního `main`.
2. Jedna věc: jedna sekce, jeden bug, jeden obsahový balík.
3. Commit ve tvaru Conventional Commits, srozumitelně: `feat: add responsive navigation menu`. CI na pull requestu zprávu zkontroluje (`feat`, `fix`, `docs`, `ci`, `chore`, `test`, `refactor`).
4. Lokálně: `npm run test:all` (lint, unit, build, Playwright).
5. Push a pull request do `main`.
6. CI musí být zelené. Job uloží screenshoty úvodu, fotovoltaiky, tepelných čerpadel a kontaktu jako artifact `preview-screenshots`.
7. GitHub Pages nasadí náhled: https://garath33.github.io/ecomo/
8. Před schválením projde celá finální verze (včetně jazykových mutací, až nějaké budou; teď je web jen česky).
9. Uživateli se předloží odkaz na PR, náhled, výsledek CI a screenshoty. Merge do `main` až po jeho schválení.
10. Merge na `main` nasadí ostrou verzi stejné adresy, bez náhledového pruhu.

## Testy

| Příkaz | Co ověřuje |
| --- | --- |
| `npm run lint` | ESLint |
| `npm test` | unit testy obsahu a formuláře |
| `npm run build` | TypeScript + produkční sestavení |
| `npm run test:e2e` | Playwright: sekce, CTA, poptávka, podstránky, **responsivita**, **shoda náhledu s ostřím**, screenshoty pro PR |

Každá změna se testuje samostatně. V e2e vždy běží:

- layout na 375 / 768 / 1024 / 1280 px bez vodorovného overflow (do 1100 px hamburger, na desktopu horní menu)
- stejné IČO, DIČ, sídlo, telefon, e-mail a web jako v `src/site.config.ts` (zdroj pravdy pro náhled i ostří)

Neslučujeme více nesouvisejících věcí v jednom PR.

## Náhled vs. ostří

GitHub Pages umí v tomto repu jednu veřejnou adresu. Proto:

- push na `feature/**` nebo `cursor/**` → prostředí `preview`
- push na `main` → prostředí `production`

Dokud je otevřený PR, na adrese běží náhled. Po merge přepne na ostří.
