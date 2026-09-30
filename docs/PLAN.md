# Plán webu Ecomo

Cíl: prezentační web malé firmy, která nabízí fotovoltaiku a tepelná čerpadla. Design se v dalších krocích srovná s vašimi návrhy (do tohoto prostředí zatím nedorazily jako soubory).

## Zásady

- Ostří = `main`. Merge jen po náhledu a schválení.
- Malé PR, každá změna otestovaná samostatně (`npm run test:all`).
- Texty jsou vlastní, inspirované tématy z [fotovoltaika](https://www.fotovolty.cz/fotovoltaika) a [instalace tepelných čerpadel](https://www.fotovolty.cz/instalace-tepelnych-cerpadel), bez ceníků, značek a fotografií cizí firmy.
- Reference bez fiktivních recenzí. Klienty doplníme, až je budete mít odsouhlasené.

## Informační architektura

| Sekce | Kde | Stav |
| --- | --- | --- |
| Hero + CTA Nezávazná poptávka | `/` | první verze v tomto PR |
| Co nabízím | `/#nabidka` | první verze |
| Fotovoltaika | `/fotovoltaika/` | první verze (rodinné domy, firmy, obce, SVJ) |
| Tepelná čerpadla | `/tepelna-cerpadla/` | první verze |
| Reference | `/#reference` | záměrně prázdné karty k doplnění |
| O nás | `/#o-nas` | první verze z firemních údajů |
| Kontakt + formulář | `/#kontakt`, `/#poptavka` | Jiří Uldrich, tel, e-mail, mailto formulář |

CTA vede na formulář a zároveň nabízí přímé volání na 604 251 324.

## Kroky

### Hotovo v tomto PR

- [x] Repo, Astro, TypeScript
- [x] CI (lint, unit, build, e2e)
- [x] Náhled na GitHub Pages z feature větve, ostří jen z `main`
- [x] Layout, navigace, CTA
- [x] Všechny požadované sekce v první obsahové verzi
- [x] Formulář s validací a telefonním kontaktem

### Další PR, malé a samostatné

- [ ] Nasadit vaše designové návrhy (barvy, písmo, layout, logo) — **potřebuji soubory**
- [ ] Doplnit fotografie instalací
- [ ] Doplnit reálné reference po souhlasu klientů
- [ ] Upřesnit značky TČ / technologie FVE, které skutečně montujete
- [ ] Logo a favicon podle brandu
- [ ] Napojení formuláře na odesílání bez mailto (až budete chtít)
- [ ] Vlastní doména ecomo.cz místo `garath33.github.io/ecomo`
- [ ] GDPR text / cookies podle toho, jak bude formulář odesílat data
- [ ] SEO: sitemap, Open Graph obrázek, tituly podle finálního copy

## Co od vás potřebuji, než půjdeme do vizuálu

1. Designové návrhy (Figma, PDF, PNG) — v chatu je zmiňujete, ale do agentího prostředí nedorazily.
2. Logo.
3. Fotky realizací, které smíme použít.
4. 2–4 reference: obec, výkon, jedna věta, souhlas klienta.
5. Značky a technologie, které opravdu nabízíte (ať nepíšeme cizí ceník).
6. Obsluhovaný region (Praha-východ / Středočeský / celá ČR?).
7. Má formulář jen otevírat e-mail, nebo chcete, aby vám poptávka chodila sama?
