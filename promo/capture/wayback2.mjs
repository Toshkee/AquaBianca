import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
for (const ts of ['20250114235900', '20241215193650', '20240522175400', '20230423024031']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`https://web.archive.org/web/${ts}/https://www.aquabianca.com/`, { waitUntil: 'load', timeout: 60000 }).catch((e) => console.log('goto', e.message));
  await p.waitForTimeout(3000);
  const css = await p.evaluate(() => [...document.styleSheets].reduce((n, s) => { try { return n + s.cssRules.length; } catch { return n; } }, 0));
  await p.addStyleTag({ content: '#wm-ipp-base,#wm-ipp,#donato{display:none!important}' }).catch(() => {});
  await p.screenshot({ path: `../out/old-${ts}.jpg`, quality: 60 });
  console.log(ts, 'css rules', css);
  await p.close();
}
await b.close();
