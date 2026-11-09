# Aqua Bianca — predlog redizajna sajta

Inspiracija: **bros.co.me** (editorijalni minimalizam, puno bjeline, centriran logotip, mala verzalna tipografija, asimetrična „bento“ mreža, tanke linije, uokvireni dugmići).
Cilj: sajt koji izgleda kao premium evropski brend vode (nivo Evian / Voss / Acqua Panna), a ne kao lokalni Squarespace šablon.

---

## 1. Šta postoji danas (aquabianca.com)

| Stavka | Stanje |
|---|---|
| Platforma | Squarespace šablon, bez identiteta |
| Stranice | Početna, Proizvodi (4 linije + katalog), O nama, Galerija, Video galerija, Kontakt, Politika kvaliteta — duplirano MNE / EN |
| Proizvodi | Izvorska voda (PET 0,25 Junior · 0,33 · 0,5 · 0,5 Sport · 1,5 · 5 · 10 l nepovratna · 15/19 l povratna; staklo 0,25 · 0,75) i Kisjela voda (PET 0,33; staklo 0,25 · 0,75) |
| Ključne poruke | „Voda je život. Izaberite najbolje.“ · izvor između NP Biogradska gora i rijeke Tare (UNESCO) · nizak sadržaj minerala · HACCP (SGS SK11/1548) i ISO 9001:2015 |
| Sastav | Na⁺ 2,20 · Ca²⁺ 23,25 · Mg²⁺ 2,78 · K⁺ 0,49 · HCO₃⁻ 122 mg/l |
| Video | 10 YouTube spotova (kanal UCC1meKyWfn9Syyu8vKxQiaQ) |
| Kontakt | DOO „Aqua Bianca“, Manastirska 25, Podgorica · Pogon: Radigojno bb, Kolašin · +382 20 669 001 · +382 69 012 512 · office@aquabianca.com |
| Glavni problemi | nema hijerarhije, tekst „O nama“ je jedan zid teksta, proizvodi bez detalja, nema B2B dijela (distributeri, HoReCa, dostava galona), video je samo lista embedova, katalog nije lako dostupan |

Sav preuzeti materijal je u `assets/`:
- `assets/proizvodi/` — 18 fotografija proizvoda u punoj rezoluciji (2500 px)
- `assets/galerija/`, `assets/sajt/` — događaji, „Sadimo-gradimo“, snimci iz vazduha, katalog
- `assets/video/` — naslovne slike svih 10 videa (ID-jevi su u imenima fajlova)
- `assets/logo/` — postojeći logo (PNG)
- `assets/web/` — iste slike optimizovane za web (1600 px)

---

## 2. Tri pravca dizajna

### A) „Glacier Editorial“ — **preporuka, napravljen kao prototip**
Najbliže bros.co.me. Bijela i ledeno plava, duboka mornarsko plava za kontrast, zelena samo za kisjelu vodu.
- **Tipografija:** Instrument Serif (naslovi, kurziv za naglaske) + Inter Tight (tekst, verzalne oznake sa razmakom).
- **Ritam:** veliki hero preko cijelog ekrana → kratka izjava centrirana kao kod Brosa → asimetrična mreža 4 linije proizvoda → interaktivni asortiman → tamni blok sa mineralima → izvor → kvalitet → video → zajednica → katalog → kontakt.
- **Utisak:** miran, skup, pouzdan. Radi i za potrošače i za poslovne partnere.

### B) „Deep Source“ — imerzivni, tamni
Cijeli sajt na tamno plavoj podlozi, scroll priča „od izvora do boce“: kamera se spušta kroz šumu Biogradske gore → kapljica → voda koja se sliva u 3D bocu koja se okreće dok skrolujete.
- Najviše „wow“ efekta, ali zahtijeva **pravi 3D model boce** (GLB) i originalne video snimke.
- Rizik: teži na mobilnom, sporije učitavanje; za ozbiljnu firmu treba ga dozirati.

### C) „Corporate Clear“ — B2B fokus
Čist, korporativni raspored: proizvodi kao tabela specifikacija (zapremina, pakovanje, broj komada u paketu, paleta, EAN), stranica za distributere, forma za ponudu, mapa distribucije, dostava galona.
- Manje emocije, više konverzije za HoReCa i maloprodaju.
- Može se kombinovati sa A: A za javni dio, C kao „Za partnere“ sekcija.

**Moja preporuka:** A kao osnova + B2B dio iz C + jedan dozirani 3D trenutak iz B (rotirajuća boca na stranici proizvoda) kada dobijemo 3D model.

