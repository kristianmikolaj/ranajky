// ---------------------------------------------------------------
// Denník raňajok — mesačný kalendár, priemery, výber jedla na deň.
// Ukladá do prehliadača; ak je niekto prihlásený, auth.js to pošle
// aj na jeho účet.
// ---------------------------------------------------------------

const LSKEY     = 'ranajky-dennik-v2';
const LSKEY_OLD = 'ranajky-dennik-v1';   // staršia verzia ukladala poradové čísla

const calEl     = document.getElementById('cal');
const statsEl   = document.getElementById('stats');
const pickerEl  = document.getElementById('picker');
const calTitle  = document.getElementById('calTitle');
const storeNote = document.getElementById('storeNote');

let storageOk = true;
let log = {};                 // { "2026-08-31": "omeleta-slanina" }
const cur = new Date(); cur.setDate(1);
let selDay = null;

function loadLocal(){
  try {
    const raw = localStorage.getItem(LSKEY) || localStorage.getItem(LSKEY_OLD);
    const parsed = raw ? JSON.parse(raw) : {};
    const out = {};
    Object.keys(parsed).forEach(k => { const s = slugOf(parsed[k]); if (s) out[k] = s; });
    return out;
  } catch(e){ storageOk = false; return {}; }
}

function saveLocal(){
  try { localStorage.setItem(LSKEY, JSON.stringify(log)); }
  catch(e){ storageOk = false; }
}

log = loadLocal();

function setStoreNote(){
  if (!storageOk){
    storeNote.textContent = "Tento prehliadač neumožňuje ukladanie údajov stránok (napríklad anonymné okno), takže zápisy sa po zatvorení karty stratia.";
  } else if (APP.user){
    storeNote.textContent = "Zápisy sú uložené na tvojom účte, takže ich nájdeš na každom zariadení, kde sa prihlásiš. Kópia zostáva aj v tomto prehliadači, aby sa denník zobrazil hneď.";
  } else if (CLOUD_READY && !APP.cloudFailed){
    storeNote.textContent = "Bez prihlásenia sa dá denník len prezerať. Po prihlásení sa doterajšie zápisy z tohto prehliadača prenesú na tvoj účet a odvtedy ich uvidíš na všetkých zariadeniach.";
  } else {
    storeNote.textContent = "Zápisy sú uložené len v tomto prehliadači a v tomto zariadení — nikam sa neposielajú a nikto iný ich nevidí.";
  }
}

function renderStats(y, m){
  const pre  = `${y}-${pad(m+1)}-`;
  const keys = Object.keys(log).filter(k => k.startsWith(pre) && recipeOf(log[k]));
  const n    = keys.length;
  const avg  = f => Math.round(keys.reduce((s,k) => s + f(recipeOf(log[k])), 0) / n);

  let top = '—';
  if (n){
    const c = {};
    keys.forEach(k => { c[log[k]] = (c[log[k]] || 0) + 1; });
    const best = Object.keys(c).sort((a,b) => c[b] - c[a])[0];
    top = `${esc(recipeOf(best).name)} <small>${c[best]}×</small>`;
  }

  statsEl.innerHTML = `
    <div class="stat"><div class="k">Zapísaných dní</div><div class="v">${n}</div></div>
    <div class="stat"><div class="k">Priemer kalórií</div><div class="v">${n ? `${avg(r=>r.kcal)} <small>kcal</small>` : '<span class="none">—</span>'}</div></div>
    <div class="stat"><div class="k">Priemer bielkovín</div><div class="v">${n ? `${avg(r=>r.p)} <small>g</small>` : '<span class="none">—</span>'}</div></div>
    <div class="stat"><div class="k">Najčastejšie</div><div class="v small">${n ? top : '<span class="none">—</span>'}</div></div>`;
}

function renderCal(){
  const y = cur.getFullYear(), m = cur.getMonth();
  calTitle.textContent = `${MESIACE[m]} ${y}`;

  const first = (new Date(y, m, 1).getDay() + 6) % 7;   // pondelok = 0
  const days  = new Date(y, m+1, 0).getDate();
  const t = new Date();
  const todayKey = ymd(t.getFullYear(), t.getMonth(), t.getDate());

  const kids = [];
  DNI.forEach((d, i) => {
    const e = document.createElement('div');
    e.className = 'dow' + (i > 4 ? ' weekend' : '');
    e.textContent = d;
    kids.push(e);
  });
  for (let i = 0; i < first; i++){
    const e = document.createElement('div');
    e.className = 'day blank';
    kids.push(e);
  }
  for (let d = 1; d <= days; d++){
    const key = ymd(y, m, d);
    const r = recipeOf(log[key]);
    const weekend = ((first + d - 1) % 7) > 4;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'day'
      + (key === todayKey ? ' today' : '')
      + (key === selDay ? ' sel' : '')
      + (weekend ? ' weekend' : '');
    b.disabled = !APP.canEdit();
    b.setAttribute('aria-label', `${d}. ${MESIACE[m].toLowerCase()}${r ? ' — ' + r.name : ''}`);
    b.innerHTML = `<span class="d">${d}</span>` + (r ? `<span class="meal">${esc(r.name)}</span>` : '');
    b.addEventListener('click', () => { selDay = key; renderCal(); renderPicker(); });
    kids.push(b);
  }

  calEl.replaceChildren(...kids);
  renderStats(y, m);
}

function renderPicker(){
  if (!selDay || !APP.canEdit()){ pickerEl.hidden = true; return; }
  pickerEl.hidden = false;

  const [Y, M, D] = selDay.split('-');
  const chosen = log[selDay];

  pickerEl.innerHTML =
    `<h3>${Number(D)}. ${MESIACE[Number(M)-1].toLowerCase()} ${Y}</h3>
     <div class="picklist">
       ${RECIPES.map((r,i) => `<button type="button" class="pick${chosen===FOTO[i]?' on':''}" data-slug="${FOTO[i]}">${esc(r.name)}</button>`).join('')}
       ${chosen !== undefined ? `<button type="button" class="pick del" data-del="1">Vymazať zápis</button>` : ''}
     </div>`;

  pickerEl.querySelectorAll('.pick').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.del) delete log[selDay];
    else log[selDay] = b.dataset.slug;
    saveLocal();
    if (APP.dennik.push) APP.dennik.push();
    renderCal();
    renderPicker();
  }));
}

document.getElementById('prevM').addEventListener('click', () => {
  cur.setMonth(cur.getMonth() - 1); selDay = null; renderCal(); renderPicker();
});
document.getElementById('nextM').addEventListener('click', () => {
  cur.setMonth(cur.getMonth() + 1); selDay = null; renderCal(); renderPicker();
});

// Rozhranie pre auth.js — ten do neho doplní push() a volá redraw() pri
// zmene prihlásenia.
APP.dennik = {
  getLog:  () => log,
  setLog:  v => { log = v; saveLocal(); },
  saveLocal,
  setStoreNote,
  push: null,
  redraw(){ setStoreNote(); renderCal(); renderPicker(); }
};

setStoreNote();
renderCal();
