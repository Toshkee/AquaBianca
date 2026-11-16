/* „Gdje nas naći“: traka fotografija iz objekata (prevlačenje, strelice, napredak) povezana sa mapom. */
export function initVenues() {
  const strip = document.getElementById('venStrip');
  if (!strip) return;
  const figs = [...strip.querySelectorAll('figure')];
  const pins = [...document.querySelectorAll('.ven-map .pin')];
  const bar = document.getElementById('venBar');
  const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  // progress bar
  const progress = () => {
    const max = strip.scrollWidth - strip.clientWidth;
    const vis = strip.clientWidth / strip.scrollWidth;
    bar.style.width = `${(vis * 100).toFixed(1)}%`;
    bar.style.transform = `translateX(${max > 0 ? (strip.scrollLeft / max) * ((1 / vis) - 1) * 100 : 0}%)`;
  };
  strip.addEventListener('scroll', progress, { passive: true });
  addEventListener('resize', progress);
  figs.forEach((f) => f.querySelector('img').addEventListener('load', progress));
  progress();

  // arrows: jump by most of a screen
  const step = (dir) => strip.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: smooth });
  document.getElementById('venPrev').addEventListener('click', () => step(-1));
  document.getElementById('venNext').addEventListener('click', () => step(1));
  strip.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });

  // mouse drag (touch scrolls natively)
  let down = null;
  strip.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = { x: e.clientX, left: strip.scrollLeft, moved: false };
  });
  addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - down.x;
    if (!down.moved && Math.abs(dx) > 4) { down.moved = true; strip.classList.add('dragging'); }
    if (down.moved) strip.scrollLeft = down.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!down) return;
    if (down.moved) {
      // let snap settle on the nearest photo
      const left = strip.scrollLeft;
      strip.classList.remove('dragging');
      strip.scrollLeft = left;
    }
    down = null;
  });

  // map <-> photos
  const light = (place, scroll) => {
    pins.forEach((p) => p.classList.toggle('on', p.dataset.place === place));
    figs.forEach((f) => f.classList.toggle('on', !!place && f.dataset.place === place));
    strip.classList.toggle('focus', !!place);
    if (place && scroll) {
      const first = figs.find((f) => f.dataset.place === place);
      if (first) strip.scrollTo({ left: first.offsetLeft - figs[0].offsetLeft, behavior: smooth });
    }
  };
  pins.forEach((p) => {
    p.addEventListener('pointerenter', () => light(p.dataset.place, true));
    p.addEventListener('pointerleave', () => light(null));
    p.addEventListener('focus', () => light(p.dataset.place, true));
    p.addEventListener('blur', () => light(null));
    p.addEventListener('click', () => light(p.dataset.place, true));
  });
  figs.forEach((f) => {
    if (!f.dataset.place) return;
    f.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || strip.classList.contains('dragging')) return;
      pins.forEach((p) => p.classList.toggle('on', p.dataset.place === f.dataset.place));
    });
    f.addEventListener('pointerleave', () => pins.forEach((p) => p.classList.remove('on')));
  });
}