---

## 3. Struktura novog sajta (sitemap)

```
/                       Početna
/proizvodi              Pregled: Izvorska / Kisjela
/proizvodi/izvorska     Svi formati + sastav + pakovanja
/proizvodi/kisjela
/izvor                  Priča o izvoru, Biogradska gora, Tara, pogon u Kolašinu
/kvalitet               HACCP, ISO 9001:2015, politika kvaliteta (PDF), laboratorijska analiza
/zajednica              Događaji, „Sadimo-gradimo“, sponzorstva
/video                  Video galerija (featured + mreža)
/partneri               Distributeri, HoReCa, katalog PDF, forma za ponudu
/dostava-galona         Naručivanje 15/19 l povratne ambalaže i aparata
/kontakt
/en/...                 Engleska verzija (iste rute)
```

---

## 4. Three.js / WebGL ideje

Implementirano u prototipu:
1. **Hero „površina vode“** — fotografija iz vazduha kod Kolašina se blago talasa (simplex noise), a kursor ostavlja koncentrične talase kao prst u vodi.
2. **„Tečni“ prelaz između proizvoda** — kada birate format, nova boca se „puni“ odozdo prema gore sa nepravilnom ivicom vode i svijetlom linijom pjene.
3. **Mjehurići za kisjelu vodu** — kada izaberete Kisjela voda, kroz kadar se dižu animirani mjehurići (karbonizacija); za izvorsku vodu nestaju.
4. **Talasanje preko boce** — prelazak kursorom preko boce pravi blagu refrakciju.

Sljedeći korak (zahtijeva materijal od klijenta):
5. **3D boca** — model u Blenderu (ili LatheGeometry iz siluete boce) sa pravom etiketom kao teksturom, staklo/PET shader sa refrakcijom; boca se okreće pri skrolu, mijenja pakovanje (PET → staklo) morph prelazom.
6. **Kapljica → logo** — čestice vode se na učitavanju skupljaju u oval logotipa.
7. **Mapa izvora** — 3D teren Crne Gore (ili samo Kolašin–Biogradska gora–Tara) sa označenim izvorom, kamera kruži.
8. **Mineralni „periodni sistem“** — svaki mineral kao lebdeća kapljica čija veličina odgovara koncentraciji.

Pravila: sve animacije poštuju `prefers-reduced-motion`, render se zaustavlja kada sekcija nije vidljiva, a bez WebGL-a se prikazuje obična fotografija.

---

## 5. Šta treba tražiti od klijenta (bitno za kvalitet)

1. **Fotografije proizvoda bez pozadine** (PNG/transparentno ili čista bijela) i **bez upisane zapremine** na slici — trenutne slike imaju „0,33l“ i plavu/zelenu pozadinu ugrađenu u fotografiju, što ograničava dizajn i 3D efekte.
2. **Originalni video fajlovi (MP4/ProRes)** — posebno „Biogradska gora“, „Rijeka Tara“ i „4K Snowboard“ — za tihi video u pozadini heroja (YouTube embed ne može čisto kao pozadina).
3. **Logo u vektoru (SVG/AI/PDF)** — trenutni je samo PNG.
4. **Kompletna hemijska analiza** (i za kisjelu vodu), datum analize, institucija.
5. **Tehnički podaci pakovanja** — komada u paketu, paleta, EAN kodovi → za B2B tabelu.
6. **Katalog proizvoda u PDF-u** — na sadašnjem sajtu link za preuzimanje nije javno dostupan.
7. Fotografije pogona i izvora (drone snimci u visokoj rezoluciji — trenutni je 1774 px).
8. Potvrda tekstova o zdravstvenim efektima (Na, Ca, Mg…) — zakonski osjetljivo, provjeriti šta smije da stoji.

---

## 6. Tehnički predlog

- **Stack:** Astro ili Next.js (statičko generisanje, odličan SEO) + Three.js za 2–3 sekcije + Lenis za glatki skrol.
- **CMS:** Sanity ili Storyblok — klijent sam mijenja proizvode, vijesti i događaje, MNE/EN.
- **Performanse:** AVIF/WebP slike, lazy-load WebGL-a, Lighthouse cilj 90+ na mobilnom.
- **SEO/strukturirani podaci:** `Product`, `Organization`, `LocalBusiness` schema; hreflang MNE/EN.
- **Pristupačnost:** kontrast AA, tastatura, alternativni tekstovi.

---

## 7. Prototip

