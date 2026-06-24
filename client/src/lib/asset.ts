/**
 * Prefix a public asset path (e.g. "/logo.png") with Vite's base URL so it
 * resolves correctly when the app is hosted on a subpath (e.g. GitHub Pages).
 * Returns the path unchanged at the root base.
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
