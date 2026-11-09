---
name: ps-forms
description: Create Przeskalowani Google Forms headers. Use whenever asked for a form header, form banner, nagłówek formularza or a graphic for a Google Form. Applies the 1600 × 400 template and keeps the area Google covers empty.
---

# Przeskalowani: form headers

**Read `.claude/skills/ps-design-system/SKILL.md` first.** It holds the rules for
every surface: colours, white, gradients, typography, logo, tone, data, photography
and canvases.

Headers live in `forms/`, at 1600 × 400. Copy the closest file, save the copy outside this
repo as `ps-design-system` describes, and change the text. The layout may change too,
as long as it keeps the rules below.

Google crops to roughly 4:1 **and paints the form's own title across the
lower-left**, so copy stays in the upper-left, the lockup goes top-right
(`.ps-canvas__stamp--tr`), and the bottom 128px stays empty. No photo: it would take
the top-right corner from the mark and put faces under the form title.
`.ps-canvas--guides` shows that band.

## Type floor

24px for everything, including eyebrows and labels.
