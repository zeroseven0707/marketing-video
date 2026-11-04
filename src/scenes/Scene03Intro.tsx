import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, EASE, float, pop, prog} from '../animations/anim';
import {Logo} from '../components/brand/Brand';
import {BrandBackdrop, LightSweep, SoftParticles, SpeedLines} from '../components/bg/Backdrops';
import {CharStagger, WordReveal} from '../components/typography/Kinetic';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';
import {brand} from '../config/theme';

// Pengenalan merek: garis kecepatan melesat, ikon aplikasi muncul, lalu wordmark + tagline resmi.
export const Scene03Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const iconIn = pop(frame, fps, 8, 14);
  const lift = prog(frame, 40, 22, EASE);
  const iconY = interpolate(lift, [0, 1], [880, 640]);
  const iconScale = interpolate(lift, [0, 1], [1.25, 0.82]) * iconIn;
  const wordT = prog(frame, 46, 24);
  const ring = prog(frame, 10, 36);
  return (
    <AbsoluteFill>
      <BrandBackdrop />
      <SoftParticles count={12} seed="s03" />
      <SpeedLines y={840} start={0} length={700} thickness={20} />
      <SpeedLines y={1010} start={6} length={520} dir={-1} color={brand.pinkLight} />
      {/* Riak pink dari ikon */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 300,
          top: 880 - 300,
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: `6px solid ${brand.pinkLight}`,
          transform: `scale(${0.3 + ring * 1.4})`,
          opacity: (1 - ring) * 0.8,
        }}
      />
      <div style={{position: 'absolute', left: 540 - 150, top: iconY - 150 + float(frame, 80, 6), width: 300, height: 300, transform: `scale(${iconScale}) rotate(${(1 - iconIn) * -12}deg)`}}>
        <div style={{width: 300, height: 300, borderRadius: 70, overflow: 'hidden', boxShadow: '0 40px 80px rgba(216,27,96,0.28)'}}>
          <Logo src={brandFiles.appIcon} width={300} />
          <LightSweep start={24} dur={24} width={160} opacity={0.9} />
        </div>
      </div>
      {/* Wordmark terbuka lewat mask dari tengah */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 830, display: 'flex', justifyContent: 'center', clipPath: `inset(-10% ${(1 - wordT) * 50}% -10% ${(1 - wordT) * 50}%)`, opacity: interpolate(wordT, [0, 0.2], [0, 1], CLAMP), transform: `scale(${0.94 + 0.06 * wordT})`}}>
        <Logo src={brandFiles.wordmarkLarge} width={760} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1110}}>
        <CharStagger text={copy.S03.tagline} delay={72} size={76} gradient />
      </div>
      <div style={{position: 'absolute', left: 120, right: 120, top: 1230}}>
        <WordReveal text={copy.S03.sub} delay={96} size={46} weight={600} color={brand.text2} align="center" stagger={3} lineHeight={1.25} />
      </div>
    </AbsoluteFill>
  );
};