Fajlovi: `prototip/index.html`, `prototip/styles.css`, `prototip/main.js`.
Pokretanje iz korijena projekta:

```bash
python3 -m http.server 5178
```

zatim otvoriti http://localhost:5178/

Napomena: dugme „Preuzmi katalog“ i kontakt forma su u prototipu samo vizuelni (nisu povezani).

---

## 8. Verzija 3 — spoj A + B + poslovni dio C

**Tipografija:** Manrope (jedan font za cijeli sajt). Naslovi su lagani (300) sa zbijenim razmakom, a velike brojke su još lakše (200). Logotip u zaglavlju je verzalni sa širokim razmakom. Na sajtu nema numeracije (01, 02…) ni malih oznaka sa linijom iznad naslova.

**Početna (`prototip/index.html`)** je editorijalna (A), sa jednom imerzivnom scroll sekcijom (B), „Od izvora do boce“. Koristi **prave fotografije boca**, izdvojene sa originalnih fotografija proizvoda:
1. **Izvor:** PET boca izranja.
2. **Sastav:** pored boce se pojavljuju oznake sa vrijednostima minerala.
3. **PET ili staklo:** dolazi staklena boca.
4. **Kisjela voda:** scena prelazi u zeleno, ulaze zelene boce, a u njima se dižu mjehurići.

Svijetla studijska pozadina ima blage svjetlosne „bazene“, a boce imaju refleksiju na podu i blago prate kursor. Ispod sekcije sa sastavom je traka „Za partnere“.

**Partneri (`prototip/partneri.html`)** je poslovni dio (C):
- Hero sa postavom pravih proizvoda: galon na aparatu, 5 l, izvorska i kisjela u staklu, kisjela PET 0,33 l. Proizvodi imaju dubinsku paralaksu.
- Kanali saradnje i „Zašto Aqua Bianca“.
- Tabela asortimana sa filterima. Logistiku (komada u pakovanju, paleta, EAN) dostavlja klijent.
- Proces saradnje, galoni i B2B forma za upit.

### Izdvojene boce
- `assets/cutouts/` sadrži PNG sa providnom pozadinom u punoj rezoluciji za 13 proizvoda.
- `assets/cutouts-web/` sadrži iste slike kao WebP visine 1400 px, svaka 54–186 KB.
- Izdvojene su lokalno pomoću macOS Vision (bez eksternih servisa). Brojka zapremine sa fotografija je automatski izbačena.

Za finalni sajt preporuka ostaje ista: novo profesionalno fotografisanje boca na providnoj pozadini u većoj rezoluciji. Kod je spreman, mijenjaju se samo fajlovi slika.

---

## 9. Verzija 4 — jedan sajt, jedna stranica

- Sajt je sada **jedna početna strana** u korijenu projekta (`index.html`, `styles.css`, `main.js`, `chrome.js`, `story.js`, `b2b.js`). Folder `prototip/` i posebna stranica Partneri više ne postoje.
- Dio za partnere je **sekcija `#partneri`** na početnoj:
  - postava pravih proizvoda
  - tri kanala saradnje
  - tabela asortimana sa filterima
  - koraci od upita do isporuke
- **Jedna kontakt forma** za sve, sa temama: opšti upit, distribucija, maloprodaja, HoReCa, galoni, mediji. Dugmad „Zatražite ponudu“ i „Upit“ automatski biraju temu.
- Izbačeni su katalog i YouTube video sekcija. Umjesto videa na početnoj je sekcija „Trenuci“ sa fotografijama sa Instagrama.
- Objava: `./deploy.sh`. Sajt je na glavnoj adresi, a stari linkovi `/prototip/...` preusmjeravaju na novi sajt.

## 10. Engleski jezik

- Prekidač **MNE / EN** u meniju i u mobilnom meniju. Prebacuje se bez učitavanja stranice.
- Prevedeno je sve na stranici:
  - svi tekstovi i alt tekstovi slika
  - naslov stranice i opis za Google
  - asortiman i tabela
  - poruka kontakt forme
- Brojke su na engleskom sa decimalnom tačkom (0.33 L, 2.20 mg/l).
- Adresa za EN je `?lang=en`; na Vercelu i `/en` vodi tamo. Izbor jezika se pamti u pregledaču.
- Prevod je u `i18n.js`, jedna tabela parova MNE → EN. Novi tekst se prevodi dodavanjem jednog reda.
- Za finalni sajt preporuka: provjera engleskog teksta od strane klijenta, posebno rečenica o zdravstvenim svojstvima minerala.
