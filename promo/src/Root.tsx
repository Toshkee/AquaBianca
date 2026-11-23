import { Composition } from 'remotion';
import { IzvorDoEkrana, DURATION } from './IzvorDoEkrana';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="IzvorDoEkrana"
    component={IzvorDoEkrana}
    durationInFrames={DURATION}
    fps={30}
    width={1080}
    height={1920}
  />
);
