#!/usr/bin/env node
/* ==========================================================================
   Structural checks that must hold for every export canvas.
   Run: node bin/check-canvases.mjs      (exit 1 on any violation)

   These encode rules that were each introduced because something shipped
   wrong: two brand marks on one graphic, a handle burned into an image, an
   invented city on a template.
   ========================================================================== */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['social', 'social/instagram', 'social/linkedin', 'slides', 'slides/typy', 'forms'];

const files = DIRS.flatMap(d => {
  let entries = [];
  try { entries = readdirSync(resolve(ROOT, d), { withFileTypes: true }); } catch { return []; }
  return entries.filter(e => e.isFile() && e.name.endsWith('.html'))
                .map(e => resolve(ROOT, d, e.name));
});

const problems = [];
let canvasCount = 0;

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const rel = relative(ROOT, f);
  const body = src.replace(/<!--[\s\S]*?-->/g, '');   // rules apply to markup, not comments

  // A deck file holds many canvases; the rule is one mark per CANVAS.
  const canvases = body.split(/<div class="ps-canvas /).slice(1);
  if (!canvases.length) { problems.push(`${rel}: no .ps-canvas found`); continue; }
  canvasCount += canvases.length;

  canvases.forEach((c, i) => {
    const marks = (c.match(/class="ps-canvas__(?:stamp|lockup)/g) || []).length;
    if (marks !== 1)
      problems.push(`${rel}: canvas ${i + 1} carries ${marks} brand marks (must be exactly 1)`);
  });

  // Mint is for the slides in between. The opening and closing slide of a deck,
  // and the welcome and thank-you types, sit on cream, a dark field or a photo.
  const isSet = /^slides\/(deck|zestaw)-/.test(rel);
  const isBookendType = /^slides\/typy\/(powitanie|podziekowanie)-/.test(rel);
  canvases.forEach((c, i) => {
    const bookend = isBookendType || (isSet && (i === 0 || i === canvases.length - 1));
    if (bookend && /^[^>]*\bps-canvas--mint\b/.test(c))
      problems.push(`${rel}: canvas ${i + 1} is an opening or closing slide on mint`);
  });

  // CONTRAST: an element that paints its own background must set its own text
  // colour. Inheriting the canvas colour is how cream type landed on a white
  // plan card on a dark slide — invisible, and only on some surfaces.
  canvases.forEach((c, i) => {
    const styles = c.match(/style="[^"]*background[^"]*"/g) || [];
    for (const st of styles) {
      const paintsBg = /background(-color)?\s*:\s*(?!transparent|none)/.test(st);
      const setsColor = /(^|;|\s)color\s*:/.test(st.replace(/(background|border|outline)-color\s*:/g, ''));
      if (paintsBg && !setsColor)
        problems.push(`${rel}: canvas ${i + 1} has an inline background with no text colour — ${st.slice(0, 80)}`);
    }
  });

  if (/#fff(fff)?\b|:\s*white\b|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/i.test(body))
    problems.push(`${rel}: uses pure white; white is --ps-paper`);

  if (/background(-color)?\s*:\s*var\(--ps-teal-900\)/.test(body))
    problems.push(`${rel}: flat teal-900 background; use --ps-gradient-deep`);

  if (/—|&mdash;|&#8212;/.test(body.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '')))
    problems.push(`${rel}: uses an em dash, which the brand never does`);

  if (/@przeskalowani|przeskalowani\.pl/.test(body))
    problems.push(`${rel}: carries a handle or URL — the lockup is the only identification`);

  if (/class="[^"]*\bps-canvas--guides\b/.test(body))
    problems.push(`${rel}: ships with ps-canvas--guides still applied`);

  for (const banned of ['Poznań', 'marzec', 'kwiecień', 'edycja jesienna', 'edycja wiosenna'])
    if (body.includes(banned))
      problems.push(`${rel}: invented place/date — "${banned}"`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`✓ ${files.length} files / ${canvasCount} canvases: one mark each, no handles, no guides, no invented place or date`);
