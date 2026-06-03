# countdown

A tiny, beautiful, embeddable countdown timer. No signup. No ads. No analytics. No backend.

```
countdown.example.com/c?to=2026-12-25T00:00:00&label=Christmas&theme=sunset
```

## Features

- Pure static export (single page app, deployable anywhere)
- All state in URL query params — share a link, you share a countdown
- Five themes: dark, light, sunset, ocean, forest
- Timezone-aware (IANA strings, e.g. `America/Santiago`)
- Embed-friendly: drop into any iframe, scales to viewport
- Fullscreen on click (for projection use)
- Privacy: zero analytics, zero cookies. Verify in DevTools.

## URL contract

| Param   | Type   | Required | Example                     |
| ------- | ------ | -------- | --------------------------- |
| `to`    | ISO    | yes      | `2026-12-25T00:00:00`       |
| `label` | string | no       | `Christmas` (max 60 chars)  |
| `tz`    | IANA   | no       | `America/Santiago`          |
| `theme` | enum   | no       | `dark` (default)            |

## Embed

```html
<iframe
  src="https://countdown.example.com/c?to=2026-12-25&label=Christmas&theme=sunset"
  width="100%" height="320" frameborder="0" style="border:0"></iframe>
```

## Development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # produces out/
npm test             # vitest
npm run typecheck    # tsc --noEmit
```

## License

MIT
