/*
 * MNE / EN prevod.
 * Statički tekst se prevodi po originalnom (crnogorskom) tekstu, pa HTML ostaje čist.
 * Moduli koji sami generišu tekst (asortiman, tabela, brojači) koriste t() i num(),
 * i ponovo se iscrtavaju na događaj 'ab:lang'.
 * Jezik: ?lang=en u adresi (ili /en na Vercelu), pamti se izbor.
 */
const EN = new Map(Object.entries({
  // head / a11y
  'Aqua Bianca — Prirodna izvorska voda': 'Aqua Bianca — Natural Spring Water',
  'Aqua Bianca — prirodna izvorska i kisjela voda iz netaknute prirode između Nacionalnog parka Biogradska gora i rijeke Tare.': 'Aqua Bianca — natural spring and sparkling water from untouched nature between Biogradska Gora National Park and the Tara River.',
  'Glavna navigacija': 'Main navigation', 'Aqua Bianca — početna': 'Aqua Bianca — home', 'Meni': 'Menu', 'Skrolujte dolje': 'Scroll down',
  'Od izvora do boce': 'From source to bottle', 'Prethodni proizvod': 'Previous product', 'Sljedeći proizvod': 'Next product',
  // nav
  'Proizvodi': 'Products', 'Izvor': 'Source', 'Kvalitet': 'Quality', 'Trenuci': 'Moments', 'Partneri': 'Partners', 'Kontakt': 'Contact', 'Zajednica': 'Community',
  // hero
  'Voda je život.': 'Water is life.', 'Izaberite najbolje.': 'Choose the best.', 'Asortiman': 'Our range', 'Upoznajte izvor': 'Discover the source',
  'Natrijum': 'Sodium', 'Standardi': 'Standards',
  'Svaka kapljica vode Aqua Bianca dolazi iz netaknute prirode između Nacionalnog parka Biogradska gora i rijeke Tare koja je pod zaštitom UNESCO-a. To je čini jedinstvenom i balansiranom na način na koji to samo priroda može da podari.':
    'Every drop of Aqua Bianca comes from untouched nature between Biogradska Gora National Park and the UNESCO-protected Tara River. That is what makes it unique and balanced in a way only nature can provide.',
  // collections
  'Izvorska voda': 'Spring water', 'Kisjela voda': 'Sparkling water', 'PET ambalaža': 'PET bottles', 'Staklena ambalaža': 'Glass bottles', 'Pogledaj asortiman': 'View the range',
  // marquee
  'Biogradska gora': 'Biogradska Gora', 'Rijeka Tara · UNESCO': 'Tara River · UNESCO', 'Nizak sadržaj minerala': 'Low mineral content',
  // story
  'Iz netaknute': 'From untouched', 'prirode.': 'nature.',
  'Izvor se nalazi daleko od industrijskih postrojenja i zagađivača — između Nacionalnog parka Biogradska gora i rijeke Tare koja je pod zaštitom UNESCO-a.':
    'The spring lies far from industrial plants and pollution — between Biogradska Gora National Park and the UNESCO-protected Tara River.',
  'Nizak sadržaj': 'Low in', 'minerala.': 'minerals.',
  'Natrijum · mg/l': 'Sodium · mg/l', 'Kalcijum · mg/l': 'Calcium · mg/l', 'Magnezijum · mg/l': 'Magnesium · mg/l', 'Kalijum · mg/l': 'Potassium · mg/l', 'Hidrokarbonati · mg/l': 'Bicarbonates · mg/l',
  'Može se konzumirati u kontinuitetu i u povećanim količinama — za sve uzraste.': 'Suitable for everyday drinking, even in larger amounts — for all ages.',
  'PET ili': 'PET or', 'staklo.': 'glass.',
  'Od 0,25 l do 19 l — za dom, sport, kancelariju i restoran. Staklena ambalaža za HoReCa, galoni za aparate za vodu.':
    'From 0.25 l to 19 l — for home, sport, office and restaurant. Glass bottles for hospitality, cooler bottles for water dispensers.',
  'Isti izvor.': 'Same source.', 'Drugačiji karakter.': 'Different character.',
  'Gazirana prirodna mineralna voda Aqua Bianca — jedinstven ukus i balans minerala za svaku priliku.': 'Aqua Bianca sparkling natural mineral water — a unique taste and mineral balance for every occasion.',
  'Pogledajte asortiman': 'Explore the range',
  // showcase (static + generated)
  'Prirodna izvorska voda': 'Natural spring water', 'Gazirana prirodna mineralna voda': 'Sparkling natural mineral water', 'Pomjerite kursor preko boce': 'Move your cursor over the bottle',
  'PET ambalaža · Junior': 'PET bottle · Junior', 'PET ambalaža · Sport čep': 'PET bottle · Sport cap', 'Galon · nepovratna ambalaža': 'Cooler bottle · single-use',
  'Galon · povratna ambalaža': 'Cooler bottle · returnable', 'Galon': 'Cooler', 'Staklo': 'Glass',
  'Izvorska voda Aqua Bianca potiče iz netaknute prirode planinskog izvora između Nacionalnog parka Biogradska gora i rijeke Tare koja je pod zaštitom UNESCO-a. Jedinstveni balans minerala čini Aqua Biancu pravim izborom za cijelu porodicu i za svaku priliku.':
    'Aqua Bianca spring water comes from a mountain spring in untouched nature between Biogradska Gora National Park and the UNESCO-protected Tara River. Its unique mineral balance makes Aqua Bianca the right choice for the whole family and every occasion.',
  'Gazirana prirodna mineralna voda Aqua Bianca potiče iz netaknute prirode planinskog izvora između Nacionalnog parka Biogradska gora i rijeke Tare. Jedinstveni ukus i balans minerala čini gaziranu Aqua Biancu pravim izborom za svaku priliku.':
    'Aqua Bianca sparkling natural mineral water comes from a mountain spring between Biogradska Gora National Park and the Tara River. Its unique taste and mineral balance make it the right choice for every occasion.',
  // minerals
  'Prirodno nizak sadržaj minerala —': 'Naturally low in minerals —', 'za svaki dan, za sve uzraste.': 'for every day, for all ages.',
  'Zahvaljujući niskom sadržaju minerala, AQUA BIANCA se može konzumirati u kontinuitetu i u povećanim količinama.': 'Thanks to its low mineral content, AQUA BIANCA can be enjoyed every day and in larger amounts.',
  'Posebno prihvatljiva za osobe sa povišenim krvnim pritiskom.': 'Particularly suitable for people with high blood pressure.',
  'Kalcijum': 'Calcium', 'Dovoljno da ne dođe do pada nivoa kalcijuma u krvi.': 'Enough to prevent a drop in blood calcium levels.',
  'Magnezijum': 'Magnesium', 'Preventiva za normalno korišćenje vitamina C i B1.': 'Supports the normal use of vitamins C and B1.',
  'Kalijum': 'Potassium', 'Bezbjedno za konzumiranje u većim količinama.': 'Safe to drink in larger amounts.',
  'Hidrokarbonati': 'Bicarbonates', 'Ne narušava kisjelu sredinu želudačnih sokova.': 'Does not disturb the acidity of gastric juices.',
  // origin
  'Daleko od industrije.': 'Far from industry.', 'Blizu prirode.': 'Close to nature.',
  'Izvor prirodne izvorske vode AQUA BIANCA nalazi se u zoni netaknute prirode, daleko od industrijskih postrojenja i zagađivača — između Nacionalnog parka Biogradska gora i rijeke Tare koja je pod zaštitom UNESCO-a.':
    'The AQUA BIANCA natural spring lies in a zone of untouched nature, far from industrial plants and pollution — between Biogradska Gora National Park and the UNESCO-protected Tara River.',
  'Pogon za preradu i flaširanje': 'Processing and bottling plant', 'Zaštićena priroda': 'Protected nature', 'NP Biogradska gora': 'Biogradska Gora National Park',
  'Svjetska baština': 'World Heritage', 'Rijeka Tara — UNESCO': 'Tara River — UNESCO',
  // quality
  'Najzahtjevniji standardi': 'The highest standards', 'kvaliteta i bezbjednosti.': 'of quality and safety.',
  'Vrhunski kvalitet proizvoda naš je cilj kome smo svakodnevno posvećeni. Da bi ostvarili taj cilj, Aqua Bianca brine o zaposlenima, potrošačima, kupcima i dobavljačima.':
    'Top product quality is a goal we work towards every day. To achieve it, Aqua Bianca cares for its employees, consumers, customers and suppliers.',
  'Politika kvaliteta i bezbjednosti proizvoda': 'Quality and product safety policy', 'Analiza opasnosti i kritične kontrolne tačke': 'Hazard Analysis and Critical Control Points',
  'Sistem menadžmenta kvalitetom': 'Quality management system',
  // moments
  'Uz vas.': 'With you.', 'Svaki dan.': 'Every day.',
  'Za stolom, na treningu, na putu — Aqua Bianca je tamo gdje je i vaš dan.': 'At the table, at the gym, on the road — Aqua Bianca goes wherever your day does.',
  'Uz more': 'By the sea', 'Za stolom': 'At the table', 'Na treningu': 'At the gym', 'Na putu': 'On the road', 'Uz kafu': 'With coffee', 'Na odmoru': 'On holiday',
  '@aqua.bianca na Instagramu': '@aqua.bianca on Instagram',
  // community
  'Uvijek uz ljude.': 'Always with people.', 'Uvijek sa djecom.': 'Always with children.',
  'Koncerti, sportski događaji i edukativni program „Sadimo — gradimo“ — Aqua Bianca je prisutna tamo gdje se zajednica okuplja.':
    'Concerts, sporting events and the “Sadimo — gradimo” educational programme for children — Aqua Bianca is there wherever the community comes together.',
  // partners
  'Voda za vaš posao.': 'Water for your business.', 'Od 0,25 do 19 litara.': 'From 0.25 to 19 litres.',
  'Kompletan asortiman prirodne izvorske i kisjele vode u PET, staklenoj i galonskoj ambalaži — za distributere, ugostitelje i kancelarije.':
    'A complete range of natural spring and sparkling water in PET, glass and cooler bottles — for distributors, hospitality and offices.',
  'Zatražite ponudu': 'Request a quote', '13 formata': '13 formats', 'Ambalaža': 'Packaging', 'PET · Staklo · Galon': 'PET · Glass · Cooler',
  'Jedan izvor.': 'One source.', 'Tri načina saradnje.': 'Three ways to work together.',
  'Distribucija i maloprodaja': 'Distribution and retail',
  'PET ambalaža od 0,25 l Junior do 5 l — za trgovinske lance, veleprodaju i maloprodajne objekte.': 'PET bottles from 0.25 l Junior to 5 l — for retail chains, wholesale and shops.',
  'Staklena ambalaža 0,25 l i 0,75 l izvorske i kisjele vode — za hotele, restorane i kafiće.': 'Spring and sparkling water in 0.25 l and 0.75 l glass bottles — for hotels, restaurants and cafés.',
  'Kancelarije i domaćinstva': 'Offices and homes',
  'Galoni od 10 l (nepovratna) i 15 / 19 l (povratna ambalaža) za aparate za vodu.': '10 l single-use and 15 / 19 l returnable cooler bottles for water dispensers.',
  'Naručite galone': 'Order cooler bottles',
  'za poručivanje.': 'for trade orders.', 'Sve': 'All', 'Izvorska': 'Spring', 'Kisjela': 'Sparkling', 'Galoni': 'Coolers',
  'Prototip: komada u pakovanju, pakovanja po paleti i EAN kodove dostavlja klijent — polja su namjerno prazna.': 'Prototype: units per pack, packs per pallet and EAN codes will be provided by the client — these fields are intentionally empty.',
  'Proizvod': 'Product', 'Zapremina': 'Volume', 'Kom / pak': 'Units / pack', 'Pak / paleta': 'Packs / pallet',
  'PET · Junior': 'PET · Junior', 'PET · Sport čep': 'PET · Sport cap', 'Galon · nepovratna': 'Cooler · single-use', 'Galon · povratna': 'Cooler · returnable', 'Upit': 'Enquiry',
  'Od upita': 'From enquiry', 'do isporuke.': 'to delivery.',
  'Pošaljite upit sa formatima i okvirnim količinama.': 'Send an enquiry with the formats and estimated quantities.',
  'Ponuda': 'Quote', 'Pripremamo ponudu prilagođenu vašem kanalu prodaje.': 'We prepare a quote tailored to your sales channel.',
  'Dogovor': 'Agreement', 'Usaglašavamo uslove, asortiman i dinamiku isporuke.': 'We agree on terms, range and delivery schedule.',
  'Isporuka': 'Delivery', 'Redovna isporuka iz pogona u Kolašinu.': 'Regular deliveries from our plant in Kolašin.',
  // contact
  'Razgovarajmo.': "Let's talk.", 'Za pitanja, saradnju, ponudu ili dostavu galona — javite nam se.': 'Questions, partnerships, quotes or cooler bottle delivery — get in touch.',
  'Uprava': 'Head office', 'DOO „Aqua Bianca“': 'Aqua Bianca d.o.o.', 'Manastirska 25, Podgorica': 'Manastirska 25, Podgorica, Montenegro',
  'Pogon za preradu i flaširanje vode': 'Water processing and bottling plant', 'Telefon za potrošače': 'Consumer line',
  'Ime i prezime': 'Full name', 'Kompanija (opciono)': 'Company (optional)', 'Telefon': 'Phone', 'Tema': 'Subject',
  'Opšti upit': 'General enquiry', 'Distribucija / veleprodaja': 'Distribution / wholesale', 'Maloprodaja': 'Retail',
  'Galoni za kancelariju / dom': 'Cooler bottles for office / home', 'Mediji': 'Media', 'Grad / region': 'City / region',
  'Proizvodi od interesa': 'Products of interest', 'Izvorska PET': 'Spring PET', 'Izvorska staklo': 'Spring glass', 'Kisjela PET': 'Sparkling PET', 'Kisjela staklo': 'Sparkling glass',
  'Poruka': 'Message', 'Pošaljite poruku': 'Send message', 'Prototip — forma nije povezana.': 'Prototype — the form is not connected.',
  // footer
  'Voda je život. Izaberite najbolje.': 'Water is life. Choose the best.',
  'Izvorska voda — PET': 'Spring water — PET', 'Izvorska voda — Staklo': 'Spring water — Glass', 'Kisjela voda — PET': 'Sparkling water — PET', 'Kisjela voda — Staklo': 'Sparkling water — Glass',
  'Kompanija': 'Company', 'Pratite nas': 'Follow us', '© 2026 DOO „Aqua Bianca“, Podgorica': '© 2026 Aqua Bianca d.o.o., Podgorica',
  // image alts
  'Izvorska voda Aqua Bianca u PET ambalaži': 'Aqua Bianca spring water in PET bottles', 'Izvorska voda Aqua Bianca u staklenoj ambalaži': 'Aqua Bianca spring water in glass bottles',
  'Kisjela voda Aqua Bianca u PET ambalaži': 'Aqua Bianca sparkling water in PET bottles', 'Kisjela voda Aqua Bianca u staklenoj ambalaži': 'Aqua Bianca sparkling water in glass bottles',
  'Pogled iz vazduha na dolinu kod Kolašina': 'Aerial view of the valley near Kolašin', 'Staklena boca Aqua Bianca na stijeni uz more': 'Aqua Bianca glass bottle on a rock by the sea',
  'Sipanje vode Aqua Bianca u čašu': 'Pouring Aqua Bianca into a glass', 'Aqua Bianca Sport na treningu': 'Aqua Bianca Sport at the gym',
  'Boca Aqua Bianca na putovanju': 'Aqua Bianca bottle on the road', 'Aqua Bianca u staklu uz kafu': 'Aqua Bianca in glass with coffee', 'Aqua Bianca uz bazen': 'Aqua Bianca by the pool',
  'Koncert uz podršku Aqua Bianca': 'Concert supported by Aqua Bianca', 'Program Sadimo-gradimo': 'The Sadimo-gradimo programme', 'Aqua Bianca boca na bini': 'Aqua Bianca bottle on stage',
  'Publika na koncertu': 'Concert audience', 'Sadimo-gradimo, Mall of Montenegro': 'Sadimo-gradimo, Mall of Montenegro',
  'Boce Aqua Bianca u rashladnoj vitrini': 'Aqua Bianca bottles in a chiller', 'Konobar služi Aqua Bianca u staklu': 'Waiter serving Aqua Bianca in glass',
  'Galon 15/19 l na aparatu za vodu': '15/19 l cooler bottle on a water dispenser',
}));

