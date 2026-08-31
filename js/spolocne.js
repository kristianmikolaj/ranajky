// ---------------------------------------------------------------
// Drobnosti, ktoré potrebuje viac súborov naraz, a spoločný stav.
// Načítava sa hneď po data.js, pred ostatnými.
// ---------------------------------------------------------------

// Ošetrí text, než ho vložíme do HTML — aby úvodzovky a lomené zátvorky
// v názve receptu nerozbili stránku.
function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

const pad = n => String(n).padStart(2, '0');
const ymd = (y, m, d) => `${y}-${pad(m+1)}-${pad(d)}`;

// Zápisy v denníku sa ukladajú pod názvom súboru s fotkou (napr. "caprese"),
// nie pod poradovým číslom. Vďaka tomu prežijú pridanie či preskupenie receptov.
const bySlug = {};
FOTO.forEach((s, i) => { bySlug[s] = i; });
const recipeOf = key => (typeof key === 'number' ? RECIPES[key] : RECIPES[bySlug[key]]);
const slugOf   = key => (typeof key === 'number' ? FOTO[key] : key);

// Spoločný stav medzi prihlásením (auth.js) a denníkom (dennik.js).
const APP = {
  user: null,        // prihlásený používateľ, alebo null
  fb: null,          // načítané Firebase moduly
  cloudFailed: false,// SDK sa nepodarilo stiahnuť — denník beží aspoň lokálne
  dennik: null,      // vyplní dennik.js

  // Bez prihlásenia sa nezapisuje. Výnimka: keď sa prihlasovanie vôbec
  // nenačítalo, je lepšie nechať denník fungovať lokálne než ho zamknúť úplne.
  canEdit(){ return !CLOUD_READY || APP.cloudFailed || !!APP.user; }
};
