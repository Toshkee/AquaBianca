import { chromium } from 'playwright-core';
import fs from 'node:fs';
const S='/private/tmp/claude-501/-Users-toshkee-AquaBianca/ee6f20b5-968f-4371-9f0e-395c5210d325/scratchpad/logos';
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage({ viewport: { width: 1200, height: 360 } });
const svg = fs.readFileSync(S + '/airmontenegro.svg', 'utf8');
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(S + '/' + f).toString('base64');
await p.setContent('<body style="margin:0;display:flex;gap:30px;align-items:center;padding:30px;background:#7a8290">' +
  '<div style="width:300px">' + svg.replace(/<\?xml[^>]*>/, '') + '</div>' +
  '<img src="' + b64('one.png') + '" style="width:300px">' +
  '<img src="' + b64('boranka.png') + '" style="width:300px"></body>');
await p.waitForTimeout(500);
await p.screenshot({ path: S + '/prev.png' });
await b.close();
