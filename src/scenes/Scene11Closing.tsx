import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, float, pop, prog} from '../animations/anim';
import {Logo} from '../components/brand/Brand';
import {BrandBackdrop, LightSweep, SoftParticles, SpeedLines} from '../components/bg/Backdrops';
import {CharStagger} from '../components/typography/Kinetic';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';
import {brand, font} from '../config/theme';

// Penutup: wordmark, tagline resmi, ajakan unduh, ajakan jadi mitra. Diam >= 1,5 detik di akhir.
export const Scene11Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoT = prog(frame, 10, 24);
  const cta = pop(frame, fps, 44, 15);
  const mitra = prog(frame, 58, 16);
  const url = prog(frame, 66, 16);
  const region = prog(frame, 74, 16);
  const fadeOut = interpolate(frame, [150, 162], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <BrandBackdrop />
      <SoftParticles count={10} seed="s11" />
      <SpeedLines y={700} start={0} length={680} thickness={18} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', clipPath: `inset(-10% ${(1 - logoT) * 50}% -10% ${(1 - logoT) * 50}%)`, transform: `translateY(${float(frame, 100, 5)}px) scale(${0.95 + 0.05 * logoT})`}}>
        <Logo src={brandFiles.wordmarkLarge} width={760} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 830}}>
        <CharStagger text={copy.S11.tagline} delay={26} size={70} gradient />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 990, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            fontFamily: font.family,
            fontWeight: 800,
            fontSize: 52,
            color: '#fff',
            background: `linear-gradient(135deg, ${brand.pink}, ${brand.pinkLogo} 60%, ${brand.pinkLight})`,
            padding: '30px 72px',
            borderRadius: 999,
            boxShadow: '0 24px 48px rgba(216,27,96,0.4)',
            transform: `scale(${cta})`,
            opacity: cta,
          }}
        >
          {copy.S11.ctaCustomer}
          <LightSweep start={70} dur={30} width={140} opacity={0.9} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 1170, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, opacity: mitra, transform: `translateY(${(1 - mitra) * 18}px)`}}>
        <Logo src={brandFiles.mitraIcon} width={84} style={{borderRadius: 22}} />
        <div style={{fontFamily: font.family, fontWeight: 700, fontSize: 36, color: brand.ink, lineHeight: 1.2}}>{copy.S11.ctaMitra}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1310, textAlign: 'center', fontFamily: font.family, fontWeight: 700, fontSize: 40, color: brand.pink, opacity: url, letterSpacing: 0.5}}>{copy.S11.url}</div>
      {copy.S11.region && (
        <div style={{position: 'absolute', left: 80, right: 80, top: 1400, textAlign: 'center', fontFamily: font.family, fontWeight: 600, fontSize: 32, color: brand.text2, opacity: region}}>{copy.S11.region}</div>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
