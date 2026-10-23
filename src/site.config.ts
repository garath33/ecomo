import { messages } from "./locales";

export const site = {
  name: "ecomo",
  legalName: "Ecomo s.r.o.",
  tagline: messages.copy.tagline,
  description: messages.copy.description,
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
  seo: messages.seo,
  foundedYear: 2024,
  about: messages.copy.about,
  approach: messages.copy.approach,
} as const;

/** Labels and page copy come from the primary locale file. */
export const navigation = [
  { href: "/#nabidka", label: messages.nav.offer },
  { href: "/fotovoltaika/", label: messages.nav.pv },
  { href: "/tepelna-cerpadla/", label: messages.nav.hp },
  { href: "/o-nas/", label: messages.nav.about },
  { href: "/#kontakt", label: messages.nav.contact },
] as const;

export const inquiryTopics = [
  { value: "fve", label: messages.inquiry.fve },
  { value: "tc", label: messages.inquiry.tc },
  { value: "both", label: messages.inquiry.both },
  { value: "other", label: messages.inquiry.other },
] as const;

export type InquiryTopic = (typeof inquiryTopics)[number]["value"];

export const projects = [
  {
    slug: "pristresek-fve",
    title: messages.projects.shelter.title,
    summary: messages.projects.shelter.summary,
    image: "images/zakazka-pristresek.jpg",
    alt: messages.projects.shelter.alt,
  },
  {
    slug: "montaz-strecha",
    title: messages.projects.roof.title,
    summary: messages.projects.roof.summary,
    image: "images/zakazka-strecha.jpg",
    alt: messages.projects.roof.alt,
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
