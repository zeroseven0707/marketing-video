import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, float, pop, prog} from '../animations/anim';
import {Logo} from '../components/brand/Brand';
import {BrandBackdrop, LightSweep, SoftParticles, SpeedLines} from '../components/bg/Backdrops';
import {CharStagger} from '../components/typography/Kinetic';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';
import {brand, font} from '../config/theme';

// Penutup video pelanggan: ikon + wordmark, tagline resmi, satu ajakan "Unduh Mihape". Diam >= 1,5 dtk di akhir.
export const SceneC06Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const icon = pop(frame, fps, 4, 14);
  const logoT = prog(frame, 14, 24);
  const cta = pop(frame, fps, 48, 15);
  const url = prog(frame, 64, 16);
  const region = prog(frame, 74, 16);
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <BrandBackdrop />
      <SoftParticles count={10} seed="c06" />
      <SpeedLines y={760} start={0} length={680} thickness={18} />
      <div style={{position: 'absolute', left: 540 - 110, top: 400, width: 220, height: 220, transform: `scale(${icon}) translateY(${float(frame, 100, 5)}px)`}}>
        <div style={{width: 220, height: 220, borderRadius: 52, overflow: 'hidden', boxShadow: '0 30px 60px rgba(216,27,96,0.28)'}}>
          <Logo src={brandFiles.appIcon} width={220} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 680, display: 'flex', justifyContent: 'center', clipPath: `inset(-10% ${(1 - logoT) * 50}% -10% ${(1 - logoT) * 50}%)`, transform: `scale(${0.95 + 0.05 * logoT})`}}>
        <Logo src={brandFiles.wordmarkLarge} width={700} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 930}}>
        <CharStagger text={copy.C06.tagline} delay={30} size={70} gradient />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1090, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            fontFamily: font.family,
            fontWeight: 800,
            fontSize: 60,
            color: '#fff',
            background: `linear-gradient(135deg, ${brand.pink}, ${brand.pinkLogo} 60%, ${brand.pinkLight})`,
            padding: '34px 84px',
            borderRadius: 999,
            boxShadow: '0 24px 48px rgba(216,27,96,0.4)',
            transform: `scale(${cta})`,
            opacity: cta,
          }}
        >
          {copy.C06.cta}
          <LightSweep start={72} dur={30} width={150} opacity={0.9} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1290, textAlign: 'center', fontFamily: font.family, fontWeight: 700, fontSize: 44, color: brand.pink, opacity: url, letterSpacing: 0.5}}>{copy.C06.url}</div>
      {copy.S11.region && (
        <div style={{position: 'absolute', left: 80, right: 80, top: 1390, textAlign: 'center', fontFamily: font.family, fontWeight: 600, fontSize: 32, color: brand.text2, opacity: region}}>{copy.S11.region}</div>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
