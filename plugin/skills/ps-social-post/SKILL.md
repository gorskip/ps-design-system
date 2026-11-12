---
name: ps-social-post
description: Create Przeskalowani graphics for Instagram or LinkedIn, such as feed posts, portrait posts, carousels, quote cards, stories, Reels covers, link previews. Use whenever asked to make a post, carousel, social graphic or visual for @przeskalowani, including requests by name such as instagram-liczby-a. Picks the right file, applies the template, and enforces copy limits.
---

# Przeskalowani: social graphics

**Read the `ps-design-system` skill first** (`przeskalowani:ps-design-system` when installed as a plugin). It holds the rules for
every surface: colours, white, gradients, typography, logo, tone, data, photography
and canvases.

A `postac` template with someone other than the founders' cut-outs needs a new
cut-out: make it with the `ps-cutout` skill (`przeskalowani:ps-cutout`) without
asking, then follow *Cut-out people* in `ps-design-system`.

Graphics live in `social/instagram/` and `social/linkedin/`, named by type and
variant. They read the same tokens as the website, so a post and a
landing page cannot drift apart. **Don't start a post from a blank page.** Open
`docs/index.html`, switch to the *Social* tab, pick the closest
example, and work on a copy of it, keeping its layout.

## Building a post

A graphic is named **platform-type-variant**, such as `instagram-liczby-a` or
`linkedin-cytat-a`. That name is the file: `social/<platform>/<type>-<variant>.html`.
When the request gives a name, use exactly that file. When it gives only a topic,
choose the type by content and the platform by where it will be posted.

| Type | Use | Instagram | LinkedIn |
|---|---|---|---|
| `okladki` | First frame of a Reel or story | `a` Reels, `b` story | none |
| `karuzela` | Carousel frames | `a` cover, `b` slide, `c` last slide | none |
| `teza` | One idea, a list or a comparison | `a` list, `b` myth vs fact, `c` before and after | `a` insight, `b` article, `c` process |
| `cytat` | Client words | `a` | `a` |
| `liczby` | One or more figures | `a` stat, `b` stat on green | `a` stat, `b` metrics |
| `o-nas` | Asia and Zuza | `a` | `a` |
| `postac` | A cut-out person in front of the field | `a` speech bubble, `b` wave, person right, `c` wave, person left, `d` both founders | `a`–`d`, same layouts |
| `oferta` | Workshop or free test | `a` test, `b` workshop | `a` workshop |
| `szablony` | Blank starting points | `a` portrait, `b` square, `c` quote, `d` carousel | none |

Copy the file, save the copy outside the repository as `ps-design-system` describes, and
change only the copy and the photo. Change the layout only when the user explicitly
asks for a new one, in the copy; values and the rules below stay. If a type has no file for the platform, say
so and offer the closest type there; do not resize one from the other platform.

## What the live feed actually looks like

Checked against the real @przeskalowani grid, not assumed:

- **Mint is the house surface**, not black. Their graphic posts sit on a pale
  teal field (`.ps-canvas--mint`) with a soft arc in one corner
  (`.ps-canvas__arc`) and a small lockup top-left (`.ps-canvas__stamp`).
- **Violet is absent from the feed entirely.** It exists in the logo and on
  the website; it has no established role on Instagram. Don't introduce it —
  not in type, icons or the signature gradient. A gradient on Instagram is
  `--gradient-green`.
- **Reels dominate.** Covers are a frame from the recording with the subtitle
  burned in: white uppercase, exactly ONE word in bright teal
  (`.ps-canvas__subtitle em`). The highlighted word carries the sentence's
  meaning — never a random noun.
- **Comment-to-get is their CTA mechanic** ("Skomentuj TEST, a wyślemy Ci
  link"). Comments move reach far more than a link in bio does. The keyword is
  one short uppercase word that cannot be mistyped.
- White callout boxes with a teal border carry the punchline
  (`.ps-canvas__callout`), and drawn ticks — never the emoji — carry lists.

## Pick the canvas

| Need | Size |
|---|---|
| Instagram feed: **the default** | 1080 × 1350 |
| Instagram feed, when the material is truly square | 1080 × 1080 |
| Story or Reels | 1080 × 1920 |
| LinkedIn: **the only LinkedIn size** | 1200 × 1500 |

## LinkedIn

**1200 × 1500 is the only LinkedIn format.** One size means one less decision
per post and a consistent column down the whole feed. Its files live
in `social/linkedin/`.

It is the same 4:5 ratio as the Instagram portrait, 11% larger, so the layout
vocabulary carries straight over — only the scale changes. Keep the copy
shorter than on Instagram: LinkedIn is read in a narrow column at speed.

Statistics on LinkedIn always carry their source. An uncited number gets
challenged in the comments, and rightly so.

## Where the mark goes

Top-left (`.ps-canvas__stamp`), never in a footer; on a split canvas that is the
top-left of the copy panel, since type never crosses a photo. Body slides of a
carousel carry it too.

## Surface rotation

Do not make every post the same. Across a set, alternate:

- `--deep` — **the dark surface**. Cream on it is at least 5.96:1.
- `--ink` (black) — **rare by design.** Full-bleed black reads as weight
  rather than depth and sits badly against warm photography. At most one
  frame in a set, for genuine impact. If you reach for it twice, use `--deep`.
- `--cream` / `--sand` — the brand cream `#EBE8E7`. Softer than white, and the
  surface that sits best beside the warm founder photography
- `--gradient` — **LinkedIn only, quote cards and covers only**, and
  never more than one in a carousel. The signature gradient loses its force if it is on every slide.
  Note it uses the *deep* gradient: the bright one cannot carry cream text
  (1.71:1). `--gradient-bright` exists for shape-only canvases and flips the
  text to ink.
- `--gradient-green` / `--gradient-green-bright` — the same two-step rule for
  the **green gradient** (teal-500 → teal-900, no violet). Use it when a set
  already spends its one signature gradient elsewhere; `--gradient-green`
  carries cream text, `--gradient-green-bright` is shapes only (coal on
  teal-900 is 2.55:1). There is no third gradient.

A carousel reads: cover on deep or gradient-green → body slides on mint or cream
→ final CTA slide on deep. `--ink` is the optional single frame, not a slot.

## Copy limits — these are hard

| Element | Limit |
|---|---|
| `__eyebrow` | ~28 characters |
| `__title` | ~60 characters / 3 lines (~15ch per line) |
| `__body` | ~110 characters |
| `__quote` | ~130 characters |
| Carousel slide title | ~45 characters |

## Type floor

30px for everything, including eyebrows, labels and captions.

## Common mistakes

- Gradient on every slide of a carousel. One, at most.
- Forgetting the mark on body slides of a carousel.
- Reaching for `--ink` because it looks strongest. It is reserved; use `--deep`.
