---
name: ps-docs
description: Create Przeskalowani A4 documents from the page library, such as offers, programmes, workbooks, handouts and exercise sheets. Use whenever asked for a document, PDF, A4, oferta, dokument, karta pracy or ćwiczenia, including requests by name such as cennik-b or cwiczenia-a. Picks the right base pages and enforces the document rules.
---

# Przeskalowani: A4 documents

**Read `.claude/skills/ps-design-system/SKILL.md` first.** It holds the rules for
every surface: colours, white, gradients, typography, logo, tone, data, photography
and canvases.

`documents/typy/` is the only base for a new document. A page is A4 portrait,
794 × 1123 px at 96 px per inch, so it prints to exactly 210 × 297 mm. Pages use the
slide vocabulary from `social/social.css`, resized for reading distance by
`documents/documents.css`, which every page loads after `social.css`.

## Building a document

1. Take one file from `documents/typy/` per page. If the request names files, use
   those; otherwise choose by content, opening with `powitanie` and closing with
   `podziekowanie`.
2. Copy each `.ps-canvas` and change the copy and the photo. The layout may change
   too when the content needs it; colours, type sizes and spacing still come only
   from the system, and the document rules below still apply.
3. Save one file outside this repo, as `ps-design-system` describes, with the
   pages one after another inside `<div class="ps-doc">` and the three stylesheets
   pointing back here. Number the pages between the first and the last.
4. Run `node bin/check-canvases.mjs` on the library, then check each page by eye.
5. For a PDF: open the file in Chrome, Print, Save as PDF, margins none, background
   graphics on. Each `.ps-canvas--doc` is one sheet.

## The page library

Six types, each with variants A and B: `powitanie`, `ogolny`, `cennik`,
`harmonogram`, `cwiczenia`, `podziekowanie`. A file is named by type and variant,
such as `cennik-b`. The letters are labels, not an order.

- Powitanie: `a` the green gradient cover, `b` cream with a photo block.
- Ogólny: `a` running text, numbered points and a callout; `b` a table.
- Cennik: `a` three columns; `b` one option per row, price on the right.
- Harmonogram: `a` a day by the hour; `b` weeks and months.
- Ćwiczenia: `a` numbered questions with ruled lines (`--lines` sets how many);
  `b` numbered steps and four paper boxes to fill in.
- Podziękowanie: `a` founders and QR codes on the green gradient; `b` the same on cream.

## Rules

- **Type floors:** 14px for content, 11px for eyebrows, page numbers, labels and
  captions. The sizes live in `documents.css`; never set a font size inline.
- **Mark top-right**, level with the first line of copy. The first and last page
  carry the full lockup and no page number. Every page between carries the mark
  alone (`.ps-canvas__lockup--mark`) and a number pinned bottom-right.
- **Content flows from the top.** Unlike a slide, a page is read, so the block
  under the title starts right under it. If it doesn't fit, move it to the next
  page. Never shrink the type or the padding.
- **Content pages are paper or cream.** The dark green gradient is for the cover
  and the thank-you page only: it uses a lot of ink. Never mint on the first or last
  page.
- **A photo sits in its own rounded block** (`.ps-doc__photo`), never under copy.
- **Writing space** for exercises is `.ps-doc__lines` or `.ps-doc__box`. A box
  paints its own paper background and declares its own text colour.
- **QR codes on paper are at least 84px (22 mm).** Smaller and a phone at arm's
  length stops reading them.
- Pricing: up to three options, the recommended one labelled, never enlarged.
  Prices and counts stay placeholders (`0 000 zł`, `00 osób`) until given.

## Export

`node bin/export.mjs documents/typy/cennik-a.html` writes a PNG at 3×, about 290 dpi.
For print, use the PDF route above.
