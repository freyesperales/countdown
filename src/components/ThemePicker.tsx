"use client";

import { THEME_NAMES, THEMES, type ThemeName } from "@/lib/themes";

type Props = {
  value: ThemeName;
  onChange: (t: ThemeName) => void;
};

export default function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {THEME_NAMES.map((name) => {
        const t = THEMES[name];
        const active = name === value;
        return (
          <button
            key={name}
            type="button"
            aria-label={`Theme: ${name}`}
            aria-pressed={active}
            onClick={() => onChange(name)}
            className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 transition ${
              active
                ? "border-neutral-900 ring-2 ring-neutral-900"
                : "border-neutral-300 hover:border-neutral-500"
            }`}
          >
            <span
              aria-hidden="true"
              className="inline-block w-5 h-5 rounded-full border border-black/10"
              style={{ background: t.bg }}
            />
            <span className="capitalize">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
