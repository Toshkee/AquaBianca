/* Video na stranici: hero petlja, kratke petlje u pločicama, klip izvora i reklama u „Trenucima“.
   Fajlovi se učitavaju tek kad se sekcija približi, a puštaju samo dok su vidljivi. */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;

function load(v) {
  if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
}
const play = (v) => { load(v); const p = v.play(); if (p) p.catch(() => {}); };

// load a little before it scrolls in
const near = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { load(e.target); near.unobserve(e.target); }
}), { rootMargin: '400px 0px' });

// play while at least `t` of it is on screen
function whileVisible(v, t, onShow, onHide) {
  new IntersectionObserver(([e]) => (e.isIntersecting ? onShow() : onHide()), { threshold: t }).observe(v);
}

function hero() {
  const hero = document.getElementById('hero');
  const v = document.getElementById('heroVideo');
  if (!v) return;
  v.addEventListener('playing', () => hero.classList.add('video-ready'), { once: true });
  if (reduce) return; // poster only
  whileVisible(hero, 0, () => play(v), () => v.pause());
}

function tiles() {
  document.querySelectorAll('.tile').forEach((tile) => {
    const v = tile.querySelector('.tile-video');
    if (!v) return;
    near.observe(v);
    v.addEventListener('playing', () => tile.classList.add('playing'));
    const stop = () => { v.pause(); tile.classList.remove('playing'); };
    if (reduce) return;
    if (canHover) {
      tile.addEventListener('pointerenter', () => play(v));
      tile.addEventListener('pointerleave', stop);
      tile.addEventListener('focus', () => play(v));
      tile.addEventListener('blur', stop);
    } else {
      // touch: play when most of the tile is on screen
      whileVisible(tile, 0.6, () => play(v), stop);
    }
  });
}

function originClip() {
  const box = document.querySelector('.origin-clip');
  if (!box) return;
  const v = box.querySelector('video');
  near.observe(v);
  if (reduce) return;
  // plays once (the bottle rises out of the map), then holds the last frame; hover replays it
  let played = false;
  whileVisible(box, 0.6, () => { if (!played) { played = true; play(v); } }, () => {});
  if (canHover) box.addEventListener('pointerenter', () => { if (v.ended || v.paused) { v.currentTime = 0; play(v); } });
}

function moments() {
  document.querySelectorAll('.mom-video').forEach((v) => {
    near.observe(v);
    if (reduce) return;
    whileVisible(v, 0.4, () => play(v), () => v.pause());
  });
}

export function initMedia() {
  hero(); tiles(); originClip(); moments();
}
