import { useEffect } from "react";

/**
 * Injects a JSON-LD <script> into <head>. Pass a stable `id` so re-renders
 * (e.g. route changes) update the SAME script in place instead of appending a
 * duplicate — keeps the pre-rendered HTML clean (one script per schema block).
 * The script is removed on unmount.
 */
export default function JsonLd({ data, id }: { data: Record<string, unknown>; id?: string }) {
  const json = JSON.stringify(data);
  useEffect(() => {
    const key = id || "jsonld";
    let script = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${key}"]`);
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-jsonld", key);
      document.head.appendChild(script);
    }
    script.textContent = json;
    return () => {
      const el = document.head.querySelector(`script[data-jsonld="${key}"]`);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    };
  }, [json, id]);
  return null;
}
