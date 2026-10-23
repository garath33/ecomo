# Po spuštění

GitHub Pages (`garath33.github.io`) ani dočasná adresa na Cloudflare Pages se neindexují. `robots.txt` je zakazuje a stránky mají `noindex`. Search Console a sitemap se řeší až ve chvíli, kdy web běží na vlastní doméně, cílově `https://www.ecomo.cz/`. Do té doby Google na dočasnou adresu neposílejte.

HTTPS vynucuje hosting. GitHub Pages přesměruje `http://` na `https://`. U vlastní domény ještě v repozitáři zapněte **Settings → Pages → Enforce HTTPS**.

## Google Search Console

1. Otevřete [Google Search Console](https://search.google.com/search-console).
2. Přihlaste se účtem, který má web spravovat.
3. Zvolte **Přidat službu** a typ **Předpona adresy URL**.
4. Vložte ostrou adresu vlastní domény i s lomítkem na konci, cílově `https://www.ecomo.cz/`. Adresu na `github.io` ani `pages.dev` nepřidávejte.
5. Ověřte vlastnictví. Na GitHub Pages je nejjednodušší **Značka HTML**: zkopírujte `content` z meta tagu, který Console nabídne, a doplňte ho do `<head>` v `src/layouts/BaseLayout.astro`. Po merge ověření zopakujte.
6. V levém menu otevřete **Soubory sitemap** (Index → Soubory sitemap).
7. Do pole vložte jen název souboru, ne celou adresu: `sitemap-index.xml`.
8. Odešlete. Stav má přejít na **Úspěšně**. První stažení může trvat několik hodin a první zobrazení ve výsledcích déle.
9. V **Kontrole adresy URL** zadejte úvodní stránku a použijte **Požádat o indexování**. Stejně pak `/fotovoltaika/`, `/tepelna-cerpadla/` a `/o-nas/`.

Sitemap generuje build (`@astrojs/sitemap`) a odkazuje na ni `robots.txt`. Stránka 404 v sitemapě není.

## Analytika bez cookies

Měření se vloží do každého buildu, jakmile je vyplněná jedna z proměnných níž. Cloudflare účet připojený k tomuto prostředí umí číst existující weby, ale vytvoření nového Web Analytics webu vrací 403 (chybí oprávnění Account Settings Write), takže beacon nejde vystavit automaticky.

Doporučená je **Cloudflare Web Analytics**. Je zdarma, bez cookies a jeden účet utáhne víc webů.

1. V Cloudflare otevřete **Analytics & logs → Web Analytics → Add a site**.
2. Zvolte ruční vložení (JS snippet), ne automatické přepsání HTML.
3. Token z `data-cf-beacon` uložte jako proměnnou `CF_ANALYTICS_TOKEN`.
4. Push na `main` stránku znovu sestaví a beacon se vloží sám.

**Plausible** (placené, stejně bez cookies): proměnná `PLAUSIBLE_DOMAIN`, hodnota je doména bez `https://`, například `garath33.github.io` nebo později `www.ecomo.cz`.

**Umami** (open source, zdarma, ale ne na GitHub Pages): aplikaci a databázi (Supabase nebo Neon) hostujte třeba na Vercelu. Do proměnných pak dejte `UMAMI_SRC` (adresa `script.js`) a `UMAMI_WEBSITE_ID`. Na GitHub Pages stačí meta CSP z layoutu. Až web poběží na Cloudflare Pages, přidejte stejný původ i do `public/_headers`, jinak hlavička skript zablokuje.

## Bezpečnostní hlavičky

GitHub Pages vynucuje HTTPS, ale neumí vlastní HTTP hlavičky. CSP a `Referrer-Policy` jsou proto i v HTML. Stejný build je nasazený na Cloudflare Pages, kde `public/_headers` platí doopravdy: https://ecomo.pages.dev/ecomo/ vrací `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options` a HSTS. Kanonická adresa v HTML pořád ukazuje na GitHub Pages, protože tam CI nasazuje každou změnu.
