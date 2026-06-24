import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

type ContentMap = Record<string, Record<string, unknown>>;

const Ctx = createContext<ContentMap>({});

/**
 * Fetches all CMS overrides once (`/api/content`) and provides them by context.
 * The static `config/content/*` objects remain the defaults; the DB only stores
 * overrides, so the site renders identically when nothing has been edited.
 */
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery<ContentMap>({
    queryKey: ["/api/content"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/content", { credentials: "include" });
        if (!res.ok) return {};
        return (await res.json()) as ContentMap;
      } catch {
        return {};
      }
    },
    staleTime: 60_000,
  });
  return <Ctx.Provider value={data ?? {}}>{children}</Ctx.Provider>;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge `override` over `base`. Arrays are replaced wholesale (list edits). */
export function deepMerge<T>(base: T, override: unknown): T {
  if (!isObject(base) || !isObject(override)) {
    return override === undefined ? base : (override as T);
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(override)) {
    const ov = override[k];
    if (ov === undefined) continue;
    out[k] = isObject(out[k]) && isObject(ov) ? deepMerge(out[k], ov) : ov;
  }
  return out as T;
}

/** Returns the static default with any DB override deep-merged on top. */
export function useSiteContent<T>(key: string, staticDefault: T): T {
  const map = useContext(Ctx);
  const override = map[key];
  return override ? deepMerge(staticDefault, override) : staticDefault;
}
