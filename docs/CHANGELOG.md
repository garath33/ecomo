# Historie změn

Formát vychází z [Keep a Changelog](https://keepachangelog.com/cs/1.1.0/). Verze se shoduje s polem `version` v `package.json`. Datum je den, kdy se verze sešla na `main`, v čase Europe/Prague.

## [Unreleased]

### Přidáno

- Stránka fotovoltaiky má u karet segmentů vektorové ilustrace v barvách značky: rodinný dům se solární střechou, firemní hala, radnice s hodinovou věží mezi dvěma veřejnými budovami a bytové domy s panely na ploché střeše.
- Náhled pracovní větve žije na https://garath33.github.io/ecomo/preview/ se žluto-černou lištou. Ostří na https://garath33.github.io/ecomo/ se z pracovní větve nepřepisuje a po merge do `main` lištu nemá. Pravidla drží `.cursor/rules/github-workflow.mdc`.
- `.cursorignore` a `.cursorrules`: AI neindexuje `node_modules/`, build, lockfile, logy ani `.git/` a drží se pravidel minimalizace kontextu, architektury a dokumentace.
- Git workflow: člověk pracuje na `feature/<nazev>`, cloud agent na `cursor/<nazev>-<id>`. Merge do `main` až po schválení. CI kontroluje conventional commits (`feat`, `fix`, `docs`, `ci`, `chore`, `test`, `refactor`) a šablona PR žádá náhled, kontrolu a screenshoty.
- CI ukládá desktop screenshoty úvodu, fotovoltaiky, tepelných čerpadel a kontaktu jako artifact `preview-screenshots`. Deploy na Pages běží i z větví `feature/**`.
- Jazyk webu zůstává jen čeština, dokud uživatel nenahlásí další.

### Opraveno

- Poptávka se odesílá přes Web3Forms na jiri.uldrich@ecomo.cz. Návštěvník zůstane na stránce a po doručení uvidí poděkování. FormSubmit už se nepoužívá. Když služba neodpoví, zůstane odkaz do e-mailového klienta.
- Ostří na `https://ecomo.cz/` se sestavuje z kořene domény. Předchozí build mířil na `https://garath33.github.io/ecomo/` a na vlastní doméně proto nenačetl styly ani podstránky. Náhled pracovní větve je `https://ecomo.cz/preview/`.
- Poptávka se po kliknutí na Odeslat už nezasekne na „Odesílám poptávku…“. FormSubmit v prohlížeči nebere tichý požadavek (kontrola Cloudflare) a stránka kvůli tomu zůstávala ve stavu odesílání, nebo přešla na ověření „Okamžik…“. Teď se formulář odešle v novém okně na jiri.uldrich@ecomo.cz. Napoprvé je potřeba v tom okně potvrdit, že jde o člověka, a v e-mailu od FormSubmit kliknout na Activate Form. Pak se uložené poptávky doručí. Když okno nejde otevřít, zůstane odkaz do e-mailového klienta.

### Změněno

- Tlačítko „Nezávazná poptávka“ v hlavičce, odkaz v patičce a výzvy na stránkách fotovoltaiky a tepelných čerpadel zastaví u textu „Pojďme si promluvit o vašem projektu“, ne až u polí formuláře. Ve výřezu zůstane věta v první osobě, telefon a domluva první schůzky. Formulář je hned pod tím. Na stránce, která blok kontaktu má, kliknutí zůstane na ní. Stránka O nás vede na stejný blok na úvodu.
- Nad formulářem je výzva „Pojďme si promluvit o vašem projektu“ a text mluví přímo za Jiřího Uldricha: „Jmenuji se Jiří Uldrich. Zavolejte mi…, ozvu se vám a domluvíme první schůzku, nezávazně.“ Bez množného čísla a bez třetí osoby, takže mezi klientem a Jiřím není odstup. Stejným hlasem je potvrzení po odeslání poptávky („Děkuji za poptávku… Ozvu se vám“). Zbytek webu mluví o firmě v množném čísle („instalujeme“, „navrhneme“) a o Jiřím ve třetí osobě, to zůstává.
- Postup zakázky na fotovoltaice má číslo kroku jen v nadpisu. Odznaky 01, 02 a 03 v rohu karty jsou pryč a štítek prvního kroku je „Kontakt“, stejně jako ostatní činnosti. Věta u realizace zní „Instalace, nastavení, předání a revize.“
- Hlavní moto v hero je „Osobní přístup k vám i vašemu projektu“.
- Tepelná čerpadla: instalujeme jen monoblok značky Kensol. Ze stránky zmizel výběr split, monoblok a hydrosplit i věta, že značku necháváme otevřenou. Cena počítá s venkovní jednotkou a trasou topné vody.
- Postup zakázky na stránce fotovoltaiky: 1. kontakt, naměření, nacenění a smlouva o dílo, 2. administrativa (projekt, podklady, žádosti), 3. realizace v pořadí instalace, nastavení, předání a revize.
- Kroky zakázky mají přepracovaný layout a jednu propracovanou ikonu u každého kroku: telefon s bublinou hovoru, štos podkladů a montér s helmou a maticovým klíčem.
- Položka Kontakt v menu a tlačítko „Kontaktujte nás“ zastaví u nadpisu „Ozvěte se nezávazně“, ne až u formuláře. Nad formulářem je věta, že Jiří Uldrich rád pomůže, a zůstává telefon i výzva k první schůzce.
- Po odeslání poptávky se ukáže poděkování a věta, že se zpráva odeslala.
- Formulář poptávky po vyplnění odešle zprávu na jiri.uldrich@ecomo.cz přes FormSubmit. Souhlas už neříká, že údaje jdou přímo. Když služba nepustí požadavek napřímo, formulář se odešle běžným odesláním stránky. Bez sítě zůstane odkaz do e-mailového klienta. První zpráva čeká, až jednatel potvrdí schránku v e-mailu od FormSubmit.
- Fotografie venkovní jednotky (`public/images/nabidka-tc.jpg`) ukazuje tepelné čerpadlo postavené rovnoběžně se zdí domu. Čelo skříně s ventilátorem je v rovině stěny a jednotka stojí na betonovém základu. Stejný snímek je na kartě nabídky i v hlavičce stránky tepelných čerpadel.
- Fotovoltaika: nadpis „Firemní instalace“ a věta „Energie z vlastní střechy“. Stejný název je i v odrážce na úvodu, s nižšími provozními náklady ve výrobě, skladu i kancelářích.
- Hlavní moto je „Osobní přístup k vám i vašemu domu“. Slovo „na míru“ z webu zmizelo. Texty jsou psané lidštěji a každý blok nese jinou informaci: věta pod motem mluví o návratnosti a ceně, údaje pod tlačítkem o tom, kdo zakázku vede a komu zavolat po předání, nabídka o tom, z čeho vycházíme. Opravený pád u „jednáte s Jiří Uldrich“. O nás má nadpis „Mluvíte s tím, kdo zakázku vede“. Jiří zakázku vede a na montáž dohlíží. Kontakt je bez „Neváhejte nás kontaktovat“.
- Tepelné čerpadlo: místo „Obnovitelné zdroje…“ údaj, že dobře navržené čerpadlo bere na stejné teplo zhruba třetinu elektřiny oproti přímotopu nebo elektrokotli. U starších radiátorů text říká, že úspora bývá menší.

## [0.1.0] — 2026-10-02

První veřejná podoba prezentačního webu. Nasazuje se na GitHub Pages.

### Přidáno

- Statický web v Astro 5 a TypeScriptu: úvod, fotovoltaika, tepelná čerpadla, O nás a stránka 404.
- Branding: žlutá `#D8E716`, černá, písmo Sansation, wordmark ecomo.
- Firemní údaje, navigace, témata poptávky a dvě hotové zakázky v `src/site.config.ts`.
- Hero, nabídka dvou oborů, kontakt a patička s IČO, DIČ, sídlem a přímými kontakty.
- Formulář nezávazné poptávky: validace v prohlížeči, honeypot a sestavení `mailto`.
- Lokální SEO: titulky, popisy, canonical, Open Graph, Twitter card, JSON-LD `LocalBusiness`, sitemap a `robots.txt`.
- Náhledový pruh, když `PUBLIC_SITE_ENV` není `production`.
- CI (lint, unit testy, build, Playwright) a workflow pro GitHub Pages. Push na `cursor/**` je náhled, push na `main` je ostří.
- Testy responsivity (375 / 768 / 1024 / 1280 px) a shody firemních údajů s konfigurací.

### Změněno

- Úvod drží hero, nabídku a kontakt. Sekce hotových zakázek a O nás se na úvodu nevykreslují. O nás je samostatná stránka a odkaz v menu (2. 10. 2026, 9:26).
- Kontakt je v patičce. Nad formulářem je jedna výzva „Ozvěte se nezávazně“, bez duplicitního seznamu kontaktů.
- Texty mluví za firmu. Hero má jedno tlačítko „Kontaktujte nás“.
- Karta tepelného čerpadla na úvodu používá světlejší fotografii venkovní jednotky (`images/nabidka-tc.jpg`). Fotovoltaika na úvodu ukazuje tmavé panely.
- Nabídka tepelných čerpadel popisuje vzduch–voda, návrh výkonu, šetření na místě a spojení s fotovoltaikou. Stránka říká, co orientační cena obvykle obsahuje.

### Opraveno

- Kotva `#poptavka` doscrolluje formulář do viditelné oblasti.
- Menu do 1100 px se otevírá hamburgerem; testy čtou položku „Co nabízíme“ v otevřeném menu.
- Kontrola shody telefonu počítá s tím, že číslo je na stránce ve více odkazech `tel:`.
