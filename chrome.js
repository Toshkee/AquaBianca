import { num, onLang } from './i18n.js';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (id) => document.getElementById(id);

export function initChrome() {
  const header = $('header');
  const hero = document.querySelector('[data-hero]');
  const onScroll = () => {
    header.classList.toggle('solid', !hero || scrollY > hero.offsetHeight - 120);
    const img = document.querySelector('[data-parallax]');
    if (img && !reduceMotion) {
      const r = img.parentElement.getBoundingClientRect();
      const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.transform = `translateY(${-8 + k * -10}%)`;
    }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const burger = $('burger'), menu = $('mobileMenu');
  const toggle = (open) => {
    burger.setAttribute('aria-expanded', open); menu.classList.toggle('open', open);
    header.classList.toggle('menu-open', open); document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.onclick = () => toggle(burger.getAttribute('aria-expanded') !== 'true');
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));

  // reveals with a small stagger between siblings
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.transitionDelay = `${(sibs.indexOf(el) % 5) * 90}ms`;
    io.observe(el);
  });

  // mineral counters
  const fmt = (v, d) => num(v.toFixed(d).replace('.', ','));
  // re-format counters that already finished when the language changes
  onLang(() => document.querySelectorAll('[data-count].done').forEach((el) => { el.textContent = fmt(parseFloat(el.dataset.count), +el.dataset.dec); }));
  const cio = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, to = parseFloat(el.dataset.count), dec = +el.dataset.dec;
    if (reduceMotion) { el.textContent = fmt(to, dec); el.classList.add('done'); return; }
    const t0 = performance.now(), dur = 1800;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), v = to * (1 - Math.pow(1 - k, 4));
      el.textContent = fmt(v, dec); if (k < 1) requestAnimationFrame(step); else el.classList.add('done');
    };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));
}
