#!/usr/bin/env node
/* ==========================================================================
   Put both changelogs on the spec page, in the Zmiany tab.
   Run: node bin/changelog.mjs   (the pre-commit hook runs it too)

   The changelogs are in English: CHANGELOG.md (design system) and
   plugin/CHANGELOG.md (plugin). The page is in Polish, so it shows the Polish
   copies in docs/changelog/*.pl.md. Both must list the same changes with the
   same dates in the same order, or this script stops. Each entry is
   "## DD.MM.YYYY · Name" followed by "- " bullets. Anchors come from the
   English names, so they don't change when the Polish wording does. Writes the
   rail links and the panel between the changelog:* markers in docs/index.html.
   The page is static so it also works opened from disk, without fetch().
   ========================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = resolve(ROOT, 'docs/index.html');
const LOGS = [
  { key: 'ds', title: 'Design system', file: 'CHANGELOG.md', pl: 'docs/changelog/design-system.pl.md',
    lead: 'Tokeny, CSS, szablony, zdjęcia i ta strona.' },
  { key: 'pl', title: 'Plugin', file: 'plugin/CHANGELOG.md', pl: 'docs/changelog/plugin.pl.md',
    lead: 'Skille, z których Claude wie, jak pracować. Aktualizujesz je skillem <code>ps-update</code>.' },
];

const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = t => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const slug = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function parse(file) {
  const md = readFileSync(resolve(ROOT, file), 'utf8');
  const seen = new Set();
  return md.split(/\n## /).slice(1).map(block => {
    const [head, ...rest] = block.trim().split('\n');
    const m = head.match(/^(\d{2})\.(\d{2})\.(\d{4})\s*·\s*(.+)$/);
    if (!m) throw new Error(`${file}: "## ${head}" must be "## DD.MM.YYYY · Name"`);
    const [, d, mo, y, name] = m;
    const items = rest.filter(l => l.startsWith('- ')).map(l => l.slice(2));
    if (!items.length) throw new Error(`${file}: "${head}" has no "- " bullets`);
    return { date: `${d}.${mo}.${y}`, iso: `${y}-${mo}-${d}`, name, items };
  }).map(e => {
    let id = `${e.iso}-${slug(e.name)}`, n = 2;
    while (seen.has(id)) id = `${e.iso}-${slug(e.name)}-${n++}`;
    seen.add(id);
    return { ...e, id };
  });
}

const logs = LOGS.map(l => {
  const en = parse(l.file), pl = parse(l.pl);
  const dates = es => es.map(e => e.date).join(' ');
  if (dates(en) !== dates(pl)) {
    console.error(`changelog: ${l.file} and ${l.pl} list different changes.\n  en: ${dates(en)}\n  pl: ${dates(pl)}`);
    process.exit(1);
  }
  return { ...l, entries: pl.map((e, i) => ({ ...e, id: en[i].id })) };
});

const rail = logs.map(l => [
  `        <a href="#zm-${l.key}" class="doc-rail__parent">${l.title}<span class="doc-rail__count">${l.entries.length}</span></a>`,
  `        <div class="doc-rail__sub">`,
  ...l.entries.map(e => `          <a href="#zm-${l.key}-${e.id}">${e.date} · ${esc(e.name)}</a>`),
  `        </div>`,
].join('\n')).join('\n');

const panel = [
  `  <section class="doc-sec" id="zmiany">`,
  `    <p class="ps-eyebrow">Zmiany</p>`,
  `    <h1 class="ps-display doc-view-title">Co nowego.</h1>`,
  `    <p class="ps-lead">Osobno design system i plugin. Każda zmiana ma nazwę z datą, najnowsza na górze.</p>`,
  `  </section>`,
  ...logs.map(l => [
    `  <section class="doc-sec" id="zm-${l.key}">`,
    `    <h2>${l.title}</h2>`,
    `    <p class="ps-small ps-muted" style="margin:var(--ps-space-2) 0 0;max-width:62ch">${l.lead}</p>`,
    `    <div class="doc-blocks">`,
    ...l.entries.map(e => [
      `    <div class="doc-block" id="zm-${l.key}-${e.id}">`,
      `      <h3 class="doc-block__title"><time datetime="${e.iso}">${e.date}</time> · ${esc(e.name)}</h3>`,
      `    <ul style="display:grid;gap:var(--ps-space-3);max-width:62ch;margin:var(--ps-space-4) 0 0;padding-inline-start:1.25em;list-style:disc">`,
      ...e.items.map(i => `      <li>${inline(i)}</li>`),
      `    </ul>`,
      `    </div>`,
    ].join('\n')),
    `    </div>`,
    `  </section>`,
  ].join('\n')),
].join('\n');

function between(html, name, body) {
  const re = new RegExp(`(<!-- changelog:${name}:start -->\\n)[\\s\\S]*?(<!-- changelog:${name}:end -->)`);
  if (!re.test(html)) throw new Error(`docs/index.html: changelog:${name} markers missing`);
  return html.replace(re, `$1${body}\n$2`);
}

const before = readFileSync(PAGE, 'utf8');
const after = between(between(before, 'rail', rail), 'panel', panel);
if (after !== before) writeFileSync(PAGE, after);
console.log(`changelog: ${logs.map(l => `${l.title} ${l.entries.length}`).join(', ')}${after === before ? ' (no change)' : ' → docs/index.html'}`);
