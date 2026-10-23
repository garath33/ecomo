# Plán webu Ecomo

Stav funkcí je v [ROADMAP.md](ROADMAP.md), historie verzí v [CHANGELOG.md](CHANGELOG.md), struktura kódu v [ARCHITECTURE.md](ARCHITECTURE.md). Tento soubor drží zásady práce.

Cíl: prezentační web malé firmy, která nabízí fotovoltaiku a tepelná čerpadla. Vzhled vychází z brandingu designéra (žlutá `#D8E716`, černá, wordmark ecomo, písmo Sansation).

## Zásady

- Ostří = `main`. Merge jen po náhledu a schválení.
- Malé PR, každá změna otestovaná samostatně (`npm run test:all`).
- Náhled (`/preview/`) i ostří berou stejný obsah z `src/site.config.ts`. Liší se jen žluto-černý pruh „Náhledové prostředí“ na náhledu.
- Každá změna má testy responsivity (320 / 768 / 1024 / 1440) a kontrolu, že na náhledu jsou stejné firemní údaje jako na ostří. Testovací postup je v [TESTING.md](TESTING.md).

## Informační architektura

| Sekce | Kde | Stav |
| --- | --- | --- |
| Hero + CTA Kontaktujte nás | `/` | tmavé černé panely, bez modré oblohy |
| Co nabízíme | `/#nabidka` | montáž FVE + venkovní jednotka TČ |
| Fotovoltaika | `/fotovoltaika/` | rodinné domy, firmy, obce, SVJ |
| Tepelná čerpadla | `/tepelna-cerpadla/` | první verze + foto jednotky |
| Hotové zakázky | schováno | komponenta zůstává, není na úvodu ani v menu |
| O nás | `/o-nas/` | odkaz v menu, na úvodu se sekce nevykresluje |
| Kontakt + formulář | `/#kontakt`, `/#poptavka` | údaje z ecomo.cz + vizitky |

## Kroky

Hotové a plánované funkce jsou v [ROADMAP.md](ROADMAP.md). Sem se nekopírují, ať se seznam nerozejde.
