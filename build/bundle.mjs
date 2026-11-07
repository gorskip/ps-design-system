#!/usr/bin/env node
/* ==========================================================================
   Bundles the design system into one file.
   --------------------------------------------------------------------------
   WHY THIS EXISTS

   ps-design-system.css is a list of @import statements. That is fine as
   source and fatal as a deliverable: @import is invisible to the browser's
   preload scanner, because the child URLs appear nowhere in the HTML. The
   browser must download the parent, parse it, THEN discover 21 more
   stylesheets — and the CSSOM blocks first paint until all of them land.
   Measured here: 2 extra serial round trips before any content can render.

   This script flattens the graph into one file, strips comments (38% of the
   source bytes), and writes a content hash so the result can be served
   immutable. Partials stay as the source of truth; nothing is authored here.

   Usage:  node build/bundle.mjs
   Output: dist/ps-design-system.<hash>.css  +  dist/manifest.json
   ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENTRY = resolve(ROOT, 'ps-design-system.css');
const OUT_DIR = resolve(ROOT, 'dist');

/** Inline @import url('...') recursively, depth-first, in source order. */
function flatten(file, seen = new Set()) {
  const abs = resolve(file);
  if (seen.has(abs)) return '';              // guard against import cycles
  seen.add(abs);

  const src = readFileSync(abs, 'utf8');
  const here = dirname(abs);
  let out = '';
  let cursor = 0;

  const IMPORT = /@import\s+url\(\s*['"]?([^'")]+)['"]?\s*\)\s*;/g;
  for (const m of src.matchAll(IMPORT)) {
    out += src.slice(cursor, m.index);
    cursor = m.index + m[0].length;
    const spec = m[1];
    if (/^(https?:)?\/\//.test(spec)) {
      // A remote @import must never ship. Fail loudly rather than silently
      // reintroducing a render-blocking cross-origin request.
      throw new Error(
        `Remote @import found in ${relative(ROOT, abs)}: ${spec}\n` +
        `Load remote stylesheets from the document <head>, never from CSS.`
      );
    }
    out += `\n/*> ${relative(ROOT, resolve(here, spec))} */\n`;
    out += flatten(resolve(here, spec), seen);
  }
  out += src.slice(cursor);
  return out;
}

/** Conservative minifier: safe for this codebase, no CSS parser needed. */
function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')          // comments
    .replace(/\s*\n\s*/g, '\n')                // leading/trailing line space
    .replace(/\n{2,}/g, '\n')                  // blank lines
    .replace(/\s*([{}:;,>])\s*/g, '$1')        // space around punctuation
    .replace(/;}/g, '}')                       // trailing semicolons
    .replace(/\n/g, '')
    .trim();
}

const flat = flatten(ENTRY);
const min = minify(flat);
const hash = createHash('sha256').update(min).digest('hex').slice(0, 8);
const name = `ps-design-system.${hash}.css`;

mkdirSync(OUT_DIR, { recursive: true });
for (const f of readdirSync(OUT_DIR)) {
  if (/^ps-design-system\.[0-9a-f]{8}\.css$/.test(f)) unlinkSync(resolve(OUT_DIR, f));
}
writeFileSync(resolve(OUT_DIR, name), min);
writeFileSync(resolve(OUT_DIR, 'ps-design-system.css'), min);   // unhashed convenience copy
writeFileSync(
  resolve(OUT_DIR, 'manifest.json'),
  JSON.stringify({ css: name, bytes: min.length, builtFrom: 'ps-design-system.css' }, null, 2) + '\n'
);

const pct = (1 - min.length / flat.length) * 100;
console.log(`  source   ${flat.length.toLocaleString()} B  (flattened, 0 remote imports)`);
console.log(`  bundled  ${min.length.toLocaleString()} B  (-${pct.toFixed(0)}%)`);
console.log(`  wrote    dist/${name}`);
