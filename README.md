# FlexiStitek

Aktualni verze: `1.0.0`

Posledni release notes jsou v souboru `CHANGELOG.md`.

FlexiStitek je jednoducha staticka webova aplikace pro pripravu a tisk textovych stitku na format A4. Bezi primo v prohlizeci, nevyzaduje backend ani build krok a je vhodna pro rychle vytvareni a upravu stitku pred tiskem.

## Co aplikace umi

- pridavat nove stitky do tiskove plochy
- odebirat posledni stitek
- upravovat obsah stitku primo kliknutim do bunky
- menit font pro vsechny stitky najednou
- menit velikost pisma
- menit horizontalni vnitrni okraje stitku
- ukladat aktualni stav do JSON souboru pro pozdejsi pokracovani nebo duplikaci
- nacist drive ulozeny JSON stav zpet do aplikace
- resetovat aplikaci do presneho vychoziho stavu
- pohodlne fungovat i na mobilu diky responzivnimu ovladacimu panelu a horizontalnimu nahledu A4
- tisknout pripravenou stranku A4 s automaticky skrytym ovladacim panelem

## Jak projekt spustit

Projekt je ciste staticky, takze jsou dve jednoduche moznosti:

### 1. Priame otevreni v prohlizeci

Otevrete soubor `index.html` v libovolnem modernim prohlizeci.

### 2. Spusteni pres jednoduchy lokalni server

Pokud chcete mit konzistentnejsi lokalni prostredi, muzete v koreni projektu spustit napriklad:

```bash
python3 -m http.server 8000
```

Potom otevrete adresu `http://localhost:8000`.

## Ovladani aplikace

Po otevreni aplikace se zobrazi nahled stranky A4 a panel s ovladacimi prvky.

### Tlacitka a prvky panelu

- `+ Pridat`: vytvori novou editovatelnou bunku se zakladnim textem
- `- Odebrat`: odstrani posledni bunku v mrizce
- `Font`: zmeni typ pisma pro vsechny bunky
- `Velikost - / +`: snizi nebo zvysi velikost textu v bodech
- `Okraje - / +`: snizi nebo zvysi horizontalni vnitrni odsazeni bunky v milimetrech
- `Ulozit`: exportuje aktualni podobu stitku a nastaveni do noveho JSON souboru
- `Nacist`: importuje drive ulozeny JSON soubor a obnovi jeho obsah i nastaveni
- `Reset`: vrati aplikaci do puvodniho stavu vcetne ukazkovych stitku a vychozich hodnot
- `Tisk`: vyvola nativni dialog pro tisk v prohlizeci

### Editace stitku

- Text stitku lze menit primo v bunce pomoci `contenteditable`.
- Pokud bunka zustane po editaci prazdna, skript do ni vlozi nezalomitelnou mezeru, aby se nerozbilo jeji zobrazeni.
- Pri upravach aplikace zobrazuje stavovou zpravu, jestli jsou zmeny ulozene nebo rozpracovane.

### Ukladani a nacteni stavu

- Exportovany JSON obsahuje seznam stitku, zvoleny font, velikost pisma a horizontalni okraje.
- Exportovany JSON nese i `appVersion` a `schemaVersion`, aby bylo jednodussi udrzet kompatibilitu mezi verzemi.
- Import ocekava stejny format a pri neplatnem obsahu zobrazi chybu bez zmeny aktualniho rozpracovaneho stavu.
- Reset vzdy vraci stejne vychozi hodnoty definovane v aplikaci.

## Tiskove chovani

Aplikace je pripravena pro tisk na vysku ve formatu A4.

- tisk vyuziva pravidlo `@page` s velikosti `A4 portrait`
- tiskove okraje jsou nastavene na `10 mm`
- ovladaci panel se pri tisku skryje
- tiskova plocha odpovida vnitrni oblasti stranky po odecteni okraju

Aktualni rozlozeni pouziva flexibilni zalamovani bunek v ramci plochy A4. Jednotlive bunky maji pevne nastavenou vysku `17 mm` a sirka se odviji od obsahu textu, nastaveneho fontu a vnitrnich okraju.

Na mensich displejich zustava zachovana vernost A4 nahledu. Misto agresivniho zmensovani se pouzije horizontalni posun, aby byl vystup dobre citelny i pri upravach na telefonu.

## Struktura projektu

```text
.
|-- CHANGELOG.md
|-- index.html
|-- css/
|   `-- style.css
`-- js/
	|-- version.js
	`-- app.js
```

### Popis souboru

- `index.html`: hlavni stranka aplikace, ovladaci panel a pocatecni sada stitku
- `css/style.css`: vzhled aplikace, rozlozeni A4, styly bunek a pravidla pro tisk
- `js/version.js`: centralni konfigurace verze aplikace a verze exportniho schema
- `js/app.js`: pridavani a odebirani bunek, poslouchace udalosti, export/import stavu a upravy globalnich CSS promennych
- `CHANGELOG.md`: historie vydani a release notes

## Technicke reseni

Projekt je postaveny pouze na zakladnich webovych technologiich:

- HTML pro strukturu aplikace
- CSS pro rozlozeni, vzhled a tiskove styly
- JavaScript pro interaktivitu a zmenu nastaveni za behu

JavaScript pracuje s CSS promennymi definovanymi v `:root`:

- `--cell-font`
- `--cell-font-size`
- `--cell-padding`

Diky tomu se globalni vizualni nastaveni meni okamzite bez nutnosti prepisovat styly jednotlivych bunek.

## Omezeni aktualni verze

- aplikace neobsahuje export do PDF, vyuziva standardni tisk prohlizece
- odebirani funguje pouze na posledni bunku
- neexistuje samostatne nastaveni rozmeru bunek nebo poctu sloupcu
- vysledny tisk se muze mirne lisit podle konkretniho prohlizece a tiskarny

## Jak projekt upravovat

### Zmena vychozich hodnot

Vychozi nastaveni je definovano na dvou mistech:

- v `css/style.css` jsou ulozene vychozi CSS promenne
- v `js/app.js` je ulozen objekt `INITIAL_STATE` s vychozim obsahem, fontem, velikosti pisma a paddingem

Pri upravach je vhodne drzet tyto hodnoty konzistentni.

### Zmena cisla verze

Zdroj pravdy pro cislo verze je soubor `js/version.js`.

- `version`: verze aplikace zobrazovana v rozhrani a v titulku stranky
- `exportSchemaVersion`: verze formatu exportovaneho JSON souboru

### Pridani dalsich moznosti fontu

Nove fonty lze doplnit do elementu `<select id="font-select">` v `index.html`.

### Uprava tiskove plochy

Pokud potrebujete jiny format nebo jine okraje:

- upravte pravidlo `@page` v `css/style.css`
- upravte rozmery `.page-a4`, aby odpovidaly vnitrni tiskove oblasti

## Doporucene dalsi rozsireni

- ukladani rozpracovanych stitku do `localStorage`
- moznost smazat nebo preskupit libovolnou bunku
- podpora vice stran
- import dat z CSV
- sablony pro ruzne typy stitku

## Licence

Projekt je dostupny pod licenci MIT. Plne zneni je v souboru `LICENSE`.
