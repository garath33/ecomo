export const site = {
  name: "ecomo",
  legalName: "Ecomo s.r.o.",
  tagline: "Smysluplné fotovoltaické elektrárny s řešením na míru a rozumnou cenou",
  description:
    "Ecomo navrhuje a instaluje fotovoltaiku a tepelná čerpadla. Od studie návratnosti a dotací až po montáž a spuštění u vás.",
  person: "Jiří Uldrich",
  role: "Jednatel",
  specialty: "Technologický specialista",
  phoneDisplay: "+420 604 251 324",
  phoneShort: "604 251 324",
  phoneTel: "+420604251324",
  email: "jiri.uldrich@ecomo.cz",
  web: "https://www.ecomo.cz",
  webDisplay: "www.ecomo.cz",
  ico: "21140456",
  dic: "CZ21140456",
  address: {
    line1: "Polní č.ev. 275",
    line2: "Přemyšlení",
    zip: "250 66",
    city: "Zdiby",
  },
  foundedYear: 2024,
  about:
    "Zajišťujeme kompletní servis při realizaci fotovoltaiky. Od návrhu systému, studie jeho smysluplnosti a návratnosti, přes vyřízení dotací, připojení k distribuční soustavě a případnou změnu dodavatele elektřiny, až po odbornou montáž a spuštění technologie u zákazníka doma.",
  approach:
    "Zakládáme si na osobním a lidském přístupu. Umíme vyjít vstříc potřebám na míru — od první schůzky až po předání díla.",
} as const;

export const navigation = [
  { href: "/#nabidka", label: "Co nabízím" },
  { href: "/fotovoltaika/", label: "Fotovoltaika" },
  { href: "/tepelna-cerpadla/", label: "Tepelná čerpadla" },
  { href: "/#zakazky", label: "Hotové zakázky" },
  { href: "/#o-nas", label: "O nás" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

export const inquiryTopics = [
  { value: "fve", label: "Instalace fotovoltaiky" },
  { value: "tc", label: "Instalace tepelného čerpadla" },
  { value: "both", label: "Fotovoltaika i tepelné čerpadlo" },
  { value: "other", label: "Jiné / konzultace" },
] as const;

export type InquiryTopic = (typeof inquiryTopics)[number]["value"];

export const projects = [
  {
    slug: "pristresek-fve",
    title: "Fotovoltaický přístřešek",
    summary:
      "Ocelová konstrukce na betonových patkách s panely nad zpevněnou plochou. Výroba elektřiny i stínění v jednom.",
    image: "images/zakazka-pristresek.jpg",
    alt: "Fotovoltaický přístřešek na ocelové konstrukci",
  },
  {
    slug: "montaz-strecha",
    title: "Montáž panelů na střechu",
    summary: "Ukotvení modulů na střešní lišty. Přesná práce, ať sestava drží i ve větru a dešti.",
    image: "images/zakazka-strecha.jpg",
    alt: "Detail montáže fotovoltaických panelů na střeše",
  },
] as const;

/** Údaje, které musí být stejné v náhledu i na ostří. */
export const productionFacts = [
  site.legalName,
  site.person,
  site.specialty,
  site.role,
  site.phoneDisplay,
  site.email,
  site.webDisplay,
  site.ico,
  site.dic,
  site.address.line1,
  site.address.line2,
  site.address.zip,
  site.address.city,
] as const;
