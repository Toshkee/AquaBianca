import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [n, size] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: size, deviceScaleFactor: 1 });
  await p.goto('http://localhost:5190/?v=' + Date.now(), { waitUntil: 'load' });
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}#header{visibility:hidden}html{scroll-behavior:auto!important}' });
  await p.evaluate(() => document.querySelectorAll('#venStrip img').forEach((i) => { i.loading = 'eager'; }));
  await p.$eval('#venStrip', (e) => e.scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1500);
  for (const [k, sel] of [['babi', 'babi'], ['swiss', 'swissotel']]) {
    await p.evaluate((s) => { const st = document.getElementById('venStrip'); const f = [...st.querySelectorAll('figure')].find((x) => x.querySelector('img').src.includes(s)); st.style.scrollSnapType = 'none'; st.scrollLeft = f.offsetLeft - st.firstElementChild.offsetLeft; }, sel);
    await p.waitForTimeout(700);
    const el = await p.$('#venStrip'); await el.screenshot({ path: `../out/strip-${n}-${k}.jpg`, quality: 75 });
  }
  await p.close();
}
await b.close();
