---
name: ps-design-system
description: The general rules for everything Przeskalowani makes, on every surface. Read this first for any Przeskalowani work, together with ps-www, ps-social-post, ps-slides or ps-forms, and on its own for questions about the brand's colours, white, gradients, typography, logo, QR codes, photography, tone of voice or founders. Forbids inventing colours, radii, spacing values or data.
---

# Przeskalowani Design System: general rules

These apply everywhere. Surface rules live in their own skills:
`ps-www` (website), `ps-social-post` (Instagram and LinkedIn), `ps-slides`
(presentations) and `ps-forms` (Google Forms headers).

The system lives in this repo. **Read the token files before writing CSS** —
do not work from memory of this document.

```
tokens/                ← color, type, space, radius, motion, elevation
docs/index.html        ← the live spec; open it to check anything
```

## The system is the reference

Everything here is an example to copy, and every new design is a copy that follows
these rules. When asked to make something new:

- **Never edit, overwrite or save into this repo's files.** That includes `slides/`,
  `social/`, `forms/`, `assets/`, `tokens/` and `components/`.
- **In Claude Design,** new work stays in the Claude project.
- **In Claude Code,** save it in a folder outside this repo, such as
  `../przeskalowani-projekty/<name>/`, with its CSS and asset paths pointing back here.
  If it's unclear where the work should go, ask.

Change the system's own files only when the request is explicitly to change the
design system.

## The one rule

**Never invent a value.** Not a hex code, not a radius, not a spacing step,
not a font size. Every value comes from `tokens/`. If the design calls for
something the tokens don't cover, say so and ask — that is a design decision,
not something to paper over with a one-off value.

## White means paper

When anyone asks for white ("biały", "białe tło", "white text"), use `--ps-paper`
(`#F8F7F7`). Never write `#FFFFFF`, `#FFF`, `white` or `rgb(255, 255, 255)`, and don't
ask whether they meant pure white: there is none in this system. If someone
explicitly insists on pure white, say it breaks this rule and ask them to confirm.
`bin/check-canvases.mjs` fails a canvas that uses pure white.

## Never invented data

When a name, price, figure or other specific is not provided, write a placeholder.
Never write a plausible-looking guess. A name is `Miejsce na imię i nazwisko`, a
price is `0 000 zł`, a figure with no source is all zeros captioned
`Miejsce na źródło`, and a count such as seats is `00 miejsc`. Places and dates are
left out. A specific belongs to a real engagement, and a guessed one is wrong by
default, so add it only when given it.

## Never an em dash

Nothing anyone reads, on any surface, contains an em dash ("—"): not a heading, not
a caption, not an attribution, not a `<title>`. Use a comma, a colon or a new
sentence. A range keeps its en dash ("3–4"). `bin/check-canvases.mjs` fails a canvas
that breaks this.

## Never an underlined link

Never, in any context: not in running copy, not in the footer, not on hover. Links
are identified by colour plus a medium weight, and shift colour on hover.

## Colours

| Token | Hex | Where it may be used |
|---|---|---|
| `--ps-teal-900` | `#156064` | Primary. Headings, buttons, links. **Light mode only** — 2.84:1 on black. |
| `--ps-teal-700` | `#2F9C95` | Hover, borders. Large text only on white (3.11:1). |
| `--ps-teal-500` | `#40C9A2` | **Shapes only on light backgrounds** (1.95:1 on white). The decorative `.ps-card__index` numeral counts as a shape. Safe for text on black (10.09:1). |
| `--ps-violet-500` | `#8661C1` | Counter-accent, used sparingly. 4.37:1 on white. |
| `--ps-cream` | `#EBE8E7` | The logo's outline colour. Also a full surface — cards, alt sections, social canvases. |
| `--ps-ink` | `#000000` | **Logo only.** Too harsh as a page surface. |
| `--ps-paper` | `#F8F7F7` | **The brand's white.** Pages, cards, panels and white text. Use this whenever someone asks for white. |
| `--ps-white` | alias | Points to `--ps-paper`, so the name can't produce pure white. Write `--ps-paper` in new code. |
| `--ps-coal` | derived | The dark page and all body text. Black, lifted. |
| `--ps-violet-600` | derived | The only violet legal for body text (5.02:1 on paper). |

`--ps-violet-500` measures **4.37:1 on paper** and no longer clears AA for body
text — use `--ps-violet-600`, or keep violet-500 for large text and shapes.

Contrast is binding, not advisory. `docs/index.html` measures every ratio live.

Always the token: never write `#156064` directly instead of `var(--ps-teal-900)`.

**Teal-900 as a background is always a gradient, never a flat field.**
`.ps-canvas--deep` paints `--ps-gradient-deep` on every canvas and panel, and small
filled chips use it too: both ends are teal-900, one deepened toward ink, so no new
colour enters the system. A flat field reads as a dead rectangle and bands on weak
projectors. Text on it is cream, or `--ps-teal-on-deep` for accents. **Never
`--ps-teal-500` as text there** — it measures 3.49:1; it stays for rules, chips and
shapes. `--ps-teal-700` is 2.18:1 on deep and is never legal.

## Gradients

