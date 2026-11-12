---
name: ps-cutout
description: Remove the background from a photo or image and save a transparent PNG, for Przeskalowani designs. Use whenever asked to remove or cut out a background ("usuń tło", "wytnij tło", "wycięcie", "przezroczyste tło", "remove background", "cut out", "transparent PNG", "isolate the person"), and on your own whenever a Przeskalowani design needs a person or object without its background, such as a postac social template, a cut-out on a slide, a new cutout-<name>.png, or a user photo that has to sit on a brand colour.
---

# Przeskalowani: background removal

**Read the `ps-design-system` skill first** (`przeskalowani:ps-design-system` when
installed as a plugin) when the cut-out goes into a design. Its *Cut-out people* rules
decide where the figure goes and how it is checked.

Everything here runs from `scripts/` in this skill's folder. Run it; don't ask the
user which method or where to save. Just do it.

## 1. Remove the background

```bash
python3 <this skill>/scripts/remove_bg.py <photo> <out.png> --subject person 2>/dev/null
```

- `--subject person` (default) for people, `--subject object` for products, logos and
  things.
- The script prints one JSON line. `"ok": true` gives the file, the engine and the size.
  `"ok": false` gives the reason; see *When it fails*.
- It installs `rembg` itself if needed. The first run downloads the model (about 1 GB
  for people, 180 MB for objects) and takes a minute or two. Later runs are fast.
- The engine order is rembg `birefnet-portrait` (cleanest hair and edges), then a
  smaller rembg model, then Apple Vision on macOS 14+ as an offline fallback.
- An input that already has real transparency is kept as it is and only cropped. A
  proper cut-out always beats a model's guess, so ask for one when the user has it.
- Output is cropped to the subject. Pass `--no-crop` to keep the original canvas.

## 2. For a design: finish it as a system cut-out

A figure on a canvas (the `postac` social templates, `.ps-canvas__cutout`) needs a
solid bottom edge and a tight crop. Run the system's own finisher on the transparent
PNG:

```bash
node bin/clean-cutout.mjs <out.png> <final.png>
```

`bin/clean-cutout.mjs` lives in the design system's files (the local clone, the
attached design system or GitHub; see `ps-design-system`). If it can't be run, use the
step 1 file and keep the figure's bottom on the canvas edge (`bottom: 0`).

- Keep the new cut-out with the new design. Never add it to `assets/photo/` unless
  asked to add a founder cut-out to the system.
- Never bake in a shadow: it comes from `--ps-shadow-cutout`.
- A full-height figure wants 1600px of height or more. If the source photo is smaller,
  say so.

## 3. Look at it

Always look at the result before using it or handing it over. Composite it on the dark
green (`--ps-teal-900`, `#156064`, or the darkest field of the target canvas), where a light
fringe shows first, and check the hair, hands and the gaps between arms and body.

```bash
python3 -c "from PIL import Image as I;f=I.open('<out.png>');b=I.new('RGBA',f.size,'#156064');b.alpha_composite(f);b.save('<check.png>')"
```

If the edge is wrong (missing hair, a chunk of background left, a cut-off hand):

1. Retry with the other model: `--model birefnet-general` for a person in a busy scene,
   `--model isnet-general-use` for a clean studio shot.
2. If it still isn't clean, show the user and ask for a better source: a photo on a
   plain background, or a transparent PNG (on a Mac: open the photo in Photos or
   Preview, right-click the person, *Copy Subject*, paste into Preview, save as PNG).

## When it fails

| `error` says | Do |
|---|---|
| `pip install ... failed` or a download error | The sandbox has no internet for the model. Say so plainly and ask for a transparent PNG (see above), or for the code-execution network to allow `github.com` and `pypi.org` in Claude's settings. On a Mac in Claude Code, Vision runs offline. |
| `nothing left after removal` | The model found no subject. Try `--subject object`, then ask for another photo. |
| `not found` | Wrong path. Check where the uploaded file is (in Claude chat, usually `/mnt/user-data/uploads/`). |

Never fake a removal by drawing a shape over the photo, masking it in CSS, or putting
a coloured box behind it. If no clean cut-out can be made, say so.

## Delivering

- A cut-out on its own: hand over the PNG and the check composite.
- Inside a design: use it in the copy of the template and show the export.

Built on [rembg](https://github.com/danielgatis/rembg) (MIT). The script's interface
follows `background-remove` from
[michaelboeding/skills](https://github.com/michaelboeding/skills) (MIT).
