# Architektura

Statický prezentační web [Ecomo s.r.o.](https://www.ecomo.cz). Sestavení dělá Astro 5 (`output` je výchozí static). Node 22. Veřejná cesta je `/ecomo` na `https://garath33.github.io`, dokud nepřijde vlastní doména.

Jediný zdroj firemních údajů je `src/site.config.ts`. Stránky, patička, JSON-LD i testy shody berou údaje odtud.

## Strom

```
src/
  site.config.ts          údaje firmy, SEO texty, menu, témata poptávky, zakázky
  env.d.ts                typy Vite / Astro
  layouts/BaseLayout.astro
  pages/                  routy
  components/             UI bloky
  lib/                    čisté funkce bez DOM
  scripts/inquiry.ts      obsluha formuláře v prohlížeči
  styles/global.css       proměnné, layout, komponenty
  fonts/                  Sansation Light a Bold (woff2)
public/
  brand/                  wordmark PNG
  images/                 hero, nabídka, zakázky
  favicon.svg
  legal/sansation-ofl.txt licence písma
tests/
  unit/                   Vitest
  e2e/                    Playwright
.github/workflows/        CI a GitHub Pages
```

## Tok stránky

`BaseLayout` obalí každou routu. Do `<head>` dává titul, popis, geo meta, canonical, favicon, Open Graph, Twitter card a `JsonLd`. V `<body>` je odkaz „Přeskočit na obsah“, `PreviewBanner`, `Header`, `<main id="obsah">` a `Footer`. Skript v layoutu po načtení a při `hashchange` scrolluje na kotvu.

`PUBLIC_SITE_ENV` se do buildu vkládá ve `vite.define` v `astro.config.mjs`. `isPreview()` v `src/lib/paths.ts` je pravda, když hodnota není `production`, a tehdy `BaseLayout` vloží náhledovou lištu a `noindex`. Lokální `npm run dev` proto pruh ukazuje. Workflow Pages na `main` staví jen ostří (`PUBLIC_BASE_PATH=/ecomo`). Workflow z `feature/**` a `cursor/**` přidá náhled do `/ecomo/preview/` a ostří vedle něj znovu sestaví z `origin/main`.

`site` a `base` v `astro.config.mjs` berou `PUBLIC_SITE_URL` (výchozí `https://garath33.github.io`) a `PUBLIC_BASE_PATH` (výchozí `/ecomo`). Odkazy v komponentách jdou přes `withBase()`, aby fungovaly pod touto cestou. `trailingSlash` je `always`, formát buildu je `directory`.

## Stránky

| Soubor | URL | Skládá |
| --- | --- | --- |
| `src/pages/index.astro` | `/` | `Hero`, `Offer`, `Contact` |
| `src/pages/fotovoltaika.astro` | `/fotovoltaika/` | vlastní hero a karty segmentů, postup zakázky, `Contact` |
| `src/pages/tepelna-cerpadla.astro` | `/tepelna-cerpadla/` | vlastní hero, výběr technologie, rozsah ceny, `Contact` |
| `src/pages/o-nas.astro` | `/o-nas/` | `About` |
| `src/pages/404.astro` | 404 | text a odkaz na úvod |
| `src/pages/robots.txt.ts` | `/robots.txt` | `Allow: /` a odkaz na sitemap |

Sitemap skládá integrace `@astrojs/sitemap`. Filtr vynechá URL obsahující `/404`.

Menu v `navigation` vede na `/#nabidka`, `/fotovoltaika/`, `/tepelna-cerpadla/`, `/o-nas/` a `/#kontakt`. Tlačítko v hlavičce míří na `/#poptavka`.

## Komponenty

| Komponenta | Úloha |
| --- | --- |
| `Header` | Wordmark, odkazy z `navigation`, CTA poptávky. Do 1100 px hamburger (`data-nav-toggle`) otevírá `#hlavni-menu`. `aria-current="page"` sedí, když cesta přesně odpovídá `href`. |
| `Footer` | `#kontakt`. Sídlo, IČO, DIČ, osoba, telefon, e-mail, web a odkazy na poptávku a obě služby. Wordmark ve variantě `onDark`. |
| `Logo` | PNG wordmark. `onDark` přepne na bílý soubor. `alt` je `ecomo`. |
| `Hero` | Úvodní fotografie panelů, claim, jeden odkaz „Kontaktujte nás“ na `#poptavka`, tři krátké body (na klíč, osobně, dva obory). |
| `Offer` | `#nabidka`. Dvě karty: fotovoltaika (`images/nabidka-fv.jpg`) a tepelné čerpadlo (`images/nabidka-tc.jpg`), každá s odkazem na podstránku. |
| `Contact` | Výzva s telefonem a karta `#poptavka` s `InquiryForm`. |
| `InquiryForm` | Pole jméno, telefon, e-mail, téma (`inquiryTopics`), zpráva a skryté pole `website`. Po submitu načte `src/scripts/inquiry.ts`. |
| `About` | Text o firmě a jednateli, tři body, CTA na poptávku. Používá ho jen `/o-nas/`. |
| `Projects` | `#zakazky`. Karty z pole `projects`. Žádná stránka ji teď neimportuje. |
| `PreviewBanner` | Pruh náhledu, jen když `isPreview()` vrátí pravdu. |
| `JsonLd` | `<script type="application/ld+json">` z `localBusinessJsonLd`. |

## Knihovny

`src/lib/paths.ts`

- `withBase(path)` spojí `import.meta.env.BASE_URL` a relativní cestu.
- `isPreview()` porovná `PUBLIC_SITE_ENV` s `production`.

`src/lib/inquiry.ts` (bez DOM, kryté unit testy)

- `validateInquiry` vrací chyby po polích. Neprázdné `website` skončí obecnou chybou `form` a dál nekontroluje.
- Telefon po vyhození mezer a závorek musí sedět na `^(\+420)?[1-9]\d{8}$`.
- Zpráva má alespoň 10 znaků, jméno alespoň 2, téma musí být v `inquiryTopics`.
- `buildMailto` složí předmět a tělo na danou adresu.
- `readInquiryForm` čte `FormData`.

`src/lib/local-business.ts` skládá schema.org `LocalBusiness`: adresa, geo, telefon, e-mail, IČO, DIČ, founder, `areaServed`, `knowsAbout`. `sameAs` dostane web a jen neprázdné `maps.googlePlace` / `maps.mapyPlace`.

`src/scripts/inquiry.ts` poslouchá submit na `[data-inquiry-form]`, vypíše chyby do `[data-error-for]`, nastaví `aria-invalid` a při úspěchu ukáže odkaz „Otevřít e-mailový klient“. Mailto si formulář pamatuje v `data-last-mailto`.

## Vzhled

`src/styles/global.css` definuje barvy (`--brand` `#d8e716`, `--ink`, `--paper`), písmo a layout (`.wrap`, `.hero`, `.card`, `.grid-2`, `.grid-3`, `.form`). Hamburger je vidět do `max-width: 1100px`. `prefers-reduced-motion: reduce` ztlumí animace.

Fotografie v `public/images/`: `hero-fv-panels.jpg`, `nabidka-fv.jpg`, `nabidka-tc.jpg`, `zakazka-pristresek.jpg`, `zakazka-strecha.jpg`. Poslední dvě používá jen komponenta zakázek.

## Testy a nasazení

| Příkaz | Co běží |
| --- | --- |
| `npm run lint` | ESLint |
| `npm test` | Vitest: `tests/unit/site.test.ts`, `inquiry.test.ts`, `seo.test.ts` |
| `npm run build` | `astro check` a `astro build` |
| `npm run test:e2e` | Playwright proti `astro preview` na `127.0.0.1:4321/ecomo/` |

E2E soubory: `home.spec.ts`, `about.spec.ts`, `inquiry.spec.ts`, `responsive.spec.ts`, `parity.spec.ts`. Projekty Playwright jsou `chromium` a `mobile` (Pixel 7). `parity` hlídá, že na stránce jsou hodnoty z `productionFacts`.

`.github/workflows/ci.yml` pouští lint, unit, build a e2e na pull requestu a na push do `main` a `cursor/**`. `.github/workflows/pages.yml` nasadí GitHub Pages. Prostředí se jmenuje `production` na `main` (https://garath33.github.io/ecomo/) a `preview` na pracovní větvi (https://garath33.github.io/ecomo/preview/). Nasazení se řadí za sebe, aby se ostří a náhled nepřepsaly v půlce.
