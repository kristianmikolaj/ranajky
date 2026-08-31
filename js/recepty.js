// ---------------------------------------------------------------
// Karty receptov, filtrovanie podľa typu a surovín, zoradenie.
// ---------------------------------------------------------------

const grid      = document.getElementById('grid');
const filterBar = document.getElementById('filters');
const ingBar    = document.getElementById('ingFilters');
const sortSel   = document.getElementById('sort');
const countEl   = document.getElementById('count');
const emptyEl   = document.getElementById('empty');

function card(r, i){
  const pk = r.p*4, fk = r.f*9, ck = r.c*4, tot = pk + fk + ck;
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `
    <div class="shot">
      <div class="shot-ph">
        <span class="ph-lbl">Sem príde foto</span>
        <span class="ph-file">img/${FOTO[i]}.jpg</span>
      </div>
      <img src="img/${FOTO[i]}.jpg" alt="${esc(r.name)}" loading="lazy">
    </div>
    <div class="card-top">
      <div class="card-idx"><span>${String(i+1).padStart(2,'0')}</span><span class="time">${esc(r.time)}</span></div>
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
    </div>
    <div class="card-body">
      <div>
        <div class="lbl">Suroviny</div>
        <ul class="ing">${r.ing.map(([n,g]) => `<li><span>${esc(n)}</span><span class="g">${esc(g)}</span></li>`).join('')}</ul>
      </div>
      <div>
        <div class="lbl">Postup</div>
        <ul class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      </div>
      <div class="tags">${r.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <p class="tip">${r.tip}</p>
      ${r.src ? `<p class="src">Podľa receptu z <a href="${esc(r.src.url)}" target="_blank" rel="noopener">${esc(r.src.name)}</a>, upravené na nízke sacharidy.</p>` : ''}
    </div>`;

  // kým fotka v priečinku img/ neexistuje, karta ukáže prázdny rámik
  // namiesto rozbitého obrázka
  const im = el.querySelector('.shot img');
  im.addEventListener('error', () => im.remove());
  return el;
}

const CARDS = RECIPES.map(card);

let activeTag = "Všetko";
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
    return tagOk && ingOk;
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

sortSel.addEventListener('change', render);
render();
