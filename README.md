# FlexiŠtítek

Aktuální verze: `1.4.0`

Poslední release notes jsou v souboru `CHANGELOG.md`.

Veřejná aplikace: [https://karelveselsky.github.io/flexistitek/](https://karelveselsky.github.io/flexistitek/)

Projekt je publikovaný jako statický web přes GitHub Pages.

FlexiŠtítek je jednoduchá statická webová aplikace pro přípravu a tisk textových štítků na formát A4. Běží přímo v prohlížeči, nevyžaduje backend ani build krok a je vhodná pro rychlé vytváření a úpravu štítků před tiskem.

## Co aplikace umí

- přidávat nové štítky do tiskové plochy
- odebírat poslední štítek tlačítkem „Odebrat"
- mazat libovolný štítek tlačítkem ×, které se zobrazí po najetí myší na buňku
- upravovat obsah štítků přímo kliknutím do buňky
- měnit font pro všechny štítky najednou
- měnit velikost písma
- měnit horizontální vnitřní okraje štítků
- měnit výšku všech štítků najednou
- ukládat aktuální stav do JSON souboru pro pozdější pokračování nebo duplikaci (klávesová zkratka `Ctrl+S`)
- načíst dříve uložený JSON stav zpět do aplikace
- resetovat aplikaci do přesného výchozího stavu
- pohodlně fungovat i na mobilu díky responzivnímu ovládacímu panelu a horizontálnímu náhledu A4
- tisknout připravené štítky s automaticky skrytým ovládacím panelem; formát papíru a orientaci lze nastavit přímo v tiskovém dialogu

## Jak projekt spustit

Projekt je čistě statický, takže jsou dvě jednoduché možnosti.

> **Poznámka:** Aplikace vyžaduje JavaScript. Bez JavaScriptu se zobrazí pouze statický náhled s informací o nutnosti JavaScriptu.

### 1. Přímé otevření v prohlížeči

Otevřete soubor `index.html` v libovolném moderním prohlížeči.

### 2. Spuštění přes jednoduchý lokální server

Pokud chcete mít konzistentnější lokální prostředí, můžete v kořeni projektu spustit například:

```bash
python3 -m http.server 8000
```

Potom otevřete adresu `http://localhost:8000`.

## Ovládání aplikace

Po otevření aplikace se zobrazí náhled stránky A4 a panel s ovládacími prvky.

### Tlačítka a prvky panelu

- `+ Přidat`: vytvoří novou editovatelnou buňku se základním textem
- `- Odebrat`: odstraní poslední buňku v mřížce
- `Font`: změní typ písma pro všechny buňky
- `Velikost - / +`: sníží nebo zvýší velikost textu v bodech
- `Okraje - / +`: sníží nebo zvýší horizontální vnitřní odsazení buňky v milimetrech
- `Uložit`: exportuje aktuální podobu štítků a nastavení do nového JSON souboru
- `Načíst`: importuje dříve uložený JSON soubor a obnoví jeho obsah i nastavení
- `Reset`: vrátí aplikaci do původního stavu včetně ukázkových štítků a výchozích hodnot
- `Výška - / +`: sníží nebo zvýší výšku všech buněk v milimetrech
- `Tisk`: zkontroluje, jestli se obsah vejde na jednu stranu, případně zobrazí varování, a pak vyvolá nativní dialog pro tisk v prohlížeči
- `Verze` + odkaz `Dokumentace`: zobrazuje aktuální verzi aplikace; kliknutím na odkaz se v novém tabu otevře stránka projektu na GitHubu

### Editace štítků

- Text štítku lze měnit přímo v buňce pomocí `contenteditable`.
- Každá buňka zobrazuje tlačítko × po najetí myší nebo při aktivní editaci — kliknutím lze buňku smazat.
- Klávesová zkratka `Ctrl+S` uloží aktuální stav do souboru.
- Pokud buňka zůstane po editaci prázdná, skript do ní vloží nezalomitelnou mezeru, aby se nerozbilo její zobrazení.
- Při úpravách aplikace zobrazuje stavovou zprávu, jestli jsou změny uložené nebo rozpracované.

### Ukládání a načtení stavu

- Exportovaný JSON obsahuje seznam štítků, zvolený font, velikost písma, horizontální okraje a výšku buněk.
- Exportovaný JSON nese i `appVersion` a `schemaVersion`, aby bylo jednodušší udržet kompatibilitu mezi verzemi.
- Import očekává stejný formát a při neplatném obsahu zobrazí chybu bez změny aktuálního rozpracovaného stavu.
- Import je omezen na maximálně 200 štítků; text každého štítku je zkrácen na 500 znaků.
- Reset vždy vrací stejné výchozí hodnoty definované v aplikaci.

## Tiskové chování

- formát papíru a orientaci určuje systémový tiskový dialog (výchozí okraje jsou `10 mm`)
- ovládací panel se při tisku automaticky skryje
- každá buňka se tiskne celá, bez rozdělení přes stránky
- pokud obsah přesahuje jednu stranu, aplikace zobrazí informaci o odhadovaném počtu stran v panelu

Aktuální rozložení používá flexibilní zalamování buněk. Výchozí výška buňky je `17 mm` a lze ji globálně měnit tlačítky `Výška - / +` (rozsah 5–100 mm). Šířka se odvíjí od obsahu textu, nastaveného fontu a vnitřních okrajů.

Na menších displejích zůstává zachována věrnost A4 náhledu. Místo agresivního zmenšování se použije horizontální posun, aby byl výstup dobře čitelný i při úpravách na telefonu.

## Struktura projektu

```text
.
|-- CHANGELOG.md
|-- index.html
|-- assets/
|   `-- favicon.svg
|-- css/
|   `-- style.css
`-- js/
    |-- version.js
    `-- app.js
```

### Popis souborů

- `index.html`: hlavní stránka aplikace, ovládací panel a počáteční sada štítků
- `assets/favicon.svg`: ikona aplikace zobrazovaná v záložce prohlížeče
- `css/style.css`: vzhled aplikace, rozložení A4, styly buněk a pravidla pro tisk
- `js/version.js`: centrální konfigurace verze aplikace a verze exportního schématu
- `js/app.js`: přidávání a odebírání buněk, posluchače událostí, export/import stavu a úpravy globálních CSS proměnných
- `CHANGELOG.md`: historie vydání a release notes

## Technické řešení

Projekt je postavený pouze na základních webových technologiích:

- HTML pro strukturu aplikace
- CSS pro rozložení, vzhled a tiskové styly
- JavaScript pro interaktivitu a změnu nastavení za běhu

JavaScript pracuje s CSS proměnnými definovanými v `:root`:

- `--cell-font`
- `--cell-font-size`
- `--cell-padding`
- `--cell-height`

Díky tomu se globální vizuální nastavení mění okamžitě bez nutnosti přepisovat styly jednotlivých buněk.

## Omezení aktuální verze

- aplikace neobsahuje export do PDF, využívá standardní tisk prohlížeče
- tlačítko „Odebrat" funguje pouze na poslední buňku; libovolnou buňku lze smazat tlačítkem ×
- neexistuje nastavení počtu sloupců ani jiného rozměrového layoutu
- při přetížení obsahu nad jednu A4 aplikace varuje, ale stále je na uživateli, aby tiskový obsah upravil na požadovanou podobu
- výsledný tisk se může mírně lišit podle konkrétního prohlížeče a tiskárny

## Jak projekt upravovat

### Změna výchozích hodnot

Výchozí nastavení je definováno na dvou místech:

- v `css/style.css` jsou uložené výchozí CSS proměnné
- v `js/app.js` je uložen objekt `INITIAL_STATE` s výchozím obsahem, fontem, velikostí písma, paddingem a výškou buněk

Při úpravách je vhodné držet tyto hodnoty konzistentní.

### Změna čísla verze

Zdroj pravdy pro číslo verze je soubor `js/version.js`.

- `version`: verze aplikace zobrazovaná v rozhraní a v titulku stránky
- `exportSchemaVersion`: verze formátu exportovaného JSON souboru

### Přidání dalších možností fontu

Nové fonty lze doplnit do elementu `<select id="font-select">` v `index.html`.

### Úprava tiskové plochy

Pokud potřebujete jiný formát nebo jiné okraje:

- upravte pravidlo `@page` v `css/style.css`
- upravte rozměry `.page-a4`, aby odpovídaly vnitřní tiskové oblasti

## Doporučené další rozšíření

- ukládání rozpracovaných štítků do `localStorage`
- možnost přeskupit libovolnou buňku přetažením
- podpora více stran
- import dat z CSV
- šablony pro různé typy štítků

## Licence

Projekt je dostupný pod licencí MIT. Plné znění je v souboru `LICENSE`.

