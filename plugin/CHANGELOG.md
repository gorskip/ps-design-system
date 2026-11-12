# Changelog: Przeskalowani plugin

Each change is named with its date (DD.MM.YYYY), newest first. Design system changes
are in `CHANGELOG.md` at the repository root. The spec page shows
both in Polish, under **Zmiany**: add each change to `docs/changelog/plugin.pl.md`
too, then run `node bin/changelog.mjs` (the pre-commit hook runs it and stops if the
two lists differ).

## 12.11.2026 · Background removal

- New `ps-cutout` skill: removes the background from a photo and saves a transparent PNG of a person or an object.
- Runs on its own when a design needs a cut-out, such as the `postac` templates.
- Works in Claude chat and Claude Code (rembg, BiRefNet-portrait model). On a Mac without internet, it uses Apple Vision.

## 12.11.2026 · Design system updates from the Code tab

- `ps-update` updates the design system too, not only the plugin.

## 12.11.2026 · Plugin version check

- `ps-update` checks the installed plugin version and confirms it after the update.

## 12.11.2026 · ps-update skill and icon

- New `ps-update` skill: updates the plugin and the design system to the newest version.
- The plugin has its own icon.
- The guide on the spec page is split into two parts: the design system and the plugin.

## 12.11.2026 · First version of the plugin

- The skills packaged as a Claude plugin: `ps-design-system`, `ps-social-post`, `ps-slides`, `ps-docs`, `ps-forms` and `ps-www`.
- Install guide on the spec page.
