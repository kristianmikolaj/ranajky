// ---------------------------------------------------------------
// Horná navigácia a bočný panel s prihlásením.
// ---------------------------------------------------------------

const topbar     = document.querySelector('.topbar');
const navLinks   = [...document.querySelectorAll('.navlinks a')];
// acctBtn je deklarované v auth.js, ktorý sa načíta skôr
const drawer     = document.getElementById('drawer');
const drawerBg   = document.getElementById('drawerBg');
const drawerClose= document.getElementById('drawerClose');

// ---------- zvýraznenie sekcie, v ktorej sa čitateľ práve nachádza ----------

const sections = navLinks
  .map(a => document.getElementById(a.dataset.sec))
  .filter(Boolean);

function markActive(id){
  navLinks.forEach(a => a.classList.toggle('on', a.dataset.sec === id));
}

if ('IntersectionObserver' in window && sections.length){
  const seen = new Map();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => seen.set(e.target.id, e.intersectionRatio));
    // vyhrá sekcia, ktorej je práve vidno najviac
    let best = null, bestRatio = 0;
    seen.forEach((ratio, id) => { if (ratio > bestRatio){ bestRatio = ratio; best = id; } });
    markActive(bestRatio > 0 ? best : null);
  }, { rootMargin: '-72px 0px -55% 0px', threshold: [0, .1, .25, .5, .75, 1] });
  sections.forEach(s => io.observe(s));
}

// tieň pod lištou až po odrolovaní, nech hore nič neruší
const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

// ---------- bočný panel ----------

let lastFocus = null;

function openDrawer(){
  lastFocus = document.activeElement;
  drawer.hidden = false;
  // trieda sa pridá až v ďalšom snímku, inak by prechod nebolo vidno
  requestAnimationFrame(() => drawer.classList.add('open'));
  acctBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  const first = drawer.querySelector('input, button:not(#drawerClose)') || drawerClose;
  first.focus();
}

function closeDrawer(){
  drawer.classList.remove('open');
  acctBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  const done = () => { drawer.hidden = true; drawer.removeEventListener('transitionend', done); };
  drawer.addEventListener('transitionend', done);
  // poistka, keby prechod nenastal (napr. pri vypnutých animáciách)
  setTimeout(() => { if (!drawer.classList.contains('open')) drawer.hidden = true; }, 350);
  if (lastFocus) lastFocus.focus();
}

const isOpen = () => !drawer.hidden && drawer.classList.contains('open');

acctBtn.addEventListener('click', () => isOpen() ? closeDrawer() : openDrawer());
drawerBg.addEventListener('click', closeDrawer);
drawerClose.addEventListener('click', closeDrawer);

document.addEventListener('keydown', e => {
  if (!isOpen()) return;
  if (e.key === 'Escape'){ closeDrawer(); return; }
  // kým je panel otvorený, tabulátor krúži len po ňom
  if (e.key === 'Tab'){
    const f = [...drawer.querySelectorAll('a[href], button:not([disabled]), input, select')]
      .filter(el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
});

// auth.js potrebuje panel otvárať (tlačidlo v denníku) aj zatvárať (po prihlásení)
APP.nav = { open: openDrawer, close: closeDrawer, isOpen };
