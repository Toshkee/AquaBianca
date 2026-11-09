/* Sekcija „Za partnere“: postava pravih proizvoda, tabela asortimana i izbor teme u kontakt formi. */
import { t, num, onLang, lang } from './i18n.js';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// logistika (kom/pak, pak/paleta, EAN) dolazi od klijenta
const SPEC = [
  ['Izvorska voda', '0,25 l', 'PET · Junior', 'izvorska', 'mirna_025_JUNIOR'],
  ['Izvorska voda', '0,33 l', 'PET', 'izvorska', 'mirna_033'],
  ['Izvorska voda', '0,5 l', 'PET', 'izvorska', 'mirna_05'],
  ['Izvorska voda', '0,5 l', 'PET · Sport čep', 'izvorska', 'mirna_05_sport'],
  ['Izvorska voda', '1,5 l', 'PET', 'izvorska', 'mirna_15'],
  ['Izvorska voda', '5 l', 'PET', 'izvorska', 'mirna_5'],
  ['Izvorska voda', '0,25 l', 'Staklo', 'izvorska', 'mirna_025_2025'],
  ['Izvorska voda', '0,75 l', 'Staklo', 'izvorska', 'mirna_075_2025'],
  ['Kisjela voda', '0,33 l', 'PET', 'kisjela', 'kisjela_033'],
  ['Kisjela voda', '0,25 l', 'Staklo', 'kisjela', 'Staklo_gazirana_025_2025'],
  ['Kisjela voda', '0,75 l', 'Staklo', 'kisjela', 'Staklo_gazirana_075_2025'],
  ['Izvorska voda', '10 l', 'Galon · nepovratna', 'galon', 'mirna_10_istakac'],
  ['Izvorska voda', '15 / 19 l', 'Galon · povratna', 'galon', 'mirna_15_19_povratna'],
];
const TOPIC = { izvorska: 'distribution', kisjela: 'distribution', galon: 'coolers' };

function renderSpec(filter = 'all') {
  document.getElementById('specBody').innerHTML = SPEC.filter((r) => filter === 'all' || r[3] === filter).map(([name, vol, pack, cat, img]) => `
    <tr class="${cat}">
      <td><span class="sp-prod"><img src="assets/web/${img}.jpg" alt="" loading="lazy"><span>${t(name)}</span></span></td>
      <td class="sp-vol" data-name="${t(name)}">${num(vol)}</td><td>${t(pack)}</td>
      <td class="tbd">—</td><td class="tbd">—</td><td class="tbd">—</td>
      <td><a href="#kontakt" class="sp-add" data-topic="${TOPIC[cat]}">${lang() === 'en' ? 'Enquire' : 'Upit'}</a></td>
    </tr>`).join('');
}

function lineup() {
  const band = document.getElementById('partneri');
  const imgs = [...band.querySelectorAll('#lineup img')];
  const decoded = Promise.all(imgs.map((i) => i.decode().catch(() => {})));
  // bottles rise in when the band scrolls into view
  new IntersectionObserver(([e], io) => {
    if (!e.isIntersecting) return;
    decoded.then(() => band.classList.add('ready')); io.disconnect();
  }, { threshold: 0.25 }).observe(band);
  if (reduce) return;
  let mx = 0, my = 0, tx = 0, ty = 0, raf = 0;
  band.addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; if (!raf) raf = requestAnimationFrame(step); });
  function step() {
    mx += (tx - mx) * 0.08; my += (ty - my) * 0.08;
    imgs.forEach((im) => { const d = +im.dataset.d; im.style.translate = `${(mx * d).toFixed(1)}px ${(my * d * 0.4).toFixed(1)}px`; });
    raf = Math.abs(tx - mx) + Math.abs(ty - my) > 0.001 ? requestAnimationFrame(step) : 0;
  }
}

export function initB2B() {
  if (!document.getElementById('partneri')) return;
  let filter = 'all';
  renderSpec();
  onLang(() => renderSpec(filter));
  document.querySelectorAll('.spec-filter button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.spec-filter button').forEach((x) => x.classList.toggle('active', x === b));
    filter = b.dataset.f; renderSpec(filter);
  }));
  // links that preselect the contact form topic
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-topic]');
    if (t && t.dataset.topic) document.getElementById('topic').value = t.dataset.topic;
  });
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.querySelector('.form-note').textContent = t('Prototip — forma nije povezana.');
  });
  lineup();
}
