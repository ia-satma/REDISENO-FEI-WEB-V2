export const navigation = {
  // Grouped nav (Payana-style dropdowns). Items with `items` render a dropdown;
  // items with `href` render a direct link. Metodología y Materialidad se
  // promovieron a primer nivel (antes vivían dentro del dropdown "Soluciones").
  mainNav: [
    {
      label: "Soluciones",
      items: [
        { label: "Diagnóstico de Materialidad", href: "/servicios#diagnostico", desc: "Evaluación documental de tus operaciones", icon: "Search" },
        { label: "Expediente Documental Fiscal", href: "/servicios#evidencia", desc: "Evidencia organizada por operación", icon: "FileStack" },
        { label: "Defensa Fiscal Preventiva", href: "/servicios#defensa", desc: "Preparación ante requerimientos", icon: "Shield" },
      ],
    },
    { label: "Metodología", href: "/metodologia" },
    { label: "Materialidad", href: "/materialidad" },
    { label: "Seguridad", href: "/seguridad" },
    {
      label: "Recursos",
      items: [
        { label: "Impacto", href: "/impacto", desc: "Resultados y casos", icon: "TrendingUp" },
        { label: "Blog", href: "/blog", desc: "Inteligencia fiscal", icon: "Newspaper" },
        { label: "FAQ", href: "/faq", desc: "Preguntas frecuentes", icon: "HelpCircle" },
      ],
    },
    { label: "Contacto", href: "/contacto" },
  ],
  access: { label: "Acceso", href: "/acceso" },
  footerNav: {
    serviciosLabel: "Servicios",
    servicios: [
      { label: "Diagnóstico de Materialidad", href: "/servicios#diagnostico" },
      { label: "Expediente Documental Fiscal", href: "/servicios#evidencia" },
      { label: "Defensa Fiscal Preventiva", href: "/servicios#defensa" },
      { label: "Mantenimiento y Custodia Documental", href: "/seguridad" },
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
    label: "Agenda un diagnóstico",
    href: "/contacto",
  },
} as const;

export type Navigation = typeof navigation;
