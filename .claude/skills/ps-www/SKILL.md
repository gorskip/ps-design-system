---
name: ps-www
description: Build, style, edit or review the Przeskalowani website (przeskalowani.pl). Use for any page, landing page, section, component, email, HTML, CSS or WordPress theme, including markup, head tags, structured data, images, fonts and anything that affects how the page loads. Enforces the closed component set, SEO and Core Web Vitals rules.
---

# Przeskalowani: website

**Read `.claude/skills/ps-design-system/SKILL.md` first.** It holds the rules for
every surface: colours, white, gradients, links, typography, logo, tone and data.

Applies to the **website only**. `social/`, `slides/` and `forms/` are image
export canvases; none of this applies to them.

```
ps-design-system.css   ← import this one file; it pulls in everything
components/            ← the closed component set
patterns/              ← page-level compositions
seo/head.html          ← the <head> partial, with every placeholder marked
seo/schema.json        ← the JSON-LD graph, with every unknown marked TODO
docs/preview-www.html  ← a working page that implements both
```

## Building a site

A site is a separate project that imports this system. Don't edit the system's files
to build a page. A component or token change goes here only when the request is
explicitly to change the design system.

## Semantic colours

Components reference the **semantic** layer only
(`--ps-color-text`, `--ps-color-accent`, …), never the primitives directly —
that is what makes dark mode work without touching any component.

## The complete component set

This list is closed. Seven families. Do not create an eighth, and do not add
a variant that isn't listed.

| Component | Variants |
|---|---|
| `.ps-btn` | `--primary` `--secondary` `--ghost` `--link` · `--lg` · `--block` |
| `.ps-card` | `--outlined` `--gradient` `--link` |
| `.ps-field` / `.ps-input` / `.ps-textarea` / `.ps-select` / `.ps-check` | `.ps-field--error` |
| `.ps-nav` | desktop + mobile (`data-open`) |
| `.ps-badge` | `--outline` `--solid` |
| `.ps-section` / `.ps-container` | `--alt` `--invert` `--tight` · `--narrow` |
| `.ps-logo` | `--sm` `--lg` `--mark-only` |

Patterns (page-level): `.ps-hero`, `.ps-challenges`, `.ps-services`,
`.ps-outcomes`, `.ps-people`, `.ps-quote`, `.ps-footer`.

Prefer the `.ps-logo` component (mark `<img>` + real text) over the lockup SVG: the
wordmark stays selectable and translatable.

## Forbidden — these are what "AI slop" looks like

1. **Pill-shaped buttons and bubbly corners.** The UI is tight:
   `--ps-radius-sm` (6px) inputs and checkboxes, `--ps-radius-md` (10px)
   buttons and badges, `--ps-radius-lg` (14px) cards and panels,
   `--ps-radius-xl` (20px) the largest surfaces only. `--ps-radius-pill` is
   reserved for genuinely circular things — the dots from the mark, radio
   buttons, avatars. **A button is never a pill.** The logo's 38px/30px
   rounding belongs to the mark at mark scale; it is not a UI radius.
2. **The centred-hero template.** Centred headline → centred subhead →
   centred button → symmetric row of three cards is the single most
   recognisable generated layout. `.ps-hero` is a 7/5 asymmetric split,
   left-aligned, by design. `.ps-outcomes` and `.ps-services` are offset
   grids. Keep them that way.
3. **Scroll-triggered fade-ins, parallax, floating particles.** The current
   site has particle PNGs; the rebuild drops them. Motion is feedback only —
   two durations, two easings, `prefers-reduced-motion` honoured.
4. **Removing focus outlines.** `outline: none` without a replacement ring is
   forbidden. If a ring looks wrong, restyle it.

## Common mistakes

- Using `--ps-teal-500` for body text on a light background. It is 1.95:1. It
  is for shapes.
- Reaching for a primitive (`--ps-teal-900`) inside a component instead of the
  semantic role (`--ps-color-accent`). The primitive breaks in dark mode.
- Adding a fifth button variant for a one-off. Use `--ghost`, or ask.
- Building a layout with three equal cards in a row because it's the default
  mental image. Use `.ps-outcomes` or `.ps-services` — both are asymmetric.
- Putting a plain `.ps-card` on a `.ps-section--alt` and expecting it to show.
  It would be the same colour — so `--alt` re-points the card surface for you.
  Don't fight that by hardcoding a background; use `.ps-card--outlined` if you
  want a visible edge.
- Adding `margin` to a component from outside. Spacing belongs to the layout
  (`.ps-stack`, `.ps-section`), not the component.
- Hand-writing a media query breakpoint. The system uses `60rem` and `36rem`;
  match them.
- Giving `code` a fixed background colour. It derives from `currentColor`, so
  it stays legible on the dark footer; a fixed cream background rendered
  cream-on-cream there and the text vanished.
