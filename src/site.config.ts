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
    district: "Praha-východ",
    region: "Středočeský kraj",
    country: "CZ",
    countryName: "Česko",
  },
  geo: {
    latitude: 50.164968,
    longitude: 14.419141,
  },
  maps: {
    google:
      "https://www.google.com/maps/search/?api=1&query=Ecomo%20s.r.o.%2C%20Poln%C3%AD%20%C4%8D.ev.%20275%2C%20P%C5%99emy%C5%A1len%C3%AD%2C%20250%2066%20Zdiby",
    mapy: "https://mapy.com/?q=Poln%C3%AD%20%C4%8D.ev.%20275%2C%20P%C5%99emy%C5%A1len%C3%AD%2C%20250%2066%20Zdiby",
    googlePlace: "",
    mapyPlace: "",
  },
  areaServed: ["Praha", "Praha-východ", "Středočeský kraj"],
  seo: {
    homeTitle: "Fotovoltaika a tepelná čerpadla na míru | Ecomo Zdiby",
    homeDescription:
      "Ecomo s.r.o. ze Zdib navrhuje a instaluje fotovoltaiku a tepelná čerpadla. Osobní přístup, řešení na míru, dotace a montáž na klíč v Praze a Středočeském kraji.",
    fotovoltaikaTitle: "Fotovoltaika pro rodinné domy, firmy i obce | Ecomo",
    fotovoltaikaDescription:
      "Instalace fotovoltaiky na klíč pro rodinné domy, firmy, obce i SVJ. Návrh podle spotřeby, dotace, připojení k síti a montáž. Ecomo, Zdiby.",
    tepelnaTitle: "Tepelná čerpadla vzduch–voda na klíč | Ecomo",
    tepelnaDescription:
      "Tepelná čerpadla vzduch–voda pro vytápění, chlazení a ohřev vody. Návrh výkonu, technické šetření a montáž na klíč. Ecomo, Zdiby.",
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
  site.address.district,
] as const;
