# Aqua Bianca — novi sajt

Redizajn sajta [aquabianca.com](https://www.aquabianca.com). Jedna stranica (MNE / EN), bez build koraka.

**Uživo (prototip):** https://aquabianca-prototip.vercel.app

## Pokretanje lokalno

```bash
python3 -m http.server 5178
```

Otvoriti http://localhost:5178 (engleski: http://localhost:5178/?lang=en).

## Objava na Vercel

```bash
./deploy.sh
```

Skripta sklapa folder `deploy/` (samo fajlovi koje sajt koristi) i objavljuje ga na Vercel projekat `aquabianca-prototip`.

## Struktura

| Fajl | Šta radi |
|---|---|
| `index.html` | cijela stranica |
| `styles.css` | izgled (font Manrope) |
| `main.js` | hero sa vodenim efektom i asortiman (Three.js) |
| `story.js` | scroll priča sa bocama |
| `b2b.js` | sekcija za partnere: postava proizvoda, tabela, izbor teme u formi |
| `chrome.js` | meni, animacije pri skrolu, brojači |
| `i18n.js` | prevod MNE → EN |
| `assets/` | fotografije: originali (`proizvodi/`, `galerija/`, `instagram/`, `cutouts/`) i web verzije (`web/`, `cutouts-web/`, `instagram-web/`) |
| `PREDLOZI.md` | predlozi dizajna i istorija izmjena |
