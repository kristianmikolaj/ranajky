// ---------------------------------------------------------------
// Pripojenie na Firebase — jediný súbor, ktorý treba upraviť
// pri presune na iný projekt.
// Firebase konzola → Settings → Project settings → Your apps → Config
// ---------------------------------------------------------------

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCM-HFweeI7kmMFNgzY12eIYY6chtwiMGg",
  authDomain:        "jedalnicek-kiko.firebaseapp.com",
  projectId:         "jedalnicek-kiko",
  storageBucket:     "jedalnicek-kiko.firebasestorage.app",
  messagingSenderId: "36426031184",
  appId:             "1:36426031184:web:549980c59716b4ffcdf155"
};

// Kým sú vyššie zástupné hodnoty so "SEM-VLOZ", denník beží len lokálne
// v prehliadači a prihlasovanie sa vôbec nezapne.
const CLOUD_READY = !JSON.stringify(FIREBASE_CONFIG).includes("SEM-VLOZ");

// Odkiaľ sa sťahuje Firebase. Číslo verzie meň len vedome.
const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
