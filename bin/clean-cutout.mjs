#!/usr/bin/env node
/* ==========================================================================
   Make a cut-out person ready for a .ps-canvas__cutout.
   Run: node bin/clean-cutout.mjs <photo or transparent PNG> <out.png>

   Best input: a transparent PNG or WebP cut-out at full size. Its edges are
   kept exactly as they are; only steps 3 and 4 run.

   A plain photo is lifted first with macOS Vision (bin/lift-subject.js), and
   then all four steps run, because a lifted edge still carries the old
   background:

   1. EDGE, all the way round. A lifted edge pixel is a MIX of the person
      and the old background (C = a·F + (1−a)·B), which reads as a light line
      on a dark field. The background colour B is read from the photo's
      corners, then every soft pixel is un-mixed back to the
      person's own colour F, keeping its alpha, so the edge stays soft.
      Pixels too faint to un-mix take the colour of the nearest person pixel.
   2. LEAKS. Solid pixels near the outline that ARE the background colour
      (gaps around a mic arm, between strands of hair) are cleared. Only
      within a few pixels of the outline, so a bright highlight inside the
      person is never touched.
   3. BOTTOM. A figure bleeds off the bottom of the canvas, so its last row
      must be solid. Rows that are mostly half-transparent are cut off, and the
      new bottom rows are made fully opaque: no gap between figure and edge.
   4. CROP to the person, so the template positions the figure, not padding.

   The shadow is NOT baked in: it comes from --ps-shadow-cutout in CSS.
   ========================================================================== */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { readPng, writePng } from './png.mjs';

const [src, out] = process.argv.slice(2);
if (!src || !out) { console.error('usage: node bin/clean-cutout.mjs <in> <out.png>'); process.exit(2); }
const HERE = dirname(fileURLToPath(import.meta.url));

function toPng(file) {
  if (!/\.webp$/i.test(file)) return file;
  const tmp = join(mkdtempSync(join(tmpdir(), 'cutout-')), 'src.png');
  try { execFileSync('dwebp', ['-quiet', file, '-o', tmp]); }
  catch { execFileSync('sips', ['-s', 'format', 'png', file, '--out', tmp], { stdio: 'ignore' }); }
  return tmp;
}
function hasAlpha(file) {
  const b = readFileSync(file);
  return b.subarray(1, 4).toString() === 'PNG' && b[25] === 6;
}
let input = toPng(resolve(src));
let photoBg = null;   // the plain photo's own background, read from its corners
if (!hasAlpha(input)) {
  const tmpPng = join(mkdtempSync(join(tmpdir(), 'cutout-')), 'src.png');
  execFileSync('sips', ['-s', 'format', 'png', input, '--out', tmpPng], { stdio: 'ignore' });
  const s = readPng(readFileSync(tmpPng)), px = [];
  for (const [x, y] of [[2, 2], [s.width - 3, 2], [2, s.height - 3], [s.width - 3, s.height - 3]])
    px.push([0, 1, 2].map(k => s.data[(y * s.width + x) * 4 + k]));
  photoBg = [0, 1, 2].map(k => px.map(p => p[k]).sort((m, n) => m - n)[2]);   // brightest-but-one corner
  const tmp = join(mkdtempSync(join(tmpdir(), 'cutout-')), 'lifted.png');
  const r = execFileSync('osascript', ['-l', 'JavaScript', join(HERE, 'lift-subject.js'), input, tmp]).toString().trim();
  if (!r.startsWith('ok')) { console.error('lift failed: ' + r); process.exit(1); }
  input = tmp;
}

let { width: w, height: h, data: d } = readPng(readFileSync(input));
const A = i => d[i * 4 + 3];

