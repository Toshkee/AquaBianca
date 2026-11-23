import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, SAFE } from './brand';
import { Browser, Caption, clamp, Eyebrow, Phone, words } from './parts';

/*
 * Concept B "Od izvora do ekrana" — vaky.me × Aqua Bianca, 1080x1920, 30 fps, 36 s.
 * Section changes slide like a page scroll (OV frames of overlap) so the edit never hard-cuts.
 * Cuts sit on a 120 BPM grid (15 frames) so a trending sound can be laid over it in Instagram.
 */
export const T = {
  izvor: 0, // waterfall
  ekran: 60, // drone over the river
  morph: 120, // footage shrinks into the phone, site hero
  story: 240, // scroll story in the phone
  showcase: 360, // desktop product showcase
  minerals: 450, // mineral numbers count up
  tiles: 540, // product tiles play their loops on hover
  venues: 630, // map + venue photos
  partner: 780, // co-branded bottles -> enquiry form
  lang: 900, // MNE / EN
  outro: 960, // lockup
  end: 1080,
};
export const DURATION = T.end;

const ease = Easing.bezier(0.65, 0, 0.35, 1);
const cover: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };
const sec = (s: number) => Math.round(s * 30);
const OV = 9; // half-length of a section change, in frames
const soft = Easing.bezier(0.45, 0, 0.2, 1);

/* A clip that scrolls in from below at `from` and scrolls out upwards at `to`, like moving down the page. */
// dirIn / dirOut: 1 = page moves down (next section comes from below), -1 = back up to the top (comes from above)
const ScrollClip: React.FC<{ src: string; from: number; to: number; trim: number; first?: boolean; last?: boolean; h: number; dirIn?: number; dirOut?: number }> = ({ src, from, to, trim, first, last, h, dirIn = 1, dirOut = 1 }) => {
  const f = useCurrentFrame(); // absolute frame of the parent scene
  const a = first ? 0 : OV, b = last ? 0 : OV;
  const pin = first ? 1 : interpolate(f, [from - a, from + a], [0, 1], { ...clamp, easing: soft });
  const pout = last ? 0 : interpolate(f, [to - b, to + b], [0, 1], { ...clamp, easing: soft });
  // a clean push: the next section slides up exactly as the previous one leaves, both fully opaque
  const y = (1 - pin) * h * dirIn - pout * h * dirOut;
  return (
    <Sequence from={from - a} durationInFrames={to - from + a + b} layout="none">
      <div style={{ ...cover, transform: `translateY(${y}px)` }}>
        <OffthreadVideo src={staticFile(src)} trimBefore={Math.max(0, sec(trim) - a)} muted style={cover} />
      </div>
    </Sequence>
  );
};

/* ---------- 1–2: Aqua Bianca footage, full bleed ---------- */
const Footage: React.FC = () => {
  const f = useCurrentFrame();
  const fadeB = interpolate(f, [T.ekran - 4, T.ekran + 4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <div style={{ ...cover, transform: `scale(${interpolate(f, [0, T.ekran + 6], [1.18, 1.02], clamp)})` }}>
        <OffthreadVideo src={staticFile('footage/vodopad.mp4')} trimBefore={sec(19)} muted style={cover} />
      </div>
      <div style={{ ...cover, opacity: fadeB, transform: `scale(${interpolate(f, [T.ekran, T.morph], [1.14, 1.0], clamp)})` }}>
        <OffthreadVideo src={staticFile('footage/priroda.mp4')} trimBefore={sec(17.2) - T.ekran} muted style={cover} />
      </div>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,.38) 30%, rgba(0,0,0,.30) 55%, rgba(0,0,0,.45) 100%)' }} />
    </AbsoluteFill>
  );
};

