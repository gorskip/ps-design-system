# Zmiany: plugin Przeskalowani (wersja na stronę)

Polska wersja `plugin/CHANGELOG.md`, pokazywana na stronie w zakładce **Zmiany**. Te
same zmiany, w tej samej kolejności i z tymi samymi datami co wersja angielska;
`node bin/changelog.mjs` sprawdza to i przerywa, jeśli się różnią.

## 12.11.2026 · Usuwanie tła ze zdjęć

- Nowy skill `ps-cutout`: usuwa tło ze zdjęcia i zapisuje przezroczysty PNG osoby lub przedmiotu.
- Uruchamia się sam, gdy projekt potrzebuje wycięcia, np. w szablonach `postac`.
- Działa w czacie Claude i w Claude Code (rembg, model BiRefNet-portrait). Na Macu bez internetu korzysta z Apple Vision.

## 12.11.2026 · Aktualizacja design systemu z zakładki Code

- `ps-update` aktualizuje też design system, a nie tylko plugin.

## 12.11.2026 · Sprawdzanie wersji pluginu

- `ps-update` sprawdza zainstalowaną wersję pluginu i potwierdza ją po aktualizacji.

## 12.11.2026 · Skill ps-update i ikona

- Nowy skill `ps-update`: aktualizacja pluginu i design systemu do najnowszej wersji.
- Plugin ma własną ikonę.
- Przewodnik na stronie podzielony na dwie części: design system i plugin.

## 12.11.2026 · Pierwsza wersja pluginu

- Skille spakowane jako plugin Claude: `ps-design-system`, `ps-social-post`, `ps-slides`, `ps-docs`, `ps-forms` i `ps-www`.
- Instrukcja instalacji na stronie.
