/*
 * „Od izvora do boce“ — sticky scroll priča sa PRAVIM fotografijama boca
 * (izdvojene sa originalnih fotografija proizvoda, assets/cutouts-web/).
 * Izvor → Sastav (oznake minerala uz bocu) → PET ili staklo → Kisjela voda (zelena scena, mjehurići).
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const sm = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

// [progress, centerX (0..1 of width), bottom (0..1 of height), height (0..1 of height)]
function keyframes(mobile) {
  if (!mobile) return {
    izvPET:   [[0, .64, 1.7, .62], [.12, .64, .86, .62], [.52, .64, .86, .62], [.64, .57, .86, .6], [.78, .57, .86, .6], [.92, .5, .86, .5]],
    izvGlass: [[0, 1.25, .86, .72], [.52, 1.25, .86, .72], [.66, .75, .86, .72], [.78, .75, .86, .72], [.92, .62, .86, .6]],
    kisPET:   [[0, .74, 1.7, .42], [.76, .74, 1.7, .42], [.92, .74, .86, .42]],
    kisGlass: [[0, .86, 1.8, .6], [.79, .86, 1.8, .6], [.95, .86, .86, .6]],
  };
  return {
    izvPET:   [[0, .5, 1.6, .4], [.12, .5, .52, .4], [.52, .5, .52, .4], [.64, .32, .52, .36], [.78, .32, .52, .36], [.92, .19, .52, .28]],
    izvGlass: [[0, 1.4, .52, .42], [.52, 1.4, .52, .42], [.66, .68, .52, .42], [.78, .68, .52, .42], [.92, .41, .52, .34]],
    kisPET:   [[0, .62, 1.6, .24], [.76, .62, 1.6, .24], [.92, .62, .52, .24]],
    kisGlass: [[0, .82, 1.7, .34], [.79, .82, 1.7, .34], [.95, .82, .52, .34]],
  };
}
function sample(keys, p) {
  if (p <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (p <= b[0]) { const t = sm(a[0], b[0], p); return a.slice(1).map((v, k) => v + (b[k + 1] - v) * t); }
  }
  return keys[keys.length - 1].slice(1);
}

// bubbles live in bottle-local coords: u ∈ [-1,1] across, v ∈ [0,1] from bottom
const BUBBLE_ZONE = { kisPET: { w: .34, top: .74, label: [.55, .72] }, kisGlass: { w: .3, top: .62, label: [.27, .45] } };
function makeBubbles(n) {
  return Array.from({ length: n }, () => ({ u: Math.random() * 2 - 1, v: Math.random(), s: .04 + Math.random() * .1, r: Math.random(), ph: Math.random() * 6.28 }));
}

export function initStory() {
  const section = document.getElementById('prica');
  if (!section) return;
  const stage = document.getElementById('storyStage');
  const imgs = [...stage.querySelectorAll('.sb')];
  const names = imgs.map((i) => i.dataset.b);
  const callouts = document.getElementById('callouts');
  const chaps = [...section.querySelectorAll('.chap')];
  const bar = document.getElementById('storyBar');
  const cvs = document.getElementById('bubbles');
  const ctx = cvs.getContext('2d');
  const bubbles = { kisPET: makeBubbles(55), kisGlass: makeBubbles(70) };
  const depth = [14, 22, 10, 18];

  let W = 0, H = 0, dpr = 1, mobile = false, keys;
  const resize = () => {
    W = stage.clientWidth; H = stage.clientHeight; dpr = Math.min(devicePixelRatio, 2);
    cvs.width = W * dpr; cvs.height = H * dpr;
    mobile = W / H < 0.9; keys = keyframes(mobile);
  };
  resize(); addEventListener('resize', resize);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  section.addEventListener('pointermove', (e) => { mouse.tx = e.clientX / innerWidth - 0.5; mouse.ty = e.clientY / innerHeight - 0.5; });

  let p = 0, last = 0, snap = true, decoded = false, shown = false;
  const rects = {};

  const update = (now) => {
    const t = now / 1000, dt = Math.min(0.05, t - last || 0.016); last = t;
    const r = section.getBoundingClientRect();
    const target = clamp01(-r.top / (r.height - innerHeight));
    // first frame after (re)entering: jump straight to the scroll position, no fly-in from a stale state
    if (snap) { p = target; snap = false; } else p += (target - p) * (reduce ? 1 : 0.1);
    mouse.x += (mouse.tx - mouse.x) * 0.06; mouse.y += (mouse.ty - mouse.y) * 0.06;

    const baseH = imgs[0].offsetHeight; // all images share the CSS base height (60vh)
    imgs.forEach((img, i) => {
      const [fx, by, hv] = sample(keys[names[i]], p);
      const s = (hv * H) / baseH;
      const bw = img.offsetWidth;
      const float = reduce ? 0 : Math.sin(t * 0.9 + i * 1.7) * 4;
      const x = fx * W - bw / 2 + mouse.x * depth[i];
      const y = by * H - baseH + float + mouse.y * depth[i] * 0.4;
      img.style.transformOrigin = '50% 100%';
      img.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${s.toFixed(4)})`;
      const h = hv * H, w = bw * s;
      rects[names[i]] = { cx: x + bw / 2, bottom: y + baseH, w, h };
    });
    stage.style.setProperty('--floor', (sample(keys.izvPET, p)[1] * 100).toFixed(2));
    section.style.setProperty('--green', sm(0.72, 0.88, p).toFixed(3));

    // mineral callouts beside the bottle (desktop)
    const co = sm(0.31, 0.36, p) * (1 - sm(0.5, 0.55, p));
    if (!mobile) {
      const b = rects.izvPET;
      callouts.style.opacity = co.toFixed(3);
      callouts.style.transform = `translate3d(${(b.cx + b.w / 2 + 36 + (1 - co) * 20).toFixed(1)}px,${(b.bottom - b.h * 0.86).toFixed(1)}px,0)`;
    }

    // chapters
    chaps.forEach((c) => {
      const a = +c.dataset.a, b = +c.dataset.b;
      const o = sm(a - 0.03, a + 0.04, p) * (1 - sm(b - 0.04, b + 0.03, p));
      c.style.opacity = o.toFixed(3);
      c.style.transform = `translateY(${((1 - o) * 24).toFixed(1)}px)`;
      c.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
    });
    if (bar) bar.style.transform = mobile ? `scaleX(${p})` : `scaleY(${p})`;

    // carbonation bubbles inside the green bottles
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const ba = sm(0.84, 0.95, p);
    if (ba > 0.01 && !reduce) {
      for (const k of ['kisPET', 'kisGlass']) {
        const b = rects[k], z = BUBBLE_ZONE[k];
        for (const q of bubbles[k]) {
          q.v += q.s * dt * 0.6;
          if (q.v > z.top) { q.v = 0.04; q.u = Math.random() * 2 - 1; }
          const x = b.cx + (q.u * z.w / 2) * b.w + Math.sin(t * 2 + q.ph) * 1.2;
          const y = b.bottom - q.v * b.h;
          const inLabel = q.v > z.label[0] && q.v < z.label[1];
          const a = ba * (inLabel ? 0.15 : 0.85) * sm(0.04, 0.12, q.v) * (1 - sm(z.top - 0.08, z.top, q.v));
          const rad = (0.8 + q.r * q.r * 2.6) * (b.h / 500);
          ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 0.8; ctx.stroke();
          ctx.fillStyle = `rgba(255,255,255,${a * 0.25})`; ctx.fill();
        }
      }
    }
    // reveal the bottles only once they have real positions
    if (!shown && decoded) { shown = true; section.classList.add('ready'); }
  };
  const frame = (now) => { update(now); raf = requestAnimationFrame(frame); };

  let raf = 0, on = false;
  const start = () => { on = true; snap = true; update(performance.now()); raf = requestAnimationFrame(frame); };
  // jumping straight into the section (menu link, fast scroll): position everything before the next paint
  addEventListener('scroll', () => {
    if (on) return;
    const r = section.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) start();
  }, { passive: true });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !on) start();
    else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
  }, { rootMargin: '30% 0px' }).observe(section);

  Promise.all(imgs.map((i) => i.decode().catch(() => {}))).then(() => { decoded = true; });
}