/* ---------- 3–4: footage becomes the phone, then the site ---------- */
const PHONE = { w: 600, h: 1262, bezel: 16, r: 86 };
const PhoneScene: React.FC = () => {
  const f = useCurrentFrame(); // local, starts at T.morph
  const p = interpolate(f, [0, 30], [0, 1], { ...clamp, easing: ease });
  const x0 = (1080 - PHONE.w) / 2, y0 = 560;
  const x = interpolate(p, [0, 1], [0, x0]);
  const y = interpolate(p, [0, 1], [0, y0]);
  const w = interpolate(p, [0, 1], [1080, PHONE.w]);
  const h = interpolate(p, [0, 1], [1920, PHONE.h]);
  const r = interpolate(p, [0, 1], [0, PHONE.r]);
  const bezel = interpolate(p, [0, 1], [0, PHONE.bezel]);
  const site = interpolate(f, [28, 40], [0, 1], clamp);
  const storyAt = T.story - T.morph;
  // exit: slide down and away for the desktop part
  const exit = interpolate(f, [T.showcase - T.morph - 10, T.showcase - T.morph + 14], [0, 1], { ...clamp, easing: soft });
  const float = Math.sin(f / 22) * 6 * p;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.paper, opacity: interpolate(f, [4, 26], [0, 1], clamp) }} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${exit * -1150}px) translateY(${float}px) scale(${1 - exit * 0.08})`, opacity: 1 - exit * 0.3 }}>
        <Phone x={x} y={y} w={w} h={h} r={r} bezel={bezel} shadow={p}>
          {/* river keeps running inside the phone, then the live site hero takes over */}
          <OffthreadVideo src={staticFile('footage/priroda.mp4')} trimBefore={sec(21.0)} muted style={cover} />
          <div style={{ ...cover, opacity: site }}>
            <ScrollClip src="rec/hero-m.mp4" from={0} to={storyAt} trim={0.6} first h={PHONE.h} />
            <ScrollClip src="rec/story-m.mp4" from={storyAt} to={storyAt + 200} trim={3.0} last h={PHONE.h} />
          </div>
        </Phone>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 5–7: desktop recordings in a browser window ---------- */
const BW = 980, BH = 50 + Math.round(BW * 900 / 1440);
const LEAD = 10; // the browser starts sliding in this many frames before T.showcase
// [recording, from, to, trim seconds, direction it arrives from] — everything plays at real speed.
// The language switch lives in the header, so that clip comes back down from the top of the page.
const CLIPS: [string, number, number, number, number?][] = [
  ['showcase-d', T.showcase - LEAD, T.minerals, 0],
  ['minerals-d', T.minerals, T.tiles, 1.3],
  ['tiles-d', T.tiles, T.venues, 0.4],
  ['venues-d', T.venues, T.partner, 0.4],
  ['partner-d', T.partner, T.lang, 0.4],
  ['lang-d', T.lang, T.outro, 0.5, -1],
];
const DesktopScene: React.FC = () => {
  const local = useCurrentFrame(); // starts LEAD frames before T.showcase
  const f = local - LEAD; // 0 at T.showcase
  const enter = interpolate(f, [-10, 14], [0, 1], { ...clamp, easing: soft });
  const exit = interpolate(f, [T.outro - T.showcase - 8, T.outro - T.showcase + 14], [0, 1], { ...clamp, easing: soft });
  const langAt = T.lang - T.showcase;
  // on the language beat, push in on the MNE / EN switch in the header
  const zoom = interpolate(f, [langAt + 6, langAt + 26], [0, 1], { ...clamp, easing: soft });
  // bring the EN switch (95.4% / 4.6% of the page) to the middle of the window while scaling up
  const S = 1 + zoom * 2.2, CH = BH - 50;
  const px = 0.954 * BW, py = 0.046 * CH;
  // keep the page covering the whole window (no empty edges)
  const tx = Math.min(0, Math.max(BW - BW * S, (BW * 0.5 - px * S) * zoom));
  const ty = Math.min(0, Math.max(CH - CH * S, (CH * 0.32 - py * S) * zoom));
  const x = (1080 - BW) / 2, y = 700;
  return (
    <AbsoluteFill style={{ transform: `translateX(${(1 - enter) * 1150}px) translateY(${exit * -260}px) scale(${1 - exit * 0.12})`, opacity: 1 - exit }}>
      <Browser x={x} y={y} w={BW} h={BH}>
        <div style={{ ...cover, transformOrigin: '0 0', transform: `translate(${tx}px, ${ty}px) scale(${S})` }}>
          {CLIPS.map(([src, from, to, trim, dir = 1], i) => (
            <ScrollClip key={src} src={`rec/${src}.mp4`} from={from - T.showcase + LEAD} to={to - T.showcase + LEAD} trim={trim} first={i === 0} last={i === CLIPS.length - 1} h={BH - 50} dirIn={dir} dirOut={CLIPS[i + 1]?.[4] ?? 1} />
          ))}
        </div>
      </Browser>
    </AbsoluteFill>
  );
};

/* ---------- 8: lockup ---------- */
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (d: number) => spring({ frame: f - d, fps, config: { damping: 200, stiffness: 140 } });
  const pop = (d: number): React.CSSProperties => ({ opacity: s(d), transform: `translateY(${(1 - s(d)) * 60}px)` });
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        <Img src={staticFile('logo/vaky.png')} style={{ width: 640, ...pop(2) }} />
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 84, lineHeight: 1, color: C.red, ...pop(8) }}>×</div>
        <Img src={staticFile('logo/aquabianca.png')} style={{ width: 430, ...pop(12) }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1235, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: C.white, background: C.red, borderRadius: 999, padding: '20px 40px', ...pop(22) }}>Izrada sajtova · Crna Gora</div>
      </div>
    </AbsoluteFill>
  );
};

export const IzvorDoEkrana: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <Sequence durationInFrames={T.morph + 32}>
        <Footage />
      </Sequence>
      <Sequence from={T.morph} durationInFrames={T.showcase - T.morph + 20}>
        <PhoneScene />
      </Sequence>
      <Sequence from={T.showcase - LEAD} durationInFrames={T.outro - T.showcase + LEAD + 18}>
        <DesktopScene />
      </Sequence>
      <Sequence from={T.outro}>
        <Outro />
      </Sequence>

      {/* captions, on the beat */}
      <Sequence durationInFrames={T.morph + 2}>
        <Caption lines={[words('Od izvora')]} y={640} size={164} width={960} shadow color={C.white} delay={6} exitAt={T.morph - 8} />
      </Sequence>
      <Sequence from={T.ekran} durationInFrames={T.morph - T.ekran + 2}>
        <Caption lines={[words('do ekrana.', ['ekrana.'])]} y={640 + 172} size={164} width={960} shadow color={C.white} exitAt={T.morph - T.ekran - 8} />
      </Sequence>
      <Sequence from={T.morph + 22} durationInFrames={T.story - T.morph - 20}>
        <Caption lines={[words('Novi sajt za'), words('Aqua Biancu.', ['Aqua', 'Biancu.'])]} y={300} size={100} exitAt={T.story - T.morph - 30} />
      </Sequence>
      <Sequence from={T.story} durationInFrames={T.showcase - T.story}>
        <Caption lines={[words('Interaktivna priča'), words('o proizvodu.', ['o', 'proizvodu.'])]} y={300} size={96} width={940} exitAt={T.showcase - T.story - 10} />
      </Sequence>
      <Sequence from={T.showcase + 6} durationInFrames={T.minerals - T.showcase - 6}>
        <Caption lines={[words('13 proizvoda.'), words('Jedan izvor.', ['izvor.'])]} y={330} size={104} exitAt={T.minerals - T.showcase - 16} />
      </Sequence>
      <Sequence from={T.minerals} durationInFrames={T.tiles - T.minerals}>
        <Caption lines={[words('Mineralni sastav,'), words('jasno prikazan.', ['jasno', 'prikazan.'])]} y={330} size={100} width={940} exitAt={T.tiles - T.minerals - 10} />
      </Sequence>
      <Sequence from={T.tiles} durationInFrames={T.venues - T.tiles}>
        <Caption lines={[words('Svaka kategorija'), words('u pokretu.', ['u', 'pokretu.'])]} y={330} size={100} width={940} exitAt={T.venues - T.tiles - 10} />
      </Sequence>
      <Sequence from={T.venues} durationInFrames={T.partner - T.venues}>
        <Caption lines={[words('Na stolovima širom'), words('Crne Gore.', ['Crne', 'Gore.'])]} y={330} size={96} width={940} exitAt={T.partner - T.venues - 10} />
      </Sequence>
      <Sequence from={T.partner} durationInFrames={T.lang - T.partner}>
        <Caption lines={[words('Upiti partnera,'), words('direktno sa sajta.', ['direktno', 'sa', 'sajta.'])]} y={330} size={96} width={940} exitAt={T.lang - T.partner - 10} />
      </Sequence>
      <Sequence from={T.lang} durationInFrames={T.outro - T.lang}>
        <Caption lines={[words('Dva jezika.'), words('MNE · EN', ['MNE', '·', 'EN'])]} y={330} size={104} exitAt={T.outro - T.lang - 10} />
      </Sequence>

      {/* collab label while the site is on screen */}
      <Sequence from={T.morph + 20} durationInFrames={T.outro - T.morph - 20}>
        <Eyebrow text="vaky.me × Aqua Bianca" opacity={interpolate(f, [T.morph + 20, T.morph + 34, T.outro - 10, T.outro], [0, 1, 1, 0], clamp)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { SAFE };
