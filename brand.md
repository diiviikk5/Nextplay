# Brand — NextPlay

_Status: active_

**Positioning:** the fastest way to know what's coming out, when, and on what. Data-first, opinionated, zero fluff.
**Voice:** short, confident, gamer-native. Answer first, then detail. No hype adjectives ("epic", "ultimate"), no emoji in UI.

## Palette (dark only)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b0b0d` | page |
| `--surface` / `--surface-2` | `#141417` / `#1c1c21` | cards, panels |
| `--line` | `#26262c` | hairlines |
| `--text` / `--text-2` / `--text-3` | `#f2f2f3` / `#b6b6bd` / `#8e8e97` | body / secondary / meta (all ≥ 4.5:1 on `--bg`) |
| `--accent` | `#c8ff2e` (acid lime) | primary action, "out now", focus ring. Text on accent is `--bg`. |
| `--hot` | `#ff5a36` | "today", urgency |
| `--gold` | `#ffc53d` | ranks, ratings |

Platform hues (chips only): PlayStation `#4d86ff`, Xbox `#4cc35e`, Nintendo `#ff4f4f`, PC `#c9c9d1`.

## Type

- Display: **Archivo** variable, width 112–125, weight 800–900, tight tracking (-0.02em). Headlines and big numbers.
- Body: **Geist** 400/500/600.
- Data: **Geist Mono** — dates, countdowns, counts, ranks.

## Rules

- Cover art is the hero. Chrome stays quiet: hairline borders, 6px radius, no glows, no glass, no gradients except image scrims.
- One accent per view. Lime means "act" or "available now".
- Motion: 150–220ms ease-out, transform/opacity only, disabled under `prefers-reduced-motion`.
