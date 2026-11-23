import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [n, size] of [['d', { width: 1440, height: 900 }], ['m', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: size });
  const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:5190/?v=' + Date.now(), { waitUntil: 'load' });
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}#header{visibility:hidden}' });
  await p.evaluate(() => document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }));
  const el = await p.$('.cobrand'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
  await el.screenshot({ path: `../out/cob-${n}.jpg`, quality: 75 });
  const broken = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')));
  console.log(n, 'broken', broken, 'errors', errs.length, 'overflow', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await p.close();
}
await b.close();
