// ---------------------------------------------------------------
// Registrácia, prihlásenie a synchronizácia denníka na účet.
// Firebase sa sťahuje až tu a len vtedy, keď je vyplnený config.js.
// ---------------------------------------------------------------

const authBox = document.getElementById('auth');
const acctBtn = document.getElementById('acctBtn');
const dstatus = document.getElementById('dstatus');

const AUTH_ERR = {
  'auth/invalid-email':          'Neplatná e-mailová adresa.',
  'auth/missing-password':       'Zadaj heslo.',
  'auth/weak-password':          'Heslo musí mať aspoň 6 znakov.',
  'auth/email-already-in-use':   'Na tento e-mail už účet existuje — skús sa prihlásiť.',
  'auth/invalid-credential':     'Nesprávny e-mail alebo heslo.',
  'auth/wrong-password':         'Nesprávne heslo.',
  'auth/user-not-found':         'Taký účet neexistuje. Zaregistruj sa nižšie.',
  'auth/too-many-requests':      'Priveľa pokusov za sebou. Skús to o pár minút.',
  'auth/network-request-failed': 'Nepodarilo sa spojiť so serverom. Skontroluj pripojenie.',
  'auth/operation-not-allowed':  'Prihlasovanie e-mailom nie je v projekte zapnuté.'
};

function authMsg(text, cls){
  const el = document.getElementById('authMsg');
  if (el){ el.textContent = text; el.className = 'auth-msg' + (cls ? ' ' + cls : ''); }
}

function setSync(text, isErr){
  const el = document.getElementById('sync');
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('err', !!isErr);
}

// Skrátený e-mail do tlačidla v lište — celá adresa by ju roztiahla.
function shortMail(mail){
  const [meno] = mail.split('@');
  return meno.length > 12 ? meno.slice(0,11) + '…' : meno;
}

function renderTopbar(){
  if (!CLOUD_READY || APP.cloudFailed){ acctBtn.hidden = true; return; }
  acctBtn.hidden = false;
  acctBtn.textContent = APP.user ? shortMail(APP.user.email) : 'Prihlásiť';
  acctBtn.classList.toggle('in', !!APP.user);
}

function renderDstatus(){
  if (!CLOUD_READY || APP.cloudFailed){
    dstatus.hidden = true;
    return;
  }
  dstatus.hidden = false;
  dstatus.innerHTML = APP.user
    ? `<span>Prihlásený ako <b>${esc(APP.user.email)}</b></span><span class="sync" id="sync"></span>`
    : `<span>Zapisovať môžeš po prihlásení.</span>
       <button class="btn" type="button" id="dsLogin">Prihlásiť sa</button>`;
  const btn = document.getElementById('dsLogin');
  if (btn) btn.addEventListener('click', () => APP.nav && APP.nav.open());
}

function renderAuth(){
  renderTopbar();
  renderDstatus();

  if (!CLOUD_READY){
    authBox.innerHTML =
      `<h3>Denník zatiaľ beží len v tomto prehliadači</h3>
       <p class="hint">Prihlasovanie sa zapne, keď v súbore <code>js/config.js</code> doplníš údaje projektu z Firebase. Návod je v NASTAVENIE-FIREBASE.md. Dovtedy sa dá denník normálne používať, len sa neprenesie na iné zariadenie.</p>`;
    return;
  }

  if (APP.user){
    authBox.innerHTML =
      `<h3>Tvoj účet</h3>
       <p class="hint">Denník sa ukladá na tento účet. Prihlás sa ním na inom zariadení a nájdeš tam tie isté zápisy.</p>
       <div class="auth-in">
         <span>${esc(APP.user.email)}</span>
         <button class="btn ghost" type="button" id="logout">Odhlásiť</button>
       </div>`;
    document.getElementById('logout')
      .addEventListener('click', () => APP.fb.a.signOut(APP.fb.auth));
    return;
  }

  authBox.innerHTML =
    `<h3>Prihlás sa a maj denník všade</h3>
     <p class="hint">Zápisy sa uložia na tvoj účet, takže ich uvidíš na mobile aj na počítači. Recepty sú verejné, účet je potrebný len na denník.</p>
     <form class="authform" id="authForm" autocomplete="on">
       <input type="email" id="email" placeholder="tvoj@email.sk" autocomplete="email" required>
       <input type="password" id="heslo" placeholder="heslo (aspoň 6 znakov)" autocomplete="current-password" required>
       <button class="btn" type="submit" id="loginBtn">Prihlásiť</button>
       <button class="btn ghost" type="button" id="regBtn">Zaregistrovať</button>
       <button class="btn link" type="button" id="resetBtn">Zabudnuté heslo</button>
     </form>
     <p class="auth-msg" id="authMsg" role="status"></p>`;

  const form = document.getElementById('authForm');
  const val  = () => [document.getElementById('email').value.trim(),
                      document.getElementById('heslo').value];

  // po úspešnom prihlásení sa formulár prekreslí, tlačidlá už nemusia existovať
  const busy = on => ['loginBtn','regBtn','resetBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = on;
  });

  async function run(fn, working){
    authMsg(working);
    busy(true);
    try { await fn(); }
    catch(e){ authMsg(AUTH_ERR[e.code] || 'Nepodarilo sa to. Skús znova.', 'err'); }
    finally { busy(false); }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const [em, pw] = val();
    run(() => APP.fb.a.signInWithEmailAndPassword(APP.fb.auth, em, pw), 'Prihlasujem…');
  });

  document.getElementById('regBtn').addEventListener('click', () => {
    const [em, pw] = val();
    if (!em || pw.length < 6) return authMsg('Zadaj e-mail a heslo s aspoň 6 znakmi.', 'err');
    run(() => APP.fb.a.createUserWithEmailAndPassword(APP.fb.auth, em, pw), 'Zakladám účet…');
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    const [em] = val();
    if (!em) return authMsg('Najprv zadaj e-mail, na ktorý ti pošleme odkaz.', 'err');
    run(async () => {
      await APP.fb.a.sendPasswordResetEmail(APP.fb.auth, em);
      authMsg('Poslali sme ti e-mail s odkazom na zmenu hesla.', 'ok');
    }, 'Posielam…');
  });
}

