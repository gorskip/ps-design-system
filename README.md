# Przeskalowani Design System

The source of truth for how Przeskalowani looks on the website, Instagram,
LinkedIn, slides, A4 documents and Google Forms headers.

Open **`docs/index.html`** in a browser. That page is the full spec. If something
isn't in it, it isn't in the system.

## Use it with Claude

- **Claude Design** (social graphics, slides, form headers): create a design
  system with **Sync from GitHub** and select `gorskip/ps-design-system`. Sync
  again whenever the repo changes.
- **Claude Desktop**: add the skills from `.claude/skills/` as capabilities.
- **Claude Code** (website): clone this repo and run Claude Code in it. The skills
  load automatically.

## Which skill to use

Always pair **`ps-design-system`** with the skill for what you're making. It holds
the rules every surface shares. Use it on its own only for brand questions:
colours, gradients, typography, logo, QR codes, photography, tone of voice or
the founders.

| You're making | Skill | Where | Example prompt |
|---|---|---|---|
| Instagram or LinkedIn graphic: post, carousel, story, Reels cover, quote card | `ps-social-post` | Claude Design | `Użyj skilla ps-social-post i przygotuj grafikę: instagram-liczby-a.` |
| Presentation or single slide | `ps-slides` | Claude Design | `Użyj skilla ps-slides i zbuduj prezentację ze slajdów: powitanie-c, agenda-a, podziekowanie-a.` |
| A4 document: offer, programme, workbook, exercise sheet | `ps-docs` | Claude Design | `Użyj skilla ps-docs i przygotuj dokument ze stron: powitanie-a, ogolny-a, cennik-b, podziekowanie-b.` |
| Google Forms header (1600×400) | `ps-forms` | Claude Design | `Użyj skilla ps-forms i przygotuj nagłówek formularza na bazie forms/01-zapisy.` |
| Website page, section, component, email, HTML/CSS, WordPress theme, SEO | `ps-www` | Claude Code | `Użyj skilla ps-www i zbuduj sekcję oferty na stronę.` |

Ask for templates by name (`instagram-liczby-a`, `cytat-b`, `podziekowanie-a`).
New designs start as a copy of an existing template. The copy may change its
layout and form for the design at hand; the templates and the rest of the system
stay unchanged. The skills never invent colours, radii, spacing or data. Where a fact is missing, they leave
a placeholder.

## Use it on a website

```html
<link rel="stylesheet" href="/dist/ps-design-system.css">
```

## Commands

These need Node. Exporting also needs Google Chrome.

```sh
node build/bundle.mjs            # rebuild dist/ after changing any CSS
node bin/check-canvases.mjs      # check canvases against the structural rules
node bin/export.mjs social/instagram/teza-a.html   # export a file or folder to exports/
```

## What's here

```
ps-design-system.css   CSS source entry point; dist/ is what pages link
tokens/ base/          Design tokens, reset, light and dark layers
components/ patterns/  The closed component set and page-level compositions
tailwind/theme.css     Optional Tailwind v4 bridge
social/ slides/ forms/ Fixed-size templates for graphics, slides and form headers
documents/             A4 page templates and documents.css
assets/                Logo, QR codes, fonts, founder photos
seo/                   The <head> partial and structured data
docs/                  The live spec and a sample landing page
baseline/              Original logo PNGs; don't edit
.claude/skills/        The skills listed above
```

Not in git: `exports/` (generated) and `baseline/photo/` (full-size originals).

## Known gaps

- Montserrat is a close match to the wordmark, not a confirmed identity.
- There is no icon set yet.
- Founder photos were identified from the website, not confirmed by the founders.
- The Instagram research is partial: bio text, caption lengths and posting cadence
  couldn't be read.
