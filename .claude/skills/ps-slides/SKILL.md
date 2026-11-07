---
name: ps-slides
description: Create Przeskalowani presentations and slides from the slide library. Use whenever asked for a presentation, deck, slide, prezentacja or slajd, including requests by name such as cytat-b or podziekowanie-a. Picks the right base slides and enforces the slide rules.
---

# Przeskalowani: slides

**Read `.claude/skills/ps-design-system/SKILL.md` first.** It holds the rules for
every surface: colours, white, gradients, typography, logo, tone, data, photography
and canvases.

`slides/typy/` is the only base for a new presentation, at 1920 × 1080. Type is much
larger than on social, because a slide is read from across a room.

## Building a presentation

1. Take one file from `slides/typy/` per slide. If the request names files, use
   those; otherwise choose by content, opening with `powitanie` and closing with
   `podziekowanie`.
2. Copy each `.ps-canvas` and change only the copy and the photo. No new layouts,
   colours or sizes.
3. Save one file outside this repo, as `ps-design-system` describes, using the deck
   shell from `slides/deck-warsztat.html` with its paths pointing back here. Number the slides between the first and the last.
4. Run `node bin/check-canvases.mjs`, then check each slide by eye.

`deck-*` and `zestaw-*` files already in `slides/` are not showcases or templates.
Take only the shell from them, never their slides.

## The type library

**The type library is nine types in `slides/typy/`, each with variants A, B, C and
D, and nothing else.** A file is named by type and variant, such as `cytat-b`. The
letters are labels, not an order or a default: choose whichever suits the content.
Usually `a` is light, `b` mint, `c` dark and `d` beside a photo, with three
exceptions. Ogólny is four layouts on a light field: `a` two columns, `b` three
columns, `c` table, `d` paragraph with `.ps-canvas__imgslot`, replaced with a real
image. Powitanie and podziękowanie cannot use mint, so powitanie `a` is the full
photo, powitanie `b` the dark gradient, podziękowanie `a` and `b` are the founders in circles on the green gradient and on
cream, and podziękowanie `c` is the green-gradient slide with large QR codes.

## Type floors

34px for content. 28px for eyebrows, slide numbers, labels, captions and founder
titles. A title keeps at least 56px of air above whatever follows it.

## Mark and slide number

**The mark goes TOP-RIGHT, and only the first and last slide get the
wordmark.** The FIRST and LAST slide of a deck — welcome and thank-you — carry
the full lockup. Every slide between them carries the MARK ALONE
(`.ps-canvas__lockup--mark`): repeating the wordmark twenty times is a
watermark, not identification. Slide marks also run about 30% smaller than the
social stamp — from across a room the mark only has to be recognisable.
Placement is the TOP-RIGHT corner, pulled tighter to the edge than the copy is.
**The title starts level with the mark.** On a full-width slide the head takes
no height: the eyebrow (or the title, when there is no eyebrow) sits on the same
top band as the mark, 68px from the top edge, not a row below it. `social.css`
does this; never add top margin or a spacer above the first line of copy.
A slide with a photo (variant D, `--wide`, `--split`) is the one exception: there
the mark goes TOP-LEFT of the block, on flat colour, as far from the block's corner
as other marks are from the canvas corner. A predictable
position is the point;
a mark that moves around the deck reads as a mistake and stops being findable.
It never goes to the bottom either: projectors crop and the front rows lose the
bottom band. The bottom band carries the slide number alone. That number is PINNED to
the bottom-right corner, mirroring the mark with the same pull — not floated
under the last line of copy, which lands it at a different height on every
slide and makes "go back to seven" impossible to act on. On a two-column slide
it pins to the bottom-right of the copy column. If copy pushes it off its pin,
cut the copy. Every slide carries the mark, and every slide between the first and
last carries a number.

## Slide chrome

- **The canvas is square; rounding lives inside it.** A slide is the page, not
  a card: a projector fills the frame edge to edge and a rounded export leaves
  four cut corners on whatever is behind it. The blocks INSIDE a slide round
  instead — on a two-column slide the copy-plus-photo block takes 28px on its
  outer corners and keeps the seam between the halves square.
- **On a two-column slide the mark sits in the BLOCK's top-left corner**, not in
  the canvas margin. The slide NUMBER stays in the copy column too, because type
  never crosses a photo without a scrim.
- **teal-500 never fills the CTA on the opening or closing slide.** It is a
  non-text colour (cream on it is 1.71:1) and a solid bright-teal bar is the
  loudest note a deck can end on — it reads as a web button pasted onto a
  slide. Use `.ps-canvas__callout--onDark` (outlined, cream type) on a dark
  field, the default paper callout on a light one.
- **No slide is a bare rectangle.** A slide carrying neither motif nor arc gets
  a quiet corner crop of the mark at 0.1. Every eyebrow opens with a small
  gradient tick (the `__rule` bar at inline scale), and section numerals
  (`.ps-canvas__step-no`, never a faded inline style) and list indices take the
  gradient through the glyphs — they are shapes, not information, which is
  exactly why they can afford it and why the contrast rule does not bind them. None of this spends the
  one full-size gradient a viewport is allowed.

Corollary: on a full-width slide the four corners are spoken for — mark top-right,
number bottom-right, copy down the left. A decorative arc therefore goes BOTTOM-LEFT
(`.ps-canvas__arc--bl`) and stays small enough to graze the corner. Schedule slides
fill the frame and carry none.

## Surfaces

**Mint never opens or closes a deck.** The first and last slide — welcome and
thank-you — sit on cream, a dark field or beside a photo. Mint is for the slides
in between. `bin/check-canvases.mjs` fails a deck or set in this repo that breaks this; it does
not scan copies saved elsewhere, so check yours by eye.

`--gradient` is for quote slides and covers only, and never more than one in a deck.
The signature gradient loses its force if it is on every slide.

**A dark thank-you slide is the green gradient** (`.ps-canvas--gradient-green`,
which paints `--ps-gradient-green-deep`), the same field as welcome `c`. Never
`--deep` and never a flat teal-900: podziękowanie `a` and `c` already use it, so
keep the class when you copy them.

**Slides are full-bleed.** Keep the deck shell's `.ps-deck` CSS and its `fit()`
script as they are: the slide fills the frame exactly, with no padding, shadow
or light backdrop. Any margin around a slide shows as a pale line in Claude
Design and on a projector. Never wrap a slide in a card, frame or padded box.

## Specific slides

**The main text of a quote or recommendation is 3/4 of the slide's width** (1440px,
or the column beside a photo). `.ps-canvas__quote` does this; don't set a `max-width`.

**A full-photo slide has safe areas for type.** `powitanie-a` is the pattern: faces
stay in the upper part of the crop, copy sits on `.ps-canvas__scrim--slide` in the
bottom band, and the mark sits on the same scrim top-left. Crop the photo so no face
reaches the band, which starts about 44% up from the bottom edge; if copy would, cut
the copy.

**Closing slides carry QR codes, not just names.** `.ps-canvas__qrs` holds one
`.ps-canvas__qr` per founder, using `assets/qr/`, captioned with the name and title.
No "LinkedIn" label. A title fits two lines at 28px; give it more width rather than a third line. Never below 150px on a slide.

**Founders in circles are centred on the face.** `.ps-canvas__avatar` takes `--fx`,
`--fy` and `--zoom`; copy them from `podziekowanie-a` rather than guessing.

**Pricing shows up to three options with one labelled as recommended** — labelled,
not enlarged, because size reads as "expensive" while a label reads as "this one".

## Common mistakes

- Putting a welcome or thank-you slide on mint.
