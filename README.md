# Przeskalowani Design System

The source of truth for how Przeskalowani looks on the website, Instagram,
LinkedIn, slides and Google Forms headers.

Open **`docs/index.html`** in a browser. That page is the full spec. If something
isn't in it, it isn't in the system.

## Use it with Claude

- **Claude Design** (social graphics, slides, form headers): create a design
  system with **Sync from GitHub** and select `gorskip/ps-design-system`. Sync
  again whenever the repo changes.
- **Claude Desktop**: add the skills from `.claude/skills/` as capabilities.
- **Claude Code** (website): clone this repo and run Claude Code in it. The skills
  load automatically.

| Skill | For |
|---|---|
| `ps-design-system` | General rules for every surface. The other skills read it first. |
| `ps-www` | Website pages and components, SEO, Core Web Vitals. |
| `ps-social-post` | Instagram and LinkedIn graphics. |
| `ps-slides` | Presentations and the slide library. |
| `ps-forms` | Google Forms headers. |

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
