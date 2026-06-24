export const navigation = {
  // Grouped nav (Payana-style dropdowns). Items with `items` render a dropdown;
  // items with `href` render a direct link.
  mainNav: [
    {
      label: "Soluciones",
      items: [
        { label: "Servicios", href: "/servicios", desc: "Diagnóstico, evidencia y defensa", icon: "Search" },
        { label: "Materialidad", href: "/materialidad", desc: "Los 15 elementos del SAT", icon: "Scale" },
        { label: "Metodología", href: "/metodologia", desc: "4 fases, activo en 3 semanas", icon: "Workflow" },
      ],
    },
    {
      label: "Recursos",
      items: [
        { label: "Impacto", href: "/impacto", desc: "Resultados y casos", icon: "TrendingUp" },
        { label: "Blog", href: "/blog", desc: "Inteligencia fiscal", icon: "Newspaper" },
        { label: "FAQ", href: "/faq", desc: "Preguntas frecuentes", icon: "HelpCircle" },
      ],
    },
    { label: "Seguridad", href: "/seguridad" },
    { label: "Contacto", href: "/contacto" },
  ],
  access: { label: "Acceso", href: "/acceso" },
  footerNav: {
    serviciosLabel: "Servicios",
    servicios: [
      { label: "Diagnóstico Fiscal", href: "/servicios#diagnostico" },
      { label: "Evidencia Documental", href: "/servicios#evidencia" },
      { label: "Defensa Preventiva", href: "/servicios#defensa" },
      { label: "Implementación", href: "/implementacion" },
    ],
    empresaLabel: "Empresa",
    empresa: [
      { label: "Metodología", href: "/metodologia" },
      { label: "Impacto", href: "/impacto" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
    legal: [
      { label: "Aviso de Privacidad", href: "/aviso-privacidad" },
      { label: "Términos y Condiciones", href: "/terminos" },
      { label: "Seguridad de la Información", href: "/politica-seguridad" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  cta: {
    label: "Agenda tu Demo",
    href: "/contacto",
  },
} as const;

export type Navigation = typeof navigation;