The signature gradient appears **at most once per viewport**. Not on every card.
And pick the right one:

- `--ps-gradient-mark` — the bright, full gradient. **Shapes only.** Cream
  on its teal-500 end measures 1.71:1; nothing legible can sit on it.
- `--ps-gradient-mark-deep` — the dark half, with violet deepened until
  every point clears 4.5:1 against cream. **Use this whenever the surface
  carries text** (`.ps-card--gradient` and `.ps-canvas--gradient` already do).
- `--ps-gradient-green` / `--ps-gradient-green-deep` — the second and last
  gradient: bright teal → mid teal → teal-900, **no violet**. It exists so
  a second coloured field (a deck, a second frame in a feed grid) does not
  have to reach for the signature one. Same split: the bright version is
  shapes only (coal on teal-900 is 2.55:1), the `-deep` version is the only
  one that may carry text, and only cream (4.99:1 → 5.96:1).
  Surfaces: `.ps-canvas--gradient-green`, `.ps-canvas--gradient-green-bright`.
- There are **two** gradients in this system. Do not invent a third.

## Depth and icons

**No glassmorphism and soft shadows.** No `backdrop-filter`. No blurred
shadow under every card. Depth in this system is the cream outline and
flat colour, exactly as in the logo. Two shadows exist, both for genuinely
floating UI (menus, toasts).

**No emoji as iconography.** 🚀 ✨ 💡 are not part of this system. Icons are
geometric line shapes from the triangle/circle vocabulary, drawn as inline
SVG with `stroke="currentColor"`. No stock photography, no drop shadows, no
outlined display type.

## Text colour

**An element that paints its own background declares its own text colour.**
A pricing tile, a callout or a panel must not inherit `color` from the canvas or
section around it: that is how cream type ended up on a white plan card on a dark
slide, invisible, and invisible only on some surfaces. The same applies to
opacity: a self-coloured panel states its muted colour (`--ps-color-text-muted`)
instead of fading an inherited one, because `.78` of cream on white is still
cream on white. Conversely, an element with no background of its own inherits
its text colour, so it stays legible on every surface. The one exception is a
deliberate accent that names a surface's legal token: `--ps-teal-900` on light,
`--ps-teal-on-deep` or `--ps-cream` on dark. `bin/check-canvases.mjs` fails any
canvas carrying an inline `background` without a `color`.

## Typography

**Montserrat**, one family, weights 300/400/500/700. Sizes come from
`--ps-text-*`, which are `clamp()`-based and already fluid — do not add
responsive font-size overrides.

Polish-first: headings get `text-wrap: balance` because Polish runs ~10%
longer than English and orphans badly. Check `ą ć ę ł ń ó ś ź ż` renders in
any new weight before shipping it. Count the Polish, not a translation.

## Logo

| File | Use |
|---|---|
| `mark-light.svg` | Light backgrounds. **No cream outline** — on white it reads as a halo. |
| `mark-dark.svg` | Dark and gradient backgrounds. Cream outline present; it is what holds the mark together against black. Using `mark-light.svg` on a black canvas loses the shapes' edges. |
| `lockup-light.svg` / `lockup-dark.svg` | Mark + wordmark as a single file. The wordmark is live text — convert to outlines before sending anywhere Montserrat isn't loaded. |
| `mark-mono.svg` | One colour via `currentColor`. Print, embroidery, stamps. **Must be inlined** — `currentColor` does not inherit through `<img>`, so loading it that way renders it black on black. |
| `favicon.svg` | Simplified, legible at 16px. |

The lockup's proportions live in two tokens, `--ps-lockup-gap-ratio` (0.141)
and `--ps-lockup-word-ratio` (0.53), both measured off the original artwork
and both expressed against the mark's **height**. Every lockup in the system —
the web component, the social footer, the corner stamp — sets one size and
lets those compute the rest. **Never hard-code a gap next to a lockup**: that
is how the canvas footer drifted to 0.31 and started looking detached.

All mark SVGs share one tight `viewBox` (`136 67 734 595`) set to the real ink
bounds, so the variants are interchangeable and the mark fills the box it is
given. Do not re-pad it: the lockup gap is 0.14 of the mark height and the
wordmark is 0.53, both measured off the original artwork.

Clearspace: at least half the small triangle's width on every side — the
component already enforces this via padding. Minimums: mark 24px, full lockup
120px wide. Below that, mark only.

## QR codes

QR codes live in `assets/qr/`: `qr-asia.svg` and `qr-zuzia.svg` link to the
founders' LinkedIn profiles. Each carries its own paper field and quiet zone, so
it scans on any surface. Do not recolour them or crop the margin.

## Tone of voice

Matched to przeskalowani.pl. Informal, warm, direct.

- Address the reader as **„Ty"** — „Delegujesz, a i tak poprawiasz?", not
  „Czy Państwo delegują…".
- Name a real problem before offering anything. The site's own structure is
  *Wyzwania → Efekty*, not *Oferta → Oferta*.
