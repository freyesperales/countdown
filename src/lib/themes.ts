export type ThemeName = "dark" | "light" | "sunset" | "ocean" | "forest";

export const THEME_NAMES: readonly ThemeName[] = [
  "dark",
  "light",
  "sunset",
  "ocean",
  "forest",
] as const;

export type ThemeVars = {
  /** Either a solid color or a gradient (`linear-gradient(...)`) */
  bg: string;
  text: string;
  accent: string;
  muted: string;
};

export const THEMES: Record<ThemeName, ThemeVars> = {
  dark: {
    bg: "#0a0a0a",
    text: "#ffffff",
    accent: "#fbbf24",
    muted: "#71717a",
  },
  light: {
    bg: "#ffffff",
    text: "#0a0a0a",
    accent: "#0ea5e9",
    muted: "#71717a",
  },
  sunset: {
    bg: "linear-gradient(135deg, #f97316 0%, #db2777 100%)",
    text: "#ffffff",
    accent: "#fef3c7",
    muted: "#fde68a",
  },
  ocean: {
    bg: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)",
    text: "#ffffff",
    accent: "#7dd3fc",
    muted: "#bae6fd",
  },
  forest: {
    bg: "#14532d",
    text: "#dcfce7",
    accent: "#fbbf24",
    muted: "#86efac",
  },
};

export function isThemeName(s: string | null | undefined): s is ThemeName {
  return !!s && (THEME_NAMES as readonly string[]).includes(s);
}

export function themeToCssVars(name: ThemeName): React.CSSProperties {
  const t = THEMES[name];
  return {
    background: t.bg,
    color: t.text,
    ["--accent" as string]: t.accent,
    ["--muted" as string]: t.muted,
  } as React.CSSProperties;
}
