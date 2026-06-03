import { isThemeName, type ThemeName } from "./themes";
import { sanitizeLabel } from "./format";

export type CountdownParams = {
  to: string; // ISO 8601
  label: string; // possibly empty
  tz: string; // possibly empty (means: use viewer's tz)
  theme: ThemeName;
};

export const DEFAULT_THEME: ThemeName = "dark";

/**
 * Build a query string (no leading `?`) from countdown params.
 * Empty values are omitted. Label is encoded.
 */
export function buildQuery(p: Partial<CountdownParams>): string {
  const out = new URLSearchParams();
  if (p.to) out.set("to", p.to);
  const label = sanitizeLabel(p.label);
  if (label) out.set("label", label);
  if (p.tz) out.set("tz", p.tz);
  if (p.theme && p.theme !== DEFAULT_THEME) out.set("theme", p.theme);
  return out.toString();
}

/**
 * Build a full shareable URL given a base origin and params.
 */
export function buildShareUrl(origin: string, p: Partial<CountdownParams>): string {
  const q = buildQuery(p);
  const base = origin.replace(/\/+$/, "");
  return q ? `${base}/c?${q}` : `${base}/c`;
}

/**
 * Parse a URLSearchParams-like input into CountdownParams.
 * Missing/invalid values fall back to safe defaults.
 */
export function parseParams(search: URLSearchParams | string): CountdownParams {
  const sp = typeof search === "string" ? new URLSearchParams(search) : search;
  const to = sp.get("to") ?? "";
  const label = sanitizeLabel(sp.get("label"));
  const tz = sp.get("tz") ?? "";
  const themeRaw = sp.get("theme");
  const theme: ThemeName = isThemeName(themeRaw) ? themeRaw : DEFAULT_THEME;
  return { to, label, tz, theme };
}

/**
 * Render an iframe embed snippet for a countdown URL.
 */
export function buildEmbedSnippet(url: string, height = 320): string {
  return `<iframe src="${url}" width="100%" height="${height}" frameborder="0" style="border:0"></iframe>`;
}
