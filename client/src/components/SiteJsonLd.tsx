import { useLocation } from "wouter";
import { brand } from "@config/brand";
import { SITE, GEO } from "@config/seo";
import JsonLd from "./JsonLd";

/** Human label per route, for the BreadcrumbList trail (Home → Page). */
const ROUTE_LABELS: Record<string, string> = {
  "/servicios": "Servicios",
  "/metodologia": "Metodología",
  "/materialidad": "Materialidad fiscal",
  "/impacto": "Impacto",
  "/seguridad": "Seguridad y custodia",
  "/contacto": "Contacto",
  "/blog": "Blog",
  "/faq": "Preguntas frecuentes",
  "/aviso-privacidad": "Aviso de privacidad",
  "/terminos": "Términos y condiciones",
  "/politica-seguridad": "Seguridad de la información",
  "/cookies": "Cookies",
};

/**
 * Site-wide structured data, baked in at pre-render:
 *  - Organization / ProfessionalService (NAP + geo + areaServed + contactPoint, local SEO/GEO)
 *  - WebSite (site entity)
 *  - BreadcrumbList (Home → current page) on inner routes
 * All domain values derive from brand.domain → SITE, so changing the domain is one edit.
 */
export default function SiteJsonLd() {
  const [location] = useLocation();

  const organization = {
    "@type": "ProfessionalService",
    "@id": `${SITE}/#organization`,
    name: brand.name,
    description:
      "Construcción y custodia de expedientes de materialidad fiscal para empresas mexicanas: evidencia documental contractual, operativa, fiscal y contable, trazable y preparada para revisión.",
    url: `${SITE}/`,
    logo: `${SITE}${brand.logo.main}`,
    image: `${SITE}/og-image.jpg`,
    telephone: brand.contact.phone,
    email: brand.contact.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Monterrey",
      addressRegion: "Nuevo León",
      addressCountry: "MX",
    },
    geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Nuevo León" },
      { "@type": "Country", name: "México" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: brand.contact.phone,
      email: brand.contact.email,
      contactType: "sales",
      areaServed: "MX",
      availableLanguage: ["es"],
    },
    knowsAbout: [
      "Materialidad fiscal",
      "Evidencia documental",
      "Defensa fiscal preventiva",
      "Artículo 69-B del CFF",
      "EFOS",
      "Deducciones fiscales",
      "Revisiones del SAT",
      "Razonabilidad económica",
    ],
    sameAs: [brand.social.linkedin],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: brand.name,
    url: `${SITE}/`,
    inLanguage: "es-MX",
    publisher: { "@id": `${SITE}/#organization` },
  };

  const graph: Record<string, unknown>[] = [organization, website];

  const label = ROUTE_LABELS[location];
  if (label) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: label, item: `${SITE}${location}` },
      ],
    });
  }

  return <JsonLd id="site" data={{ "@context": "https://schema.org", "@graph": graph }} />;
}