const N = w * h;
if (photoBg) {   // steps 1–2 only for a photo we lifted ourselves
const near = (r, g, b, B, tol) => Math.abs(r - B[0]) <= tol && Math.abs(g - B[1]) <= tol && Math.abs(b - B[2]) <= tol;

// 1a. The old background colour, read from the photo's corners above.
const B = photoBg;

// Distance (in px, up to 8) from each pixel to the nearest non-solid pixel.
const dist = new Uint8Array(N).fill(255);
{ let q = [], nq;
  for (let i = 0; i < N; i++) if (A(i) < 255) { dist[i] = 0; q.push(i); }
  for (let s = 1; s <= 8; s++) { nq = [];
    for (const i of q) { const x = i % w, y = (i / w) | 0;
      for (const j of [x + 1 < w ? i + 1 : -1, x > 0 ? i - 1 : -1, y + 1 < h ? i + w : -1, y > 0 ? i - w : -1])
        if (j >= 0 && dist[j] === 255) { dist[j] = s; nq.push(j); } }
    q = nq; } }

// 2. Leaks: solid background-coloured pixels within 8px of the outline go,
//    and so does every background-coloured pixel connected to them.
{ const q = [];
  for (let i = 0; i < N; i++) if (A(i) && dist[i] <= 8 && near(d[i * 4], d[i * 4 + 1], d[i * 4 + 2], B, 7)) { q.push(i); d[i * 4 + 3] = 0; }
  while (q.length) { const i = q.pop(), x = i % w, y = (i / w) | 0;
    for (const j of [x + 1 < w ? i + 1 : -1, x > 0 ? i - 1 : -1, y + 1 < h ? i + w : -1, y > 0 ? i - w : -1])
      if (j >= 0 && A(j) && dist[j] <= 8 && near(d[j * 4], d[j * 4 + 1], d[j * 4 + 2], B, 7)) { d[j * 4 + 3] = 0; q.push(j); } } }

// 1b. Un-mix every soft pixel: F = (C − (1−a)·B) / a. Alpha is kept, so the
//     edge stays exactly as soft as the lift made it.
const ok = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  const a = A(i);
  if (a === 0) continue;
  if (a === 255) { ok[i] = 1; continue; }
  if (a < 64) continue;                     // too faint to un-mix reliably
  const t = a / 255;
  for (let k = 0; k < 3; k++) d[i * 4 + k] = Math.max(0, Math.min(255, Math.round((d[i * 4 + k] - (1 - t) * B[k]) / t)));
  ok[i] = 1;
}
// 1c. The faintest pixels take the colour of the nearest un-mixed one.
{ const q = new Int32Array(N); let head = 0, tail = 0;
  for (let i = 0; i < N; i++) if (ok[i]) q[tail++] = i;
  while (head < tail) { const i = q[head++], x = i % w, y = (i / w) | 0;
    for (const j of [x + 1 < w ? i + 1 : -1, x > 0 ? i - 1 : -1, y + 1 < h ? i + w : -1, y > 0 ? i - w : -1])
      if (j >= 0 && !ok[j] && A(j)) { ok[j] = 1; d[j * 4] = d[i * 4]; d[j * 4 + 1] = d[i * 4 + 1]; d[j * 4 + 2] = d[i * 4 + 2]; q[tail++] = j; } } }
for (let i = 0; i < N; i++) if (A(i) < 6) { d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = d[i * 4 + 3] = 0; }
}

// 3. Bottom: cut to the last row that is mostly solid, then make it hard.
const rowStats = y => { let s = 0, any = 0; for (let x = 0; x < w; x++) { const a = A(y * w + x); if (a) any++; if (a === 255) s++; } return [s, any]; };
let bottom = h - 1;
while (bottom > h * 0.8) { const [s, any] = rowStats(bottom); if (any && s >= 0.9 * any) break; bottom--; }
for (let y = Math.max(0, bottom - 3); y <= bottom; y++)
  for (let x = 0; x < w; x++) { const i = y * w + x; if (A(i) >= 64 || (y > 0 && A(i - w) === 255)) d[i * 4 + 3] = 255; }

// 4. Crop to the person.
let x0 = w, x1 = -1, y0 = h, y1 = bottom;
for (let y = 0; y <= bottom; y++) for (let x = 0; x < w; x++) if (A(y * w + x)) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; }
const cw = x1 - x0 + 1, chh = y1 - y0 + 1, c = new Uint8ClampedArray(cw * chh * 4);
for (let y = 0; y < chh; y++) c.set(d.subarray(((y + y0) * w + x0) * 4, ((y + y0) * w + x1 + 1) * 4), y * cw * 4);
writeFileSync(out, writePng({ width: cw, height: chh, data: c }));
console.log(`✓ ${out}  ${cw}×${chh}  (${photoBg ? `lifted from a photo, background rgb(${photoBg.join(',')})` : 'edges kept as they are'}, cut ${h - 1 - bottom} soft row(s) off the bottom)`);
if (chh < 1600) console.warn(`  note: ${chh}px tall; a full-height figure at 2× wants 1600px or more`);
