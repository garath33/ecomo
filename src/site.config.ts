export const site = {
  name: "Ecomo",
  legalName: "Ecomo s.r.o.",
  tagline: "Smysluplné fotovoltaické elektrárny s řešením na míru a rozumnou cenou",
  description:
    "Ecomo navrhuje a instaluje fotovoltaiku a tepelná čerpadla pro rodinné domy i firmy. Osobní přístup, studie návratnosti a realizace na klíč.",
  person: "Jiří Uldrich",
  role: "jednatel",
  phoneDisplay: "604 251 324",
  phoneTel: "+420604251324",
  email: "jiri.uldrich@ecomo.cz",
  ico: "21140456",
  dic: "CZ21140456",
  address: {
    line1: "Polní č.ev. 275",
    line2: "Přemyšlení",
    zip: "250 66",
    city: "Zdiby",
  },
  foundedYear: 2024,
} as const;

export const navigation = [
  { href: "/#nabidka", label: "Co nabízím" },
  { href: "/fotovoltaika/", label: "Fotovoltaika" },
  { href: "/tepelna-cerpadla/", label: "Tepelná čerpadla" },
  { href: "/#reference", label: "Reference" },
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
