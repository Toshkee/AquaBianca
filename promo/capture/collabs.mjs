import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [n, size, lang] of [['d', { width: 1440, height: 900 }, 'me'], ['m', { width: 390, height: 844 }, 'me'], ['den', { width: 1440, height: 900 }, 'en']]) {
  const p = await b.newPage({ viewport: size, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`http://localhost:5190/?lang=${lang}&v=` + Date.now(), { waitUntil: 'load' });
  await p.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}#header{visibility:hidden}' });
  const el = await p.$('.collabs'); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500);
  await el.screenshot({ path: `../out/collabs-${n}.jpg`, quality: 80 });
  console.log(n, 'overflowX', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), errs);
  await p.close();
}
await b.close();
