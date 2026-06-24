import { useEffect } from "react";

/** Injects a JSON-LD <script> into <head> and removes it on unmount/route change. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data);
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = json;
    document.head.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [json]);
  return null;
}