// ---------- synchronizácia denníka ----------

async function pullAndMerge(){
  if (!APP.fb || !APP.user) return;
  const ref = APP.fb.f.doc(APP.fb.db, 'users', APP.user.uid);
  setSync('Načítavam z účtu…');
  try {
    const snap  = await APP.fb.f.getDoc(ref);
    const cloud = (snap.exists() && snap.data().log) ? snap.data().log : {};
    // pri prvom prihlásení sa doterajšie lokálne zápisy prenesú hore;
    // pri konflikte v ten istý deň platí to, čo je na účte
    const merged = Object.assign({}, APP.dennik.getLog(), cloud);
    APP.dennik.setLog(merged);
    if (JSON.stringify(merged) !== JSON.stringify(cloud)){
      await APP.fb.f.setDoc(ref, { log: merged }, { merge: true });
    }
    setSync('Uložené na účte');
  } catch(e){
    setSync('Z účtu sa nepodarilo načítať — vidíš lokálnu kópiu', true);
  }
}

async function pushCloud(){
  if (!APP.fb || !APP.user) return;
  setSync('Ukladám…');
  try {
    await APP.fb.f.setDoc(
      APP.fb.f.doc(APP.fb.db, 'users', APP.user.uid),
      { log: APP.dennik.getLog() },
      { merge: true }
    );
    setSync('Uložené na účte');
  } catch(e){
    setSync('Uloženie zlyhalo — zmena je zatiaľ len v tomto prehliadači', true);
  }
}

APP.dennik.push = pushCloud;

// ---------- štart ----------

async function initCloud(){
  renderAuth();
  if (!CLOUD_READY) return;
  try {
    const [appMod, authMod, fsMod] = await Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-auth.js'),
      import(SDK + 'firebase-firestore.js')
    ]);
    const app = appMod.initializeApp(FIREBASE_CONFIG);
    APP.fb = { a: authMod, f: fsMod, auth: authMod.getAuth(app), db: fsMod.getFirestore(app) };

    APP.fb.a.onAuthStateChanged(APP.fb.auth, async u => {
      const bolPrihlaseny = !!APP.user;
      APP.user = u;
      renderAuth();
      // po úspešnom prihlásení panel zavrieme, nech je vidno denník
      if (u && !bolPrihlaseny && APP.nav && APP.nav.isOpen()) APP.nav.close();
      if (u) await pullAndMerge();
      APP.dennik.redraw();
    });
  } catch(e){
    APP.fb = null;
    APP.cloudFailed = true;
    authBox.innerHTML =
      `<h3>Prihlasovanie sa nepodarilo načítať</h3>
       <p class="hint">Denník beží ďalej lokálne v tomto prehliadači, zápisy sa len neprenesú na iné zariadenie. Skús obnoviť stránku.</p>`;
    APP.dennik.redraw();
  }
}

initCloud();
