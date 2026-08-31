# Ako je stránka poskladaná

```
index.html            samotná stránka — len text a kostra, žiadny kód
css/styl.css          všetok vzhľad
js/config.js          údaje z Firebase — jediné, čo meníš pri zmene projektu
js/data.js            recepty, makrá, suroviny, názvy fotiek
js/spolocne.js        drobné pomôcky a spoločný stav
js/recepty.js         karty, filtre, zoradenie
js/dennik.js          kalendár, priemery, výber jedla na deň
js/auth.js            registrácia, prihlásenie, ukladanie na účet
img/                  fotky jedál (nepovinné)
```

## Kde čo upraviť

**Pridať recept** → `js/data.js`. Pridaj objekt do `RECIPES` a k nemu záznam do
`FOTO`, `MINS` a `HAS` — všetky tri polia musia mať rovnaké poradie aj dĺžku,
inak sa karte pomiešajú fotky a filtre.

**Zmeniť farby** → `js/../css/styl.css`, úplne hore v `:root`. Sú tam tri bloky:
svetlý režim, tmavý podľa nastavenia systému a tmavý podľa voľby používateľa.
Meň všetky tri, inak bude jeden režim vyzerať inak než druhý.

**Zmeniť texty na stránke** → `index.html`.

**Prepnúť na iný Firebase projekt** → `js/config.js`, nič iné.

## Prečo sa súbory načítavajú v tomto poradí

Na konci `index.html` je šesť `<script>` značiek a poradie nie je náhodné:
`config` a `data` musia byť skôr než všetko ostatné, `spolocne` skôr než
`recepty` a `dennik`, a `dennik` skôr než `auth` — auth si doňho na konci
zavesí ukladanie na účet.

## Miestne otvorenie

Súbor otvorený dvojklikom (`file://`) funguje takmer celý, ale **prihlásenie
nie** — prehliadač v tomto režime nepustí sťahovanie Firebase. Ak to chceš
skúšať u seba, nainštaluj si vo VS Code rozšírenie **Live Server** a spusti
stránku cezeň (pravý klik na `index.html` → *Open with Live Server*).
Alebo to jednoducho pushni a testuj na ostrej adrese.

## Nahranie

```bash
cd ~/ranajky-web
git add .
git commit -m "popis zmeny"
git push
```

Tu je `git add .` v poriadku — v tomto priečinku je len stránka.
