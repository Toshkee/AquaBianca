# Aqua Bianca — novi sajt

Redizajn sajta [aquabianca.com](https://www.aquabianca.com). Jedna stranica (MNE / EN), bez build koraka.

## Pokretanje lokalno

```bash
python3 -m http.server 5178
```

Otvoriti http://localhost:5178 (engleski: http://localhost:5178/?lang=en).

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
| `media.js` | video: hero petlja, petlje u pločicama, klip izvora, reklama u „Trenucima“ |
| `venues.js` | „Bianca na stolu“: traka fotografija iz objekata i mapa |
| `assets/` | fotografije: originali (`proizvodi/`, `galerija/`, `instagram/`, `cutouts/`, `venues/`) i web verzije (`web/`, `cutouts-web/`, `instagram-web/`, `venues-web/`); video originali u `video/`, skraćene petlje u `video-web/` |
| `PREDLOZI.md` | predlozi dizajna i istorija izmjena |
