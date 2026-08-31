// ---------------------------------------------------------------
// Karty receptov: kompaktný náhľad, detail po rozkliknutí,
// hľadanie, filtrovanie podľa typu a surovín, zoradenie.
// ---------------------------------------------------------------

const grid        = document.getElementById('grid');
const filterBar   = document.getElementById('filters');
const ingBar      = document.getElementById('ingFilters');
const sortSel     = document.getElementById('sort');
const countEl     = document.getElementById('count');
const emptyEl     = document.getElementById('empty');
const searchEl    = document.getElementById('search');
const searchClear = document.getElementById('searchClear');

// odstráni diakritiku, aby "tunak" našlo "tuniak"
const bezDiakritiky = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '');

function card(r, i){
  const pk = r.p*4, fk = r.f*9, ck = r.c*4, tot = pk + fk + ck;
  const el = document.createElement('article');
  el.className = 'card';

  // Kým recept nemá fotku, obálku karty ladíme podľa toho, ktoré makro
  // v nej prevláda — bielkovinová raňajka je zelenkastá, tučná zlatá.
  const dom = pk >= fk && pk >= ck ? '--protein' : (fk >= ck ? '--fat' : '--carb');
  el.style.setProperty('--cover', `var(${dom})`);

  const id = `detail-${i}`;
  el.innerHTML = `
    <button class="shot" type="button" aria-expanded="false" aria-controls="${id}" aria-label="Zobraziť recept: ${esc(r.name)}">
      <span class="shot-ph"><span class="ph-num">${String(i+1).padStart(2,'0')}</span></span>
      <img src="img/${FOTO[i]}.jpg" alt="" loading="lazy">
      <span class="ph-badge">${String(i+1).padStart(2,'0')}</span>
    </button>

    <div class="card-top">
      <span class="time">${esc(r.time)}</span>
      <h3>${esc(r.name)}</h3>
    </div>

    <div class="macros">
      <div class="bar" role="img" aria-label="Bielkoviny ${r.p} g, tuky ${r.f} g, sacharidy ${r.c} g">
        <span style="width:${pk/tot*100}%;background:var(--protein)"></span>
        <span style="width:${fk/tot*100}%;background:var(--fat)"></span>
        <span style="width:${ck/tot*100}%;background:var(--carb)"></span>
      </div>
      <div class="legend">
        <span><i style="background:var(--protein)"></i>B ${r.p} g</span>
        <span><i style="background:var(--fat)"></i>T ${r.f} g</span>
        <span><i style="background:var(--carb)"></i>S ${r.c} g</span>
        <span class="kcal">${r.kcal} kcal</span>
      </div>
      <div class="tags">${r.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    </div>

    <div class="detail" id="${id}" hidden>
      <div>
        <div class="lbl">Suroviny</div>
        <ul class="ing">${r.ing.map(([n,g]) => `<li><span>${esc(n)}</span><span class="g">${esc(g)}</span></li>`).join('')}</ul>
      </div>
      <div>
        <div class="lbl">Postup</div>
        <ul class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      </div>
      <p class="tip">${r.tip}</p>
      ${r.src ? `<p class="src">Podľa receptu z <a href="${esc(r.src.url)}" target="_blank" rel="noopener">${esc(r.src.name)}</a>, upravené na nízke sacharidy.</p>` : ''}
    </div>

    <button class="more" type="button" aria-expanded="false" aria-controls="${id}">
      <span class="more-txt">Suroviny a postup</span>
      <span class="more-arr" aria-hidden="true">▾</span>
    </button>`;

  // kým fotka v priečinku img/ neexistuje, karta ukáže farebnú obálku
  // namiesto rozbitého obrázka
  const im = el.querySelector('.shot img');
  im.addEventListener('error', () => im.remove());

  // rozbaliť sa dá tlačidlom pod kartou aj kliknutím na fotku
  const detail = el.querySelector('.detail');
  const more   = el.querySelector('.more');
  const shot   = el.querySelector('.shot');
  const toggle = () => {
    const open = detail.hidden;
    detail.hidden = !open;
    el.classList.toggle('open', open);
    [more, shot].forEach(b => b.setAttribute('aria-expanded', String(open)));
    more.querySelector('.more-txt').textContent = open ? 'Skryť recept' : 'Suroviny a postup';
  };
  more.addEventListener('click', toggle);
  shot.addEventListener('click', toggle);

  return el;
}

const CARDS = RECIPES.map(card);

// text, v ktorom hľadáme: názov, suroviny a štítky
const HAYSTACK = RECIPES.map(r => bezDiakritiky(
  (r.name + ' ' + r.ing.map(x => x[0]).join(' ') + ' ' + r.tags.join(' ')).toLowerCase()
));

let activeTag = "Všetko";
let query = "";
const mam = new Set();   // suroviny, ktoré má návštevník doma

const SORTS = {
  cas:      (a,b) => MINS[a] - MINS[b],
  protein:  (a,b) => RECIPES[b].p - RECIPES[a].p,
  kcalAsc:  (a,b) => RECIPES[a].kcal - RECIPES[b].kcal,
  kcalDesc: (a,b) => RECIPES[b].kcal - RECIPES[a].kcal,
  sach:     (a,b) => RECIPES[a].c - RECIPES[b].c
};

function render(){
  let idx = RECIPES.map((_, i) => i).filter(i => {
    const tagOk = activeTag === "Všetko" || RECIPES[i].tags.includes(activeTag);
    // recept prejde len vtedy, keď má návštevník doma všetky jeho hlavné suroviny
    const ingOk = mam.size === 0 || HAS[i].every(k => mam.has(k));
    const qOk   = !query || HAYSTACK[i].includes(query);
    return tagOk && ingOk && qOk;
  });

  const by = SORTS[sortSel.value];
  if (by) idx = idx.slice().sort(by);

  grid.replaceChildren(...idx.map(i => CARDS[i]));
  countEl.textContent = idx.length === RECIPES.length
    ? `Všetkých ${RECIPES.length}`
    : `Zobrazených ${idx.length} z ${RECIPES.length}`;
  emptyEl.hidden = idx.length > 0;
}

TAGS.forEach(t => {
  const b = document.createElement('button');
  b.className = 'chip';
  b.type = 'button';
  b.textContent = t;
  b.setAttribute('aria-pressed', t === activeTag ? 'true' : 'false');
  b.addEventListener('click', () => {
    activeTag = t;
    filterBar.querySelectorAll('.chip').forEach(c =>
      c.setAttribute('aria-pressed', c.textContent === t ? 'true' : 'false'));
    render();
  });
  filterBar.appendChild(b);
});

ING.forEach(([key, label]) => {
  const b = document.createElement('button');
  b.className = 'chip';
  b.type = 'button';
  b.textContent = label;
  b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', () => {
    const on = mam.has(key);
    if (on) mam.delete(key); else mam.add(key);
    b.setAttribute('aria-pressed', on ? 'false' : 'true');
    render();
  });
  ingBar.appendChild(b);
});

searchEl.addEventListener('input', () => {
  query = bezDiakritiky(searchEl.value.trim().toLowerCase());
  searchClear.hidden = !searchEl.value;
  render();
});
searchClear.addEventListener('click', () => {
  searchEl.value = '';
  query = '';
  searchClear.hidden = true;
  searchEl.focus();
  render();
});

sortSel.addEventListener('change', render);
render();