- Faking a checkmark with stacked `linear-gradient`s. It smudges at 20px. The
  tick is two borders on a rotated box.

## Tailwind

Only if the project is Tailwind v4. Import `tailwind/theme.css` — it re-points
Tailwind's theme at the same tokens, restating nothing. Even then, prefer the
`.ps-*` components over reassembling a button from utilities; utilities are
for layout and one-off spacing.

## SEO and Core Web Vitals: the rules that must never be broken

**1. One stylesheet, built.** Link `dist/ps-design-system.css`, produced by
`node build/bundle.mjs`. Never link `ps-design-system.css` — it is a graph of
21 `@import`s, and `@import` is invisible to the browser's preload scanner, so
the browser must download and *parse* the parent before it discovers the rest.
That cost 2 extra serial round trips with a blank screen throughout. Measured:
22 requests and 54.5 KB became 1 request and 5.7 KB gzipped.

**2. No `@import` of anything remote, from any CSS file, ever.** The font used
to be pulled by an `@import` nested *inside* an imported stylesheet: four
serial round trips, two of them cold cross-origin handshakes, before a glyph
could paint. `build/bundle.mjs` throws if it finds one.

**3. The font is self-hosted and preloaded.** `assets/fonts/Montserrat-*.woff2`,
two variable subsets (latin 35 KB, latin-ext 68 KB — Polish diacritics live in
latin-ext). `<link rel="preload" as="font" crossorigin>` in the head. A
metric-matched `@font-face` fallback (`Montserrat Fallback`, `size-adjust:
112%`) keeps the swap from re-measuring every line — which matters here
because the type scale uses `ch` units, so the hero `h1`'s own box width
changes at swap, right next to the LCP element.

**4. Every `<img>` carries `width` and `height`.** Including SVG logos. Without
intrinsic dimensions the box is unknown until the file decodes, and the nav is
at the top of the page, so it shifts everything. This is pure CLS.

**5. Exactly one above-the-fold image is `fetchpriority="high"` and preloaded.
Everything else is `loading="lazy" decoding="async"`.** Preloading more than
one slows the first. Never put `loading="lazy"` on the LCP image — it is the
classic LCP regression.

**6. Images ship as WebP with a JPEG fallback, cropped to their display
ratio, with `srcset`/`sizes`.** The hero was a 1200×1800 JPEG at 270 KB shown
at 405×405 cropped — more than half the pixels discarded before display. Now
1:1 at three widths: the LCP byte is 18 KB.

To use a different website photo, make 480, 800 and 1200px versions in both formats, then
update every `srcset`, `width` and `height`. For the hero, also update the preload in
the head and `og:image`. No script does this yet.

**7. Heading level is chosen for the OUTLINE, never for the size.** Use
`.ps-h1`–`.ps-h4` to change size. The footer used to go `h2` → `h4` purely
because `.ps-footer__heading` is styled small; that is a level skip caused by
visual thinking. If a section needs a heading the design does not show, use
`.ps-sr-only` — never `display: none`, which removes it from the outline and
the accessibility tree.

**8. Every `<section>` that is a landmark gets an accessible name** via
`aria-labelledby` pointing at its own heading. A `<section>` without a name is
not exposed as a landmark at all.

**9. Every page has a unique `<title>`, `<meta name="description">`, a
self-referencing absolute `<link rel="canonical">`, and complete Open Graph
tags.** Copy `seo/head.html` and fill it. A missing canonical on a WordPress
site is how you end up competing with your own `?utm=` URLs.

**10. JSON-LD on every page**, from `seo/schema.json`. `ProfessionalService` +
`Organization` + `Person` for each founder + `Course` per workshop. Delete any
node you cannot fill truthfully — **an invented value is worse than an absent
property**, and `Course` is rich-result eligible, so wrong data is visible.

**11. No `href="#"` in shipped markup.** A placeholder link on the conversion
CTA is a dead end for users and a crawl trap.

**12. A link among text of the same colour gets its own colour token and a medium
weight**, as in the footer, so position is not the only difference (WCAG 1.4.1).

### Before you ship a page

```sh
node build/bundle.mjs      # one stylesheet, hashed, comments stripped
```

Then check by hand, because these are not automated yet:
- one `<h1>`, no skipped levels
- every image has dimensions, exactly one is high-priority
- title + description + canonical + OG are filled, not placeholders
- JSON-LD validates and contains no `TODO`
- no horizontal scroll at 360px

### Common SEO mistakes in this codebase

- Linking `ps-design-system.css` instead of `dist/ps-design-system.css`.
- Adding a font `@import` back into `tokens/type.css` "just for now".
- Copying a component into a template and dropping `width`/`height` off its image.
- Picking `h4` because the heading should look small.
- Writing a real-looking phone number, address or price into `schema.json`
  instead of leaving the `TODO`.
