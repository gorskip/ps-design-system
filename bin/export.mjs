#!/usr/bin/env node
/* ==========================================================================
   Export canvases to PNG — reading the size off the canvas, not off memory.
   --------------------------------------------------------------------------
   The README used to give ONE command hard-coded to 1080×1350. Five of the
   six formats in this system are a different size, so running it verbatim
   produced silently cropped files with no error. This reads the dimensions
   from the canvas's own class, then refuses to export if the font did not
   load, text left the canvas, an image is broken, the canvas rendered at the
   wrong size, or it still shows guides. A file holding several canvases is
   refused too: one screenshot would capture only the first. Decks are skipped.

   Usage:
     node bin/export.mjs                    # everything, to exports/
     node bin/export.mjs social/instagram   # one folder
     node bin/export.mjs slides/typy/cytat-a.html
   ========================================================================== */

import { readdirSync, statSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname, relative, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'exports');
const CHROME = process.env.CHROME ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHROME_TIMEOUT = 60_000;   // a hung Chrome fails one canvas, not the run

/* Canvas class → export size. One source of truth. */
const SIZES = {
  'ps-canvas--square':   [1080, 1080],
  'ps-canvas--portrait': [1080, 1350],
  'ps-canvas--story':    [1080, 1920],
  'ps-canvas--linkedin': [1200, 1500],
  'ps-canvas--slide':    [1920, 1080],
  'ps-canvas--form':     [1600, 400],
  'ps-canvas--doc':      [794, 1123],    // A4 at 96 px per inch
};

/* 2× for everything that lands in a feed: the canvas is authored at the
   platform's native width, so 1× uploads pixel-exact but has no headroom on a
   3× phone screen. Handing the platform 2× and letting it downsample is the
   cleaner of the two resamples. Form headers are the exception — Google
   downsamples them hard, so 2× is wasted bytes. */
const SCALE = p => (p.includes('forms/') ? 1 : p.includes('documents/') ? 3 : 2);   // A4 at 3× is ~290 dpi, print quality

function walk(p) {
  const abs = resolve(ROOT, p);
  if (statSync(abs).isFile()) return abs.endsWith('.html') ? [abs] : [];
  return readdirSync(abs).flatMap(f => walk(join(abs, f)));
}

/* Runs inside the page. Only TEXT is measured against the canvas edge: the
   decoration (__arc, __motif, __photo, __scrim) is text-free and is meant to
   bleed off it. The result is URI-encoded so it survives --dump-dom's HTML
   serialisation untouched. */
const PROBE = `<script>addEventListener('load', async () => {
  await document.fonts.ready;
  const canvas = document.querySelector('.ps-canvas');
  const box = canvas.getBoundingClientRect();
  const faces = [...document.fonts];
  const overflow = [];
  const walker = document.createTreeWalker(canvas, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent.trim();
    if (!text) continue;
    const range = document.createRange();
    range.selectNodeContents(walker.currentNode);
    let by = 0;
    for (const r of range.getClientRects()) {
      if (!r.width || !r.height) continue;
      by = Math.max(by, box.left - r.left, box.top - r.top, r.right - box.right, r.bottom - box.bottom);
    }
    if (by > 1) overflow.push({ by: Math.ceil(by), text: text.slice(0, 40) });
  }
  const result = {
    x: box.left, y: box.top, w: box.width, h: box.height,
    montserrat: faces.some(f => /^"?Montserrat"?$/.test(f.family) && f.status === 'loaded'),
    faceErrors: faces.filter(f => f.status === 'error').map(f => f.family + ' ' + f.weight),
    overflow,
    brokenImages: [...canvas.querySelectorAll('img')].filter(i => !i.naturalWidth).map(i => i.getAttribute('src')),
  };
  const out = document.createElement('pre');
  out.id = '__ps_probe';
  out.textContent = encodeURIComponent(JSON.stringify(result));
  document.body.append(out);
});</script>`;

/* The page is loaded from a temp copy so the probe never touches the template;
   <base> keeps its relative URLs pointing at the real folder. */
