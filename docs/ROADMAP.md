# Roadmapa

Seznam funkcí prezentačního webu Ecomo. Stav odpovídá kódu na `main` plus tomu, co přináší otevřený PR workflow. Verze v `package.json` je **0.1.0**. Historie je v [CHANGELOG.md](CHANGELOG.md), struktura souborů v [ARCHITECTURE.md](ARCHITECTURE.md). Postup vývoje je v [CONTRIBUTING.md](../CONTRIBUTING.md).

Zásady, které platí pořád: ostří je `main`, obsah náhledu i ostří bere `src/site.config.ts`, každá změna projde `npm run test:all`.

## Přehled

| Funkce | Stav |
| --- | --- |
| Statický web (Astro, TypeScript, CI, GitHub Pages) | hotovo |
| Branding: žlutá `#D8E716`, černá, Sansation, wordmark | hotovo |
| Úvod: hero, nabídka, kontakt | hotovo |
| Podstránka fotovoltaiky | hotovo |
| Ilustrace segmentů na stránce fotovoltaiky | hotovo |
| Podstránka tepelných čerpadel | hotovo |
| Stránka O nás (odkaz v menu) | hotovo |
| Kontakt, patička, firemní údaje | hotovo |
| Formulář poptávky (validace a odeslání na e-mail) | hotovo |
| Lokální SEO (meta, Open Graph, JSON-LD, sitemap, robots) | hotovo |
| Náhledový pruh mimo produkci | hotovo |
| Samostatná adresa náhledu vedle ostří | hotovo |
| Responsivní menu a testy shody náhledu s ostřím | hotovo |
| Tokenová optimalizace (`.cursorignore`, `.cursorrules`) a git workflow | v tomto PR |
| Hotové zakázky na webu | komponenta je v repu, na stránkách se nevykresluje |
| Další fotky a popisy zakázek se souhlasem klienta | plánováno |
| Vektorový wordmark od designéra | plánováno |
| Vlastní doména ecomo.cz | hotovo, ostří `https://ecomo.cz/` |
| Text GDPR podle způsobu odesílání | plánováno |
| Ochrana větve `main` na GitHubu | plánováno, zapne vlastník repa |
| Kontrola nefunkčních odkazů v CI (Lychee) | hotovo |
| Odkazy na profily Google a Mapy.com | háčky v konfiguraci, adresy zatím prázdné |

## Hotovo

- Repozitář, Astro 5, TypeScript, ESLint, Vitest, Playwright, GitHub Actions a nasazení na GitHub Pages (`https://ecomo.cz/`).
- Vzhled podle brandingu: žlutá `#D8E716`, černá, písmo Sansation (Light a Bold), rastrový wordmark na světlém i tmavém pozadí.
- Úvodní stránka: hero s motem „Osobní přístup k vám i vašemu projektu“ a jedním CTA „Kontaktujte nás“, sekce Co nabízíme (fotovoltaika a tepelná čerpadla), kontakt a formulář. Menu Kontakt i „Kontaktujte nás“ doscrollují na výzvu „Neváhejte se na nás obrátit“. Text nad formulářem zve k telefonu nebo formuláři a říká, že první schůzku domluví Jiří Uldrich.
- Fotovoltaika: rodinné domy, firmy, obce a města, bytové domy a SVJ, každý segment s vlastní ilustrací v barvách značky. Postup zakázky je kontakt a smlouva, administrativa a realizace, u každého kroku žlutá značka.
- Tepelná čerpadla vzduch–voda značky Kensol v provedení monoblok: zhruba třetinová spotřeba elektřiny oproti přímotopu u nízkoteplotní soustavy, novostavba, rekonstrukce, kombinace s fotovoltaikou, co cena obvykle obsahuje. Fotografie venkovní jednotky ukazuje skříň s ventilátorem rovnoběžně u zdi domu.
- O nás: samostatná stránka `/o-nas/`, odkaz v hlavním menu. Na úvodu se sekce nevykresluje.
- Firemní údaje (IČO, DIČ, sídlo, telefon, e-mail, web, role) z jednoho místa, `src/site.config.ts`.
- Poptávka: kontrola jména, českého telefonu, e-mailu, tématu a zprávy a skryté pole `_honey`. Odeslání jde na `jiri.uldrich@ecomo.cz` přes FormSubmit v novém okně, aby stránka nezůstala na „Odesílám…“. Bez sítě nebo bez nového okna zůstane odkaz do e-mailového klienta a telefon. První odeslání musí jednatel potvrdit v e-mailu od FormSubmit (odkaz Activate Form), jinak se zpráva nedoručí.
- SEO: titulky a popisy stránek, canonical, Open Graph, Twitter card, JSON-LD `LocalBusiness`, `sitemap-index.xml`, `robots.txt`.
- Vlastní doména `ecomo.cz` na GitHub Pages. Produkční build používá `PUBLIC_SITE_URL=https://ecomo.cz` a `PUBLIC_BASE_PATH=/`. `www.ecomo.cz` míří na `garath33.github.io` a GitHub ho přesměruje na apex.
- Náhled z větve `cursor/**` nebo `feature/**` je na `/preview/` a ukazuje žluto-černý pruh „Náhledové prostředí“. Ostří z `main` pruh nemá a pracovní větev ho nepřepisuje.
- Testy rozvržení na 375 / 768 / 1024 / 1280 px a kontrola, že na stránce jsou stejné firemní údaje jako v konfiguraci.
- Double-check modelu před větším úkolem: `.cursor/rules/model-adequacy.mdc`.
- Testy: smoke po buildu, validace HTML/CSS, layout na 320 / 768 / 1024 / 1440 px, vizuální regrese úvodu a Lychee v jobu Broken links.
- Jazyk: jen čeština (`src/locales/cs.json`). Další jazyk až na výslovnou žádost uživatele.

## Nástroje v tomto PR

- `.cursorignore` vynechává `node_modules/`, `.next/`, `dist/`, `build/`, `package-lock.json`, `*.log`, `.git/` a generované složky Astro a Playwright.
- `.cursorrules` drží minimalizaci kontextu, architekturu, zápis do roadmapy a changelogu a git workflow.
- CI na pull requestu kontroluje conventional commits a ukládá screenshoty do artifactu `preview-screenshots`.

## Plánováno

- Další fotografie, hlavně tepelných čerpadel, a popisy hotových zakázek. Texty a fotky jdou na web až se souhlasem klienta. Až budou, vrátí se sekce z `src/components/Projects.astro` (data jsou v `projects` v `src/site.config.ts`).
- Vlastní SVG wordmark, až designér dodá čistý vektor. Do té doby zůstávají PNG v `public/brand/`.
- Text o zpracování osobních údajů. Krátký souhlas u formuláře říká, že údaje jsou jen k vyřízení poptávky a zpráva se odešle na firemní e-mail. Samostatný text zatím není a má jmenovat FormSubmit, přes který se poptávka doručuje.
- Search Console pro `https://ecomo.cz/`, až ostří z `main` poběží na vlastní doméně.
- Ochrana větve `main` (Require a pull request before merging). Token agenta na to nemá právo.
- Vyplnit `maps.googlePlace` a `maps.mapyPlace` v `src/site.config.ts`, až budou existovat profily. Prázdné hodnoty se do JSON-LD nedávají.

## Mimo úvod

`src/components/Projects.astro` a `src/components/About.astro` zůstávají v repu. O nás se skládá jen na `/o-nas/`. Zakázky se neskládají nikde: úvod je testem hlídaný tak, aby sekce `projects` a `about` na `/` nebyly.
