# Po spuštění

Platí až ve chvíli, kdy je změna sloučená do `main` a na adrese webu běží ostrá verze (bez pruhu „Náhledové prostředí“). Náhled se do vyhledávání neposílá: `robots.txt` ho zakazuje a stránky mají `noindex`.

HTTPS vynucuje hosting. GitHub Pages přesměruje `http://` na `https://`. U vlastní domény ještě v repozitáři zapněte **Settings → Pages → Enforce HTTPS**.

## Google Search Console

1. Otevřete [Google Search Console](https://search.google.com/search-console).
2. Přihlaste se účtem, který má web spravovat.
3. Zvolte **Přidat službu** a typ **Předpona adresy URL**.
4. Vložte ostrou adresu i s cestou a lomítkem na konci. Dokud web běží na GitHub Pages, je to `https://garath33.github.io/ecomo/`. Až poběží na vlastní doméně, přidejte novou službu pro `https://www.ecomo.cz/`.
5. Ověřte vlastnictví. Na GitHub Pages je nejjednodušší **Značka HTML**: zkopírujte `content` z meta tagu, který Console nabídne, a doplňte ho do `<head>` v `src/layouts/BaseLayout.astro`. Po merge ověření zopakujte.
6. V levém menu otevřete **Soubory sitemap** (Index → Soubory sitemap).
7. Do pole vložte jen název souboru, ne celou adresu: `sitemap-index.xml`.
8. Odešlete. Stav má přejít na **Úspěšně**. První stažení může trvat několik hodin a první zobrazení ve výsledcích déle.
9. V **Kontrole adresy URL** zadejte úvodní stránku a použijte **Požádat o indexování**. Stejně pak `/fotovoltaika/`, `/tepelna-cerpadla/` a `/o-nas/`.

Sitemap generuje build (`@astrojs/sitemap`) a odkazuje na ni `robots.txt`. Stránka 404 v sitemapě není.

## Analytika bez cookies

Měření se do stránky vloží jen na ostrém buildu (`PUBLIC_SITE_ENV=production`) a jen když je vyplněná proměnná v GitHubu: **Settings → Secrets and variables → Actions → Variables**. Náhled se neměří. Vyplňte jednu variantu.

Doporučená je **Cloudflare Web Analytics**. Je zdarma, bez cookies a jeden účet utáhne víc webů.

1. V Cloudflare otevřete **Analytics & logs → Web Analytics → Add a site**.
2. Zvolte ruční vložení (JS snippet), ne automatické přepsání HTML.
3. Token z `data-cf-beacon` uložte jako proměnnou `CF_ANALYTICS_TOKEN`.
4. Push na `main` stránku znovu sestaví a beacon se vloží sám.

**Plausible** (placené, stejně bez cookies): proměnná `PLAUSIBLE_DOMAIN`, hodnota je doména bez `https://`, například `garath33.github.io` nebo později `www.ecomo.cz`.

**Umami** (open source, zdarma, ale ne na GitHub Pages): aplikaci a databázi (Supabase nebo Neon) hostujte třeba na Vercelu. Do proměnných pak dejte `UMAMI_SRC` (adresa `script.js`) a `UMAMI_WEBSITE_ID`. Na GitHub Pages stačí meta CSP z layoutu. Až web poběží na Cloudflare Pages, přidejte stejný původ i do `public/_headers`, jinak hlavička skript zablokuje.

## Bezpečnostní hlavičky

GitHub Pages umí HTTPS, ale neumí vlastní HTTP hlavičky. Proto je CSP i `Referrer-Policy` ve stránce jako meta tag. `script-src` povoluje i inline skripty sestavení (menu, formulář); stránka nevykresluje cizí HTML. Soubor `public/_headers` (`Content-Security-Policy`, `X-Content-Type-Options: nosniff` a další) začne platit, až se stejný build nasadí na Cloudflare Pages nebo Netlify, případně když před GitHub Pages postavíte Cloudflare proxy a hlavičky nastavíte tam.
