# Plán webu Ecomo

Cíl: prezentační web malé firmy, která nabízí fotovoltaiku a tepelná čerpadla. Vzhled vychází z brandingu designéra (žlutá `#D8E716`, černá, wordmark ecomo, písmo Sansation).

## Zásady

- Ostří = `main`. Merge jen po náhledu a schválení.
- Malé PR, každá změna otestovaná samostatně (`npm run test:all`).
- Náhled i ostří berou stejný obsah z `src/site.config.ts`. Liší se jen pruh „Náhledové prostředí“.
- Každá změna má testy responsivity (375 / 768 / 1024 / 1280) a kontrolu, že na náhledu jsou stejné firemní údaje jako na ostří.

## Informační architektura

| Sekce | Kde | Stav |
| --- | --- | --- |
| Hero + CTA Kontaktujte nás | `/` | tmavé černé panely, bez modré oblohy |
| Co nabízím | `/#nabidka` | FVE montáž + foto TČ |
| Fotovoltaika | `/fotovoltaika/` | rodinné domy, firmy, obce, SVJ |
| Tepelná čerpadla | `/tepelna-cerpadla/` | první verze + foto jednotky |
| Hotové zakázky | schováno | komponenta zůstává, není na úvodu ani v menu |
| O nás | schováno | komponenta zůstává, není na úvodu ani v menu |
| Kontakt + formulář | `/#kontakt`, `/#poptavka` | údaje z ecomo.cz + vizitky |

## Kroky

### Hotovo

- [x] Repo, Astro, TypeScript, CI, GitHub Pages
- [x] Branding: žlutá / černá, Sansation, wordmark
- [x] Kontakty z ecomo.cz a vizitky (IČO, DIČ, sídlo, web, role)
- [x] Hotové zakázky s dodanými fotografiemi
- [x] Testy responsivity a shody náhled vs. ostří

### Další malé PR

- [ ] Další fotky (hlavně tepelná čerpadla) a popisy zakázek se souhlasem klienta
- [ ] Vlastní SVG wordmark, pokud designér dodá čistý vektor
- [ ] Napojení formuláře bez mailto
- [ ] Vlastní doména ecomo.cz místo `garath33.github.io/ecomo`
- [ ] GDPR text podle způsobu odesílání poptávek