function preflight(file, src, [w, h]) {
  const dir = mkdtempSync(join(tmpdir(), 'ps-export-'));
  try {
    const base = `<base href="${pathToFileURL(dirname(file)).href}/">`;
    const page = join(dir, 'probe.html');
    writeFileSync(page, src.replace(/<head[^>]*>/i, m => m + base + PROBE));
    const dom = execFileSync(CHROME, [
      '--headless', '--disable-gpu', '--no-sandbox', '--allow-file-access-from-files',
      '--virtual-time-budget=8000', `--window-size=${w},${h}`,
      '--dump-dom', pathToFileURL(page).href,
    ], { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore'], timeout: CHROME_TIMEOUT });

    const marker = dom.match(/<pre id="__ps_probe">([^<]*)<\/pre>/);
    if (!marker) return ['pre-flight did not complete'];
    const r = JSON.parse(decodeURIComponent(marker[1]));

    const problems = [];
    if (!r.montserrat) problems.push('Montserrat did not load');
    for (const face of r.faceErrors) problems.push(`font face failed to load — ${face}`);
    if (r.w !== w || r.h !== h) problems.push(`canvas rendered at ${r.w}×${r.h}, expected ${w}×${h}`);
    if (r.x !== 0 || r.y !== 0) problems.push(`canvas sits at ${r.x},${r.y}, not 0,0 — the screenshot would crop it`);
    for (const o of r.overflow) problems.push(`text overflows canvas by ${o.by}px — "${o.text}"`);
    for (const img of r.brokenImages) problems.push(`broken image — ${img}`);
    return problems;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/* A PNG stores its size in the IHDR chunk: width at byte 16, height at byte 20. */
function pngSize(path) {
  const b = readFileSync(path);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

try {
  execFileSync(CHROME, ['--version'], { stdio: 'ignore', timeout: CHROME_TIMEOUT });
} catch {
  console.error(`✗ Chrome not found at ${CHROME}\n  Set the CHROME environment variable to its path.`);
  process.exit(1);
}

const requested = (process.argv.slice(2).length ? process.argv.slice(2)
  : ['social/instagram', 'social/linkedin', 'slides/typy', 'forms', 'documents/typy'])
  .flatMap(walk);
const isSkipped = f => /deck-|index\.html$/.test(basename(f));
const targets = requested.filter(f => !isSkipped(f));
for (const f of requested.filter(isSkipped)) console.log(`– ${relative(ROOT, f)}: skipped, decks are not exported`);

mkdirSync(OUT, { recursive: true });
let failed = 0;

for (const file of targets) {
  const rel = relative(ROOT, file);
  const out = resolve(OUT, rel.replace(/[/\\]/g, '__').replace(/\.html$/, '.png'));
  const fail = msg => console.error(`✗ ${rel}: ${msg}`);

  // Clear the previous export first, so a canvas that fails now can't leave an
  // old image behind that passes for current.
  rmSync(out, { force: true });

  try {
    const src = readFileSync(file, 'utf8');
    // Match CLASSES, not words — several files mention a class in a comment
    // explaining how to use it.
    const markup = src.replace(/<!--[\s\S]*?-->/g, '');

    const key = Object.keys(SIZES).find(k => new RegExp(`class="[^"]*\\b${k}(?![\\w-])`).test(markup));
    if (!key) { fail('no size class found'); failed++; continue; }

    const canvases = (markup.match(/class="ps-canvas[\s"]/g) || []).length;
    if (canvases !== 1) {
      fail(`holds ${canvases} canvases — one screenshot would capture only the first`);
      failed++; continue;
    }

    if (/class="[^"]*\bps-canvas--guides\b/.test(markup)) {
      fail('still has ps-canvas--guides — remove before export');
      failed++; continue;
    }

    const problems = preflight(file, src, SIZES[key]);
    if (problems.length) {
      problems.forEach(fail);
      failed++; continue;
    }

    const [w, h] = SIZES[key];
    const scale = SCALE(rel);
    execFileSync(CHROME, [
      '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
      '--force-color-profile=srgb',           // deterministic across machines
      '--allow-file-access-from-files',
      `--window-size=${w},${h}`,
      `--force-device-scale-factor=${scale}`,
      '--virtual-time-budget=8000',
      `--screenshot=${out}`, pathToFileURL(file).href,
    ], { stdio: 'ignore', timeout: CHROME_TIMEOUT });

    const [pw, ph] = pngSize(out);
    if (pw !== w * scale || ph !== h * scale) {
      rmSync(out, { force: true });
      fail(`PNG came out ${pw}×${ph}, expected ${w * scale}×${h * scale}`);
      failed++; continue;
    }

    const alt = (src.match(/<meta name="ps-alt" content="([^"]*)"/) || [])[1];
    console.log(`✓ ${rel}  →  ${pw}×${ph}  exports/${basename(out)}`);
    if (alt) console.log(`    alt: ${alt}`);
  } catch (err) {
    rmSync(out, { force: true });
    fail(err.message.split('\n')[0]);
    failed++;
  }
}

writeFileSync(resolve(OUT, '.gitignore'), '*\n');
if (failed) {
  console.error(`\n${failed} of ${targets.length} canvas file(s) not exported.`);
  process.exit(1);
}
console.log(`\n${targets.length} canvases exported to exports/`);
