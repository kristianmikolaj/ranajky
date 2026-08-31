# Nastavenie prihlasovania — krok za krokom

Stránka je hotová a funguje aj bez toho: denník zatiaľ beží lokálne v prehliadači. Keď prejdeš týchto osem krokov, zapne sa registrácia, prihlasovanie a zápisy sa budú ukladať na účet, takže ich používateľ nájde na mobile aj na počítači.

Počítaj s dvadsiatimi minútami. Všetko je zadarmo, platobnú kartu Firebase pri základnom pláne nepýta.

---

## 1. Vytvor projekt

Choď na **console.firebase.google.com** a prihlás sa Google účtom.

- **Create a project** (alebo *Add project*)
- Názov: `ranajky` (alebo čokoľvek)
- Google Analytics: **vypni**, na toto ho netreba
- **Create project**, počkaj asi minútu

## 2. Zapni prihlasovanie e-mailom

V ľavom menu pod **Product categories** klikni na **Security → Authentication → Get started**.

> Ak by si to tam nenašiel, konzola sa občas prekopáva. Vždy funguje **Search for products** úplne hore v ľavom menu — napíš `Authentication` a klikni na výsledok.

- Karta **Sign-in method**
- Klikni na **Email/Password**
- Prvý prepínač **Enable** zapni
- Druhý (*Email link / passwordless*) nechaj vypnutý
- **Save**

## 3. Vytvor databázu

**Databases and storage → Firestore Database → Create database**. (Alebo cez *Search for products*: `Firestore`.)

- Režim: **Start in production mode** (dôležité — *test mode* nechá dáta otvorené pre kohokoľvek)
- Lokalita: **eur3 (europe-west)** alebo **europe-west3 (Frankfurt)** — bližšie k Slovensku, rýchlejšie
- **Create**

## 4. Nastav pravidlá prístupu — tento krok nepreskoč

Toto je jediná vec, ktorá bráni cudzím ľuďom čítať denníky ostatných. Bez nej je databáza otvorená.

V databáze prepni na kartu **Rules**, zmaž, čo tam je, a vlož presne toto:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Klikni **Publish**.

Po slovensky to znamená: k dokumentu `users/xyz` sa dostane iba prihlásený používateľ, ktorého vlastné ID je `xyz`. Nikto iný — ani čítať, ani písať.

## 5. Zaregistruj webovú aplikáciu

> Ak ti na úvodnej stránke projektu už svieti **1 app**, máš to hotové — preskoč rovno na hľadanie `firebaseConfig` nižšie.

V ľavom menu klikni na **Settings → Project settings**.

- Zroluj dole na **Your apps**
- Ak tam ešte nič nie je, klikni na ikonu **`</>`** (Web)
- Prezývka: `ranajky-web`
- **Firebase Hosting nezaškrtávaj** — stránku máš na GitHub Pages
- **Register app**

Pri hotovej aplikácii nájdeš údaje v tej istej sekcii **Your apps** pod prepínačom **Config**. Vyzerá to takto:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ranajky-1234.firebaseapp.com",
  projectId: "ranajky-1234",
  storageBucket: "ranajky-1234.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Nechaj si to otvorené.

## 6. Vlož údaje do stránky

Otvor `index.html` vo VS Code a nájdi (`⌘F`) text **`SEM-VLOZ`**. Je hneď nad denníkom, asi v dvoch tretinách súboru:

```js
const FIREBASE_CONFIG = {
  apiKey:            "SEM-VLOZ-apiKey",
  authDomain:        "SEM-VLOZ.firebaseapp.com",
  ...
};
```

Prepíš všetkých šesť hodnôt tými z Firebase. Úvodzovky nechaj, mení sa len text medzi nimi.

Keď v súbore neostane ani jedno `SEM-VLOZ`, prihlasovanie sa zapne samo.

## 7. Povoľ svoju doménu

Späť v **Security → Authentication**, karta **Settings → Authorized domains → Add domain**.

Pridaj: `kristianmikolaj.github.io`

Bez tohto by prihlásenie na tvojej stránke skončilo chybou, aj keď lokálne funguje.

## 8. Nahraj a vyskúšaj

```bash
cd ~/ranajky-web
git add index.html
git commit -m "prihlasovanie cez firebase"
git push
```

Počkaj minútu a otvor `https://kristianmikolaj.github.io/ranajky/`. V sekcii Denník raňajok by mal byť formulár. Vyskúšaj:

1. Zaregistruj sa vlastným e-mailom
2. Zapíš si nejaký deň
3. Otvor stránku v mobile, prihlás sa tým istým e-mailom — deň tam musí byť

Vo Firebase konzole potom v **Authentication → Users** uvidíš vytvorené účty a v **Firestore Database → Data** ich denníky.

---

## Čo je dobré vedieť

**Ten `apiKey` v súbore je verejný a je to tak správne.** Nie je to heslo — Google ho takto navrhol a nájdeš ho v zdrojáku každej Firebase stránky. Bezpečnosť nestojí na jeho utajení, ale na pravidlách zo 4. kroku. Preto ich nepreskakuj.

**Heslá nevidíš ani ty.** Firebase ich ukladá zahašované, v konzole uvidíš len e-maily. Ak niekto heslo zabudne, použije odkaz *Zabudnuté heslo* priamo na stránke.

**Registrácia je otvorená.** Ktokoľvek s adresou stránky si vytvorí účet. Ak by ti tam začali pribúdať cudzie alebo robotické účty, napíš — dá sa doplniť pozvánkový kód alebo povinné overenie e-mailu.

**Bezplatný plán stačí s veľkou rezervou.** Limit je 50 000 čítaní denne; jeden používateľ pri jednom otvorení stránky spraví jedno čítanie a pri zápise jeden zápis.

**Ak si niečo pokazíš,** nič sa nedeje — vráť do `FIREBASE_CONFIG` pôvodné `SEM-VLOZ` hodnoty a stránka sa vráti do lokálneho režimu, akoby sa nič nestalo.
