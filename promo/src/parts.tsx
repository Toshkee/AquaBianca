import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { C, FONT, LABEL_FONT, SAFE } from './brand';

export type Word = { t: string; hi?: boolean };
export const words = (s: string, hi: string[] = []): Word[] => s.split(' ').map((t) => ({ t, hi: hi.includes(t) }));

/* Kinetic caption in the vaky.me style: heavy grotesk, one red highlight box. */
export const Caption: React.FC<{
  lines: Word[][];
  y: number;
  size?: number;
  color?: string;
  delay?: number;
  exitAt?: number;
  width?: number;
  shadow?: boolean;
}> = ({ lines, y, size = 118, color = C.ink, delay = 0, exitAt, width = SAFE.right - SAFE.left, shadow = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let i = 0;
  const out = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  return (
    <div style={{ position: 'absolute', left: SAFE.left, top: y, width, fontFamily: FONT, textShadow: shadow ? '0 4px 40px rgba(0,0,0,.45)' : undefined, fontWeight: 800, fontSize: size, lineHeight: 0.98, letterSpacing: '-0.035em', color, opacity: 1 - out, transform: `translateY(${-40 * out}px)` }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: 'flex', flexWrap: 'wrap', columnGap: size * 0.24, marginBottom: size * 0.08 }}>
          {line.map((w, wi) => {
            const joinNext = w.hi && line[wi + 1]?.hi;
            const d = delay + i++ * 3;
            const s = spring({ frame: frame - d, fps, config: { damping: 200, stiffness: 180, mass: 0.6 } });
            const box = spring({ frame: frame - d - 4, fps, config: { damping: 200, stiffness: 160 } });
            return (
              <span key={w.t + d} style={{ position: 'relative', display: 'inline-block' }}>
                {w.hi && (
                  <span style={{ position: 'absolute', left: -size * 0.1, right: joinNext ? -size * 0.36 : -size * 0.1, top: size * 0.06, bottom: size * 0.02, background: C.red, transformOrigin: 'left center', transform: `scaleX(${box})` }} />
                )}
                <span style={{ position: 'relative', display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.06, verticalAlign: 'top' }}>
                  <span style={{ display: 'inline-block', color: w.hi ? C.white : color, transform: `translateY(${(1 - s) * 105}%)` }}>{w.t}</span>
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* Small label at the top of the safe area, like the vaky.me post headers. */
export const Eyebrow: React.FC<{ text: string; color?: string; opacity?: number }> = ({ text, color = C.ink, opacity = 1 }) => (
  <div style={{ position: 'absolute', left: SAFE.left, top: SAFE.top - 20, display: 'flex', alignItems: 'center', gap: 16, fontFamily: LABEL_FONT, fontWeight: 700, fontSize: 26, letterSpacing: '0.18em', textTransform: 'uppercase', color, opacity }}>
    <span style={{ width: 14, height: 14, borderRadius: 7, background: C.red }} />
    {text}
  </div>
);

/* Phone frame. Box is the outer bezel; radius shrinks with it. */
export const Phone: React.FC<{ x: number; y: number; w: number; h: number; r: number; bezel: number; children: React.ReactNode; shadow?: number }> = ({ x, y, w, h, r, bezel, children, shadow = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, background: '#0b0b0b', padding: bezel, boxShadow: `0 ${60 * shadow}px ${120 * shadow}px -40px rgba(16,16,16,${0.45 * shadow})` }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: Math.max(0, r - bezel), overflow: 'hidden', background: '#000' }}>
      {children}
    </div>
  </div>
);

/* Browser window for desktop recordings. */
export const Browser: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 22, overflow: 'hidden', background: C.white, boxShadow: '0 50px 110px -40px rgba(16,16,16,.45), 0 0 0 1px rgba(16,16,16,.08)', ...style }}>
    <div style={{ height: 50, background: C.paper2, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', borderBottom: `1px solid ${C.line}` }}>
      {['#e2574c', '#e9b13b', '#4cb04f'].map((c) => <span key={c} style={{ width: 15, height: 15, borderRadius: 8, background: c }} />)}
      <span style={{ marginLeft: 18, height: 28, flex: 1, maxWidth: 420, borderRadius: 14, background: C.white, display: 'flex', alignItems: 'center', padding: '0 16px', fontFamily: FONT, fontWeight: 500, fontSize: 18, color: C.muted }}>Aqua Bianca · novi sajt</span>
    </div>
    <div style={{ position: 'relative', height: h - 50, overflow: 'hidden' }}>{children}</div>
  </div>
);

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
