# Changelog: Przeskalowani design system

Each change is named with its date (DD.MM.YYYY), newest first. Plugin changes are in
`plugin/CHANGELOG.md`. The spec page shows both in Polish, under **Zmiany**: add each change to
`docs/changelog/design-system.pl.md` too, then run `node bin/changelog.mjs` (the
pre-commit hook runs it and stops if the two lists differ).

## 12.11.2026 · Changelog tab and person cut-outs

- The spec page has a new **Zmiany** (changelog) tab with the history of the design system and the plugin.
- `bin/clean-cutout.mjs` lifts the person with the same Apple Vision script as the `ps-cutout` skill.

## 12.11.2026 · Design system in Claude settings

- The design system is connected in Settings > Capabilities > Design systems, synced from GitHub.
- The guide on the spec page is split into two parts: the design system and the plugin.

## 09.11.2026 · Update guide

- The spec page has a section on updating the design system, with screenshots.

## 09.11.2026 · Cut-out person templates

- New `postac` templates for Instagram and LinkedIn: a cut-out person on a brand field.
- The founders' cut-outs in `assets/photo/cutout-*.png` and the `bin/clean-cutout.mjs` script.

## 09.11.2026 · Version number

- A vX.X.X version in `VERSION`, the README and the spec page.
- Every commit adds 1 to it.

## 09.11.2026 · Prompts for Claude Design

- The example prompts on the spec page point at the Przeskalowani design system.

## 09.11.2026 · A4 documents

- A4 page templates: welcome, general, pricing, schedule, exercises, thank-you.
- A **Docs** tab on the spec page.
- Design copies keep their template's layout. A new layout is built only on request, and only in the copy.

## 09.11.2026 · Published spec page

- The spec page is published on Netlify, and the root address leads to `docs/`.

## 08.11.2026 · Slide fixes

- Titles on full-width slides sit in the mark's band, and content is centred under the title.
- Wider title spacing, moved into shared CSS.

## 07.11.2026 · First version of the design system

- Tokens, web components and layouts, social templates, slides, form headers, logo and photos.
- `docs/index.html` as the full spec.
- Thank-you slides on the green gradient, and full-bleed decks.
