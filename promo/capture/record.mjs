// Records site clips with the CDP screencast, then resamples to a steady 30 fps MP4.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const BASE = 'http://localhost:5190';
const OUT = new URL('../public/rec/', import.meta.url).pathname;
const TMP = new URL('./frames/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const only = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars', '--force-device-scale-factor=2'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 };
const DESK = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 };

// smooth eased scroll inside the page
const smoothScroll = (page, to, ms) => page.evaluate(([to, ms]) => new Promise((done) => {
  const from = scrollY, t0 = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now) => { const t = Math.min(1, (now - t0) / ms); scrollTo(0, from + (to - from) * ease(t)); t < 1 ? requestAnimationFrame(step) : done(); };
  requestAnimationFrame(step);
}), [to, ms]);
const glide = async (page, from, to, ms, steps = 40) => {
  for (let i = 0; i <= steps; i++) { const t = i / steps, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; await page.mouse.move(from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e); await sleep(ms / steps); }
};

async function record(name, ctxOpts, setup, act) {
  if (only.length && !only.includes(name)) return;
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.addStyleTag({ content: '::-webkit-scrollbar{display:none}html{scroll-behavior:auto!important}' });
  await setup(page);
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    frames.push({ t: metadata.timestamp, data });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  const { width, height } = ctxOpts.viewport, dpr = ctxOpts.deviceScaleFactor;
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: width * dpr, maxHeight: height * dpr, everyNthFrame: 1 });
  const t0 = Date.now() / 1000;
  await act(page);
  const t1 = Date.now() / 1000;
  await cdp.send('Page.stopScreencast');
  await ctx.close();
  // resample to 30 fps
  fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP, { recursive: true });
  frames.sort((a, b) => a.t - b.t);
  const start = Math.max(t0, frames[0].t), n = Math.round((t1 - start) * 30);
  let k = 0;
  for (let i = 0; i < n; i++) {
    const t = start + i / 30;
    while (k + 1 < frames.length && frames[k + 1].t <= t) k++;
    fs.writeFileSync(`${TMP}${String(i).padStart(5, '0')}.jpg`, Buffer.from(frames[k].data, 'base64'));
  }
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', '30', '-i', `${TMP}%05d.jpg`, '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', `${OUT}${name}.mp4`]);
  console.log(name, frames.length, 'raw frames ->', n, 'at 30fps,', (n / 30).toFixed(1), 's');
}

const ready = async (page) => { await page.waitForFunction(() => document.getElementById('hero').classList.contains('gl-ready'), null, { timeout: 15000 }).catch(() => {}); await sleep(1500); };

// 1. phone hero, finger-like ripple across the water
await record('hero-m', MOBILE, ready, async (page) => {
  await sleep(600);
  await glide(page, [60, 520], [330, 380], 1600);
  await glide(page, [330, 380], [120, 300], 1400);
  await sleep(1200);
});

// 2. phone scroll story: bottles rise as you scroll
await record('story-m', MOBILE, async (page) => {
  await ready(page);
  const y = await page.$eval('#prica', (e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y - 844), y); await sleep(1200);
}, async (page) => {
  const y = await page.$eval('#prica', (e) => e.getBoundingClientRect().top + scrollY);
  const h = await page.$eval('#prica', (e) => e.offsetHeight);
  await smoothScroll(page, y + h - 844 * 1.05, 7000);
  await sleep(600);
});

// 3. desktop product showcase: liquid fill between products
await record('showcase-d', DESK, async (page) => {
  await ready(page);
  await page.$eval('#asortiman', (e) => e.scrollIntoView({ block: 'start' }));
  await sleep(2500);
}, async (page) => {
  await sleep(500);
  for (let i = 0; i < 3; i++) { await page.click('#scNext'); await sleep(1700); }
});

// 4. desktop venues: map pins light up their photos
await record('venues-d', DESK, async (page) => {
  await page.$eval('#mjesta', (e) => e.scrollIntoView({ block: 'start' }));
  await page.evaluate(() => scrollBy(0, 40));
  await page.evaluate(() => { document.querySelectorAll('#venStrip img').forEach((i) => { i.loading = 'eager'; }); return Promise.race([Promise.all([...document.querySelectorAll('#venStrip img')].map((i) => i.decode().catch(() => {}))), new Promise((r) => setTimeout(r, 4000))]); });
  await sleep(1500);
  await page.mouse.move(700, 120);
}, async (page) => {
  await sleep(200);
  const pin = async (k) => { const b = await page.$eval(`.pin[data-place="${k}"] .dot`, (e) => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }); return b; };
  let at = [700, 120];
  for (const k of ['kolasin', 'tivat', 'ulcinj']) { const p = await pin(k); await glide(page, at, p, 450, 30); at = p; await sleep(950); }
  await glide(page, at, [900, 500], 400, 30);
  await sleep(400);
});

// 5. desktop header: MNE -> EN switch on the hero
await record('lang-d', DESK, ready, async (page) => {
  await glide(page, [900, 400], [1373, 41], 900);
  await sleep(300);
  await page.click('.nav-right [data-lang="en"]');
  await sleep(1800);
  await page.click('.nav-right [data-lang="me"]');
  await sleep(900);
});

// 6. desktop minerals: numbers count up as the section scrolls in
await record('minerals-d', DESK, async (page) => {
  await ready(page);
  const y = await page.$eval('#sastav', (e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y - 700), y); await sleep(800);
}, async (page) => {
  const y = await page.$eval('#sastav', (e) => e.getBoundingClientRect().top + scrollY);
  await smoothScroll(page, y - 40, 1400);
  await sleep(2600);
});

// 7. desktop product tiles: hover plays the short loops
await record('tiles-d', DESK, async (page) => {
  await page.$eval('.collections', (e) => e.scrollIntoView({ block: 'start' }));
  await page.evaluate(() => scrollBy(0, -60));
  await page.evaluate(() => document.querySelectorAll('.tile-video').forEach((v) => { v.preload = 'auto'; if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); } }));
  await sleep(2500);
  await page.mouse.move(720, 60);
}, async (page) => {
  const c = async (i) => page.$eval(`.collections .tile:nth-child(${i})`, (e) => { const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  let at = [720, 60];
  for (const i of [1, 3]) { const p = await c(i); await glide(page, at, p, 600); at = p; await sleep(2200); }
  await glide(page, at, [720, 880], 500);
});

// 8. desktop partners: co-branded bottles, the button opens the form with the topic set
await record('partner-d', DESK, async (page) => {
  await page.$eval('.cobrand', (e) => e.scrollIntoView({ block: 'center' }));
  await page.evaluate(() => Promise.race([Promise.all([...document.querySelectorAll('.cobrand img')].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })), new Promise((r) => setTimeout(r, 3000))]));
  await page.evaluate(() => document.documentElement.style.setProperty('scroll-behavior', 'smooth', 'important'));
  await sleep(800);
  await page.mouse.move(400, 300);
}, async (page) => {
  const b = await page.$eval('.cobrand a[data-topic]', (e) => { const r = e.getBoundingClientRect(); return [r.x + 60, r.y + r.height / 2]; });
  await glide(page, [400, 300], b, 900);
  await sleep(250);
  await page.mouse.click(b[0], b[1]);
  await sleep(1600);
  const t = await page.$eval('#topic', (e) => { const r = e.getBoundingClientRect(); return [r.x + 120, r.y + r.height / 2]; });
  await glide(page, b.map((v, i) => (i ? 300 : v)), t, 700);
  await sleep(1400);
});

await browser.close();
