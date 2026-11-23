import { loadFont } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';

// vaky.me brand, taken from the vaky.me site tokens
export const C = {
  paper: '#faf8f4',
  paper2: '#f1ede6',
  ink: '#101010',
  muted: '#5c5c58',
  line: '#e2ded6',
  red: '#c1121f',
  white: '#ffffff',
};

export const { fontFamily: FONT } = loadFont('normal', {
  weights: ['500', '700', '800'],
  subsets: ['latin', 'latin-ext'],
});

// Instagram Reels safe area (1080x1920): text between y=230 and y=1440, keep the right 230 px clear
export const SAFE = { top: 230, bottom: 1440, left: 80, right: 1080 - 230 };

export const BEAT = 15; // 120 BPM at 30 fps

// small uppercase labels: Bricolage's capital Q breaks apart at this size, Manrope (the Aqua Bianca site font) stays clean
export const { fontFamily: LABEL_FONT } = loadManrope('normal', { weights: ['700'], subsets: ['latin', 'latin-ext'] });