const KEY = 'ab-lang';
const fromUrl = () => {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'en' || q === 'me') return q;
  if (/^\/en(\/|$)/.test(location.pathname)) return 'en';
  return null;
};
let current = fromUrl() || (() => { try { return localStorage.getItem(KEY); } catch { return null; } })() || 'me';

export const lang = () => current;
/** prevod JS stringa */
export const t = (s) => (current === 'en' ? EN.get(s) ?? s : s);
/** decimalni zarez → tačka na engleskom */
export const num = (s) => (current === 'en' ? String(s).replace(/(\d),(\d)/g, '$1.$2') : String(s));
export const onLang = (cb) => addEventListener('ab:lang', cb);

const textOrig = new WeakMap(); // Text node -> original string
const attrOrig = new WeakMap(); // Element -> { attr: original }
const ATTRS = ['alt', 'aria-label', 'content'];

function translateText(node) {
  if (!textOrig.has(node)) textOrig.set(node, node.nodeValue);
  const raw = textOrig.get(node);
  if (current === 'me') { if (node.nodeValue !== raw) node.nodeValue = raw; return; }
  const key = raw.replace(/\s+/g, ' ').trim();
  if (!key) return;
  const out = EN.get(key) ?? num(key);
  node.nodeValue = raw.replace(raw.trim(), out);
}

