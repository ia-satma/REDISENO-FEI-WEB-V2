import { useEffect } from "react";
import { settingsContent } from "@config/content/settings";
import { useSiteContent } from "@/hooks/useSiteContent";

/**
 * Toggles the global `hide-eyebrows` class on <html> based on the CMS setting
 * `settings.showEyebrows`. When false (default) every `.eyebrow` tag and the
 * hero badge are hidden site-wide; the admin can flip it on from /admin/content.
 * Renders nothing.
 */
export default function EyebrowVisibility() {
  const settings = useSiteContent("settings", settingsContent);
  useEffect(() => {
    document.documentElement.classList.toggle("hide-eyebrows", !settings.showEyebrows);
  }, [settings.showEyebrows]);
  return null;
}
