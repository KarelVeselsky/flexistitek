# Changelog

Všechny významné změny v projektu budou evidované v tomto souboru.

## 1.4.0 – 2026-05-24

### Release Notes

- v oblasti verze aplikace přibyl odkaz „Dokumentace" vedoucí na stránku projektu na GitHubu; odkaz se otevírá v novém tabu
- přidáno plovoucí tlačítko `+ Přidat` za poslední štítek přímo v náhledu stránky pro pohodlné přidávání na mobilních zařízeních
- po přidání nového štítku se automaticky vybere jeho výchozí text a štítek se přesune do viditelné oblasti — na mobilech se okamžitě otevře klávesnice
- přidána podpora klávesy `Tab` uvnitř štítku: přeskočí na následující štítek a vybere celý jeho text pro okamžitý přepis; `Shift+Tab` přeskočí na předchozí štítek
- tlačítko `+ Přidat` v plovoucím panelu se nadále chová jako dříve, zachováno postupné přidávání více štítků najednou

## 1.3.0 – 2026-05-24

### Release Notes

- přidáno tlačítko `Výška - / +` pro globální změnu výšky všech buněk (rozsah 5–100 mm); výška je součástí exportovaného stavu
- tisk nyní respektuje formát papíru a orientaci ze systémového tiskového dialogu; pevné formulářování A4 v `@page` odebráno
- odebrán blokující potvrzovací dialog před tiskem; informace o odhadovaném počtu stran se zobrazuje přímo v panelu
- opraveny prázdné stránky v náhledu tisku (Safari a jiné prohlížeče): `min-height: 100vh` na `body` a `min-height: 277mm` na `.page-a4` přesunuty do `@media screen`, aby je tiskový stroj vymán prohlížeče vůbec nehodnotil
- opravena duplicitní sekce v dokumentaci README.md
- aktualizována dokumentace: opraven popis tiskového chování, přidána `--cell-height` do seznamu CSS proměnných, aktualizován popis exportovaného JSON

## 1.2.0 – 2026-05-24

### Release Notes

- opraven tiskový layout: přidán `margin: 0` na `body` a `.page-preview` při tisku; výška `.page-a4` opravena na správných 277 mm (297 mm výška A4 mínus 2 × 10 mm okraje); zvýšena tolerance na 4 px
- přidáno tlačítko × na každou buňku – zobrazí se po najetí myší nebo při aktivní editaci, umožňuje smazat libovolný štítek
- přidána klávesová zkratka `Ctrl+S` pro rychlé uložení
- přidána Content Security Policy (`default-src 'self'`) jako meta tag
- `normalizeState()` nyní omezuje import na max. 200 štítků a max. 500 znaků na štítek; fontSize je omezena na max. 72 pt, padding na max. 50 mm
- po odebrání posledního štítku se fokus přesune na nový poslední štítek
- přidány atributy `title` a `aria-label` ke všem tlačítkům v ovládacím panelu
- přidán `role="toolbar"` na ovládací panel
- přidán `<noscript>` blok s informací o nutnosti JavaScriptu
- přidán favicon (`assets/favicon.svg`) a meta tagy `description` a `theme-color`
- dokumentace (README.md, CHANGELOG.md) přepsána do češtiny s diakritikou

## 1.1.0 – 2026-05-24

### Release Notes

- upraven tiskový layout tak, aby se A4 výstup nepočítal na hranu a náhled běžně nekončil na dvou stránkách
- přidáno průběžné varování, když obsah přesahuje jednu stranu A4
- tlačítko Tisk nově před otevřením náhledu potvrzuje, když odhad tisku vychází na více stran
- projekt publikován na GitHub Pages

## 1.0.0 – 2026-05-23

### Release Notes

- přidána mobilně použitelná verze toolbaru s větší dotykovou plochou a horizontálním posunem A4 náhledu
- doplněn export a import aktuálního stavu do JSON souboru pro navázání na rozpracovanou práci
- přidán reset aplikace do přesného výchozího stavu
- zavedena MIT licence a zobrazování verze aplikace v rozhraní
