# Vývojový postup

Ostří je větev `main`. Do ní se nic nemerguje, dokud není změna otestovaná a schválená.

## Tok jedné změny

1. Malá větev z `main` (`cursor/<kratky-nazev>-35b8`).
2. Jedna věc: jedna sekce, jeden bug, jeden obsahový balík.
3. Lokálně: `npm run test:all` (lint, unit, build, Playwright).
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
| `npm run test:e2e` | Playwright: sekce, CTA, poptávka, podstránky |

Každá změna se testuje samostatně. Neslučujeme více nesouvisejících věcí v jednom PR.

## Náhled vs. ostří

GitHub Pages umí v tomto repu jednu veřejnou adresu. Proto:

- push na `cursor/**` → prostředí `preview`
- push na `main` → prostředí `production`

Dokud je otevřený PR, na adrese běží náhled. Po merge přepne na ostří.
