/** Ajustes globales de presentación del sitio, editables desde el CMS.
 *  showEyebrows: muestra/oculta las etiquetas de sección (eyebrows) y el
 *  badge del hero en TODO el sitio. Default: ocultos. */
export const settingsContent = {
  showEyebrows: false,
} as const;

export type SettingsContent = typeof settingsContent;
