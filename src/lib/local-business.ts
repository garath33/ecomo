import { site } from "../site.config";

export function localBusinessJsonLd(input: { pageUrl: string; image: string }) {
  const address = `${site.address.line1}, ${site.address.line2}, ${site.address.zip} ${site.address.city}`;
  const sameAs = [site.web, site.maps.googlePlace, site.maps.mapyPlace].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.web}/#business`,
    name: site.legalName,
    alternateName: site.name,
    description: site.seo.homeDescription,
    url: site.web,
    mainEntityOfPage: input.pageUrl,
    image: input.image,
    telephone: site.phoneTel,
    email: site.email,
    taxID: site.ico,
    vatID: site.dic,
    founder: {
      "@type": "Person",
      name: site.person,
      jobTitle: site.role,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: site.maps.google,
    areaServed: site.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    knowsAbout: ["Fotovoltaika", "Tepelná čerpadla", "Dotace na obnovitelné zdroje"],
    sameAs,
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Adresa",
      value: address,
    },
  };
}
