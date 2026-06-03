# countdown

> A URL-driven countdown timer you can embed anywhere. Share a link, you share a countdown — no backend involved.

There are a hundred countdown widgets on the web. Most demand an account,
inject ads, leak analytics, or break when you try to embed them in an iframe.
`countdown` is the opposite of all of that: a single static page that reads
its state out of the URL, renders a big number, and ticks. Embed it in a
Notion page, project it on a TV at midnight, paste a link in Slack — same
binary, every time.

[![Status](https://img.shields.io/badge/status-alpha-yellow)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Tests](https://img.shields.io/badge/tests-30%20passing-brightgreen)](#)

## Demo

```
https://countdown.example.com/c?to=2026-12-25T00:00:00&label=Christmas&theme=sunset
```

> _Screenshots / GIF go here. Until then:_

- The landing page (`/`) has a small generator: pick a date, label, timezone, theme — it builds the URL for you.
- The countdown page (`/c`) reads `?to`, `?label`, `?tz`, `?theme` and renders.
- Click the canvas to enter fullscreen. Resize the window — typography scales fluidly.
- Once expired, the screen reads **"It's time."** in the active theme.

## Features

- Pure static export — no Node server, no edge functions, no API
- All state in the URL: copy-paste a link, you share the exact countdown
- Five themes: `dark`, `light`, `sunset`, `ocean`, `forest`
- IANA timezone-aware (`tz=America/Santiago`, `tz=Europe/Berlin`, etc.)
- Embed-friendly: drop into any iframe; layout scales to viewport
- Fullscreen on click for projection / kiosk use
- Built-in URL generator + copy-paste embed snippet on the landing page
- Zero analytics, zero cookies, zero third-party requests — verify in DevTools
- 30 unit tests covering URL parsing, time math, and label sanitisation
- Sub-50 KB JS for the countdown page

## Quickstart

```bash
git clone https://github.com/freyesperales/countdown
cd countdown
npm install
npm run dev    # opens at http://localhost:3000
```

Open `http://localhost:3000`, fill in the form — date, label, timezone, theme —
and the URL preview updates live. Copy that URL and open it directly: that's
your countdown. To embed it elsewhere, the landing page also shows a one-line
`<iframe>` snippet ready to paste into Notion, a blog, or a wiki.

## How it works

There is no database. Everything that drives a countdown is encoded in the
query string parsed by [`src/lib/url.ts`](src/lib/url.ts). `buildQuery()`
serialises a sanitised set of params; `parseQuery()` reverses it, falling back
to sensible defaults (current time + 24h, default theme) for any missing field.
Label text is stripped to 60 characters and a safe character set in
[`src/lib/format.ts`](src/lib/format.ts) to keep XSS and unicode-control-char
shenanigans off the table.

The ticking math lives in [`src/lib/countdown.ts`](src/lib/countdown.ts):
given a target ISO timestamp and an optional IANA timezone string, it returns
`{ days, hours, minutes, seconds, expired }` for any "now". Pure function, no
DOM access — which is why the test file can hit it 10 ways without mocking.

The view ([`src/components/CountdownView.tsx`](src/components/CountdownView.tsx))
is a single `useEffect` that ticks every 250 ms (smooth enough for the seconds
roll-over without burning CPU). Themes ([`src/lib/themes.ts`](src/lib/themes.ts))
are plain object literals — colours and gradients applied as inline CSS vars.

Because the build target is `output: "export"`, the whole app compiles to a
folder of static HTML / JS / CSS that you can host anywhere — no server-side
rendering at runtime, no Node process required.

## Deploy

### Cloudflare Pages / Netlify / GitHub Pages / S3

```bash
npm run build
# upload `out/` to anywhere static, e.g.
npx wrangler pages deploy out --project-name=countdown
```

There are no environment variables, no edge functions, no runtime
config. The directory is fully self-contained.

### Vercel

`npm run build` then upload `out/` as static, or import the repo and Vercel
will detect the export. Works fine but the project doesn't use anything Vercel-
specific.

### Self-host

Any static file server:

```caddy
countdown.example.com {
  root * /var/www/countdown/out
  file_server
}
```

## URL contract

| Param   | Type        | Required | Default                | Example                     |
| ------- | ----------- | -------- | ---------------------- | --------------------------- |
| `to`    | ISO 8601    | yes      | now + 24h              | `2026-12-25T00:00:00`       |
| `label` | string      | no       | (empty)                | `Christmas` (max 60 chars)  |
| `tz`    | IANA zone   | no       | viewer's local tz      | `America/Santiago`          |
| `theme` | enum        | no       | `dark`                 | `sunset`                    |

Themes: `dark` · `light` · `sunset` · `ocean` · `forest`. Unknown values fall
back to `dark`.

## Embed

```html
<iframe
  src="https://countdown.example.com/c?to=2026-12-25&label=Christmas&theme=sunset"
  width="100%" height="320" frameborder="0" style="border:0"></iframe>
```

The countdown view has no internal padding lock — it fills whatever box the
iframe gives it.

## Configuration

There are no environment variables. By design.

## Development

```bash
npm run dev          # dev server with hot reload
npm run build        # static export to out/
npm test             # vitest, 30 tests
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
```

### Project layout

```
src/
├── app/
│   ├── c/page.tsx      countdown view (reads URL → renders)
│   ├── page.tsx        landing + generator + embed snippet
│   └── layout.tsx
├── components/
│   ├── CountdownView.tsx
│   ├── GeneratorForm.tsx
│   ├── ThemePicker.tsx
│   └── EmbedSnippet.tsx
└── lib/
    ├── url.ts          buildQuery / parseQuery (URLSearchParams)
    ├── countdown.ts    ticking math, expiry detection, tz handling
    ├── format.ts       label sanitisation, duration formatting
    └── themes.ts       five theme presets as plain objects
tests/                  vitest unit tests (30 across url/countdown/format)
```

Three test files mirror three of the lib modules one-to-one. That's the
contract: every public function in `lib/` is unit-tested. Views are deliberately
kept thin enough that they don't need their own tests.

## Roadmap

- [ ] v0.2: count-up mode (`?from=` instead of `?to=`)
- [ ] v0.2: optional small print line below the label
- [ ] v0.3: more themes — community PRs welcome, theme is just a new object literal
- [ ] v0.3: OG image generator so links unfurl with a preview of the countdown
- [ ] would-be-nice: web component build so non-iframe embeds are possible
- [ ] would-be-nice: sound on expiry (opt-in via param)

## Contributing

PRs welcome. Quick checklist:

1. Open an issue first if it's a feature so we can align on scope.
2. Run `npm test` and `npm run typecheck` — both green before pushing.
3. New theme? Add it to `THEMES` in `src/lib/themes.ts` and to the `ThemeName` union. That's it.
4. No `any`. Keep functions small. Comments explain *why*, not what.

## License

[MIT](./LICENSE) © Francisco Reyes