- Operational, not advisory: „Działamy operacyjnie, a nie doradczo."
- No corporate filler („synergia", „holistyczne podejście", „rozwiązania
  szyte na miarę"). No motivational-poster phrasing.
- A question as a headline works well and is on-brand.
- Founders are **Asia** (Joanna Nowak: Interim Manager, Executive Coach i
  certyfikowana Trenerka PCM) and **Zuza** (Zuzanna Woźniak: HR&Operations Interim
  Manager i Liderka zespołów). Use these titles word for word.
- Recurring themes: PCM, Analiza Transakcyjna, świadome przywództwo,
  skuteczna komunikacja, zarządzanie stresem, interim management,
  skalowanie bez wypalania.

## Photography

Founder portraits live in `assets/photo/`, resized from the 16MB originals in
`baseline/photo/`. `founder-a` and `portrait-a` are Asia; `founder-b` and
`portrait-b` are Zuza; `founders` is both. In circles, use `.ps-canvas__person`.

- The shoot is warm: beige, red and orange blazers on bright neutral walls.
  That warmth **fights the bright teal-violet gradient**. Pair a photograph
  with deep teal, mint, cream or ink — never with `--ps-gradient-mark`.
- Text over a photograph always sits on a scrim (`.ps-canvas__scrim`). This is
  not negotiable: without it, contrast depends on whatever happens to be
  behind the words, which cannot be known in advance. The stamp counts: both
  scrims carry a band at the top as well as the bottom, because the walls in
  this shoot are bright. Keep faces below it.
- Better still, use `.ps-canvas--split` — photo on top, copy on flat colour
  below. Contrast is then fixed rather than image-dependent.
- Faces sit high in these frames; the crop is already biased upward.

### Using a different photo

A copy can use any photo, as long as it follows the rules above and is a real photo,
never stock. Examples keep theirs.

1. Keep the new photo with the new design, not in this repo's `assets/photo/`.
2. In the copy, change the `src` and the `alt`.
3. Reframe it with the existing controls: `object-position` on `.ps-canvas__media`,
   `.ps-canvas__photo` and `.ps-canvas__frame`, or `--fx`, `--fy` and `--zoom` on
   `.ps-canvas__avatar`.
4. **Look at the export.** The tools catch a missing file but can't see a face under
   a scrim or a mark. Faces must stay clear of the copy and of the scrim's dense part.

Minimum widths: 2400px for a full-photo slide, 1200px for a photo column, a split
canvas, a frame or a circle. If the person isn't in the founders' map above, don't
name them unless told who it is.

Never put `loading="lazy"` or `decoding="async"` on a canvas image: the export can
capture the slide before the photo paints, and the result is a blank column with no
error.

## Canvases

These apply to every fixed-pixel canvas: social graphics, slides and form headers.

**Start from a copy.** Designing a new layout instead of copying a template is the
most common mistake. Copy the closest file and change only the copy and, where the
canvas has one, the photo.

**The canvas is fixed pixels. Overlong copy overflows; it does not reflow.** If the
copy doesn't fit, **cut the copy** — do not shrink the font, widen the `max-width`,
or reduce the padding. The sizes are part of the brand.

**One mark per canvas — never two.** A graphic carries the brand mark exactly
once. Never a corner stamp *and* a footer lockup on the same canvas: they do
the same job, they compete, and at thumbnail size they become two smudges.

**Every canvas carries the lockup and nothing else.** No `@handle`, no URL, ever.
The handle belongs in the profile that is already displaying the post; the URL
belongs in the caption, where it is clickable. Burned into the image both compete
with the one mark that should be identifying the brand, and both date the graphic
the moment anything changes.

**The wordmark in a stamp or lockup is exempt from type floors.** It is logo, sized
by `--ps-lockup-word-ratio`, and governed by the lockup's own minimum width.

**Nothing that carries meaning is absolutely positioned.** The lockup, the
stamp, the eyebrow, the headline, the footer — all are flex children laid out
in order, so a collision is *impossible*, not merely avoided. `position:
absolute` survives only for decoration that carries no text and sits behind
everything: `.ps-canvas__motif`, `.ps-canvas__arc`, `.ps-canvas__photo`,
`.ps-canvas__scrim`. If you find yourself adding `margin-top` to dodge
something, you have reintroduced the bug — fix the order instead.

**No text sits on an arc.** If copy reaches it, make the arc smaller, move it, or
drop it.

**The motif** (`.ps-canvas__motif`) is always a crop of the real logo, bleeding off
one corner at low opacity. Never an abstract blob, swoosh, mesh gradient or stock
shape. It does not count as a mark: it is a cropped, low-opacity fragment used as
texture and is never legible as a logo.

**One accent rule** (`.ps-canvas__rule`) above the title. Not three.

### Export

```sh
node bin/check-canvases.mjs                  # structural rules
node bin/export.mjs social/instagram/teza-a.html   # one file or folder
```

The exporter reads the size off the canvas, exports at 2× (form headers at 1×),
and refuses a canvas whose font failed, whose text left the frame, or which holds
several canvases, so decks and sets are not exported this way. Exporting social or
slides at 1× looks soft on a phone; `bin/export.mjs` picks the scale.

Still check by eye before handing over: Polish diacritics render, the lockup is
legible, no text runs over decoration or into the slide number.