function translateTree(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement && !n.parentElement.closest('script,style,[data-i18n-skip]') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) translateText(n);
  root.querySelectorAll('[alt],[aria-label],meta[name="description"]').forEach((el) => {
    if (!attrOrig.has(el)) attrOrig.set(el, Object.fromEntries(ATTRS.filter((a) => el.hasAttribute(a)).map((a) => [a, el.getAttribute(a)])));
    for (const [a, v] of Object.entries(attrOrig.get(el))) el.setAttribute(a, current === 'en' ? EN.get(v) ?? v : v);
  });
}

const TITLE = document.title;
export function setLang(l, { push = true } = {}) {
  current = l === 'en' ? 'en' : 'me';
  try { localStorage.setItem(KEY, current); } catch {}
  document.documentElement.lang = current === 'en' ? 'en' : 'sr-ME';
  document.title = current === 'en' ? EN.get(TITLE) ?? TITLE : TITLE;
  translateTree(document.body);
  translateTree(document.head);
  document.querySelectorAll('[data-lang]').forEach((a) => a.classList.toggle('active', a.dataset.lang === current));
  if (push) {
    const u = new URL(location.href);
    if (current === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
    history.replaceState(null, '', u);
  }
  dispatchEvent(new CustomEvent('ab:lang', { detail: current }));
}

export function initI18n() {
  document.querySelectorAll('[data-lang]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); setLang(a.dataset.lang); }));
  setLang(current, { push: false });
}
