import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const [n, size] of [['m', { width: 390, height: 844 }], ['d', { width: 1440, height: 900 }]]) {
  const p = await b.newPage({ viewport: size, deviceScaleFactor: 2 });
  await p.goto('https://web.archive.org/web/20250313165251/https://aquabianca.com/', { waitUntil: 'load', timeout: 60000 }).catch((e) => console.log('goto', e.message));
  await p.waitForTimeout(4000);
  await p.addStyleTag({ content: '#wm-ipp-base,#wm-ipp,#donato{display:none!important}' }).catch(() => {});
  await p.screenshot({ path: `../out/old-${n}.jpg`, quality: 70 });
  console.log(n, await p.title());
  await p.close();
}
await b.close();
