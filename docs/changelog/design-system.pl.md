# Zmiany: design system Przeskalowani (wersja na stronę)

Polska wersja `CHANGELOG.md`, pokazywana na stronie w zakładce **Zmiany**. Te same
zmiany, w tej samej kolejności i z tymi samymi datami co wersja angielska;
`node bin/changelog.mjs` sprawdza to i przerywa, jeśli się różnią.

## 12.11.2026 · Zakładka Zmiany i wycinanie postaci

- Na stronie nowa zakładka **Zmiany** z historią design systemu i pluginu.
- `bin/clean-cutout.mjs` wycina postać tym samym skryptem Apple Vision co skill `ps-cutout`.

## 12.11.2026 · Design system w ustawieniach Claude

- Design system podłącza się w Settings > Capabilities > Design systems, z synchronizacją z GitHuba.
- Przewodnik na stronie podzielony na dwie części: design system i plugin.

## 09.11.2026 · Instrukcja aktualizacji

- Na stronie sekcja o aktualizacji design systemu, ze zrzutami ekranu.

## 09.11.2026 · Szablony z wyciętą postacią

- Nowe szablony `postac` na Instagram i LinkedIn: wycięta osoba na tle marki.
- Wycięcia założycielek w `assets/photo/cutout-*.png` i skrypt `bin/clean-cutout.mjs`.

## 09.11.2026 · Numer wersji

- Wersja w formacie vX.X.X w pliku `VERSION`, w README i na stronie.
- Każdy commit podnosi ją o 1.

## 09.11.2026 · Prompty dla Claude Design

- Przykładowe prompty na stronie wskazują design system Przeskalowani.

## 09.11.2026 · Dokumenty A4

- Szablony stron A4: powitanie, ogólny, cennik, harmonogram, ćwiczenia, podziękowanie.
- Zakładka **Docs** na stronie.
- Kopie projektów zachowują układ szablonu. Nowy układ powstaje tylko na prośbę i tylko w kopii.

## 09.11.2026 · Publikacja strony

- Strona systemu publikowana na Netlify, adres główny prowadzi do `docs/`.

## 08.11.2026 · Poprawki slajdów

- Tytuły na slajdach pełnej szerokości w pasie znaku, treść wyśrodkowana pod tytułem.
- Szerszy odstęp tytułu, przeniesiony do wspólnego CSS.

## 07.11.2026 · Pierwsza wersja design systemu

- Tokeny, komponenty i układy WWW, szablony social, slajdy, nagłówki formularzy, logo i zdjęcia.
- Strona `docs/index.html` jako pełna specyfikacja.
- Podziękowania na zielonym gradiencie, prezentacje na całą szerokość.
