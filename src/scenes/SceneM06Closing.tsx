import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, pop, prog} from '../animations/anim';
import {Logo} from '../components/brand/Brand';
import {BrandBackdrop, LightSweep, SoftParticles, SpeedLines} from '../components/bg/Backdrops';
import {WordReveal} from '../components/typography/Kinetic';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';
import {brand, font} from '../config/theme';

// Penutup video mitra: wordmark Mihape Mitra, tiga langkah daftar, ajakan daftar. Diam >= 1,5 dtk di akhir.
export const SceneM06Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const logoT = prog(frame, 6, 24);
  const cta = pop(frame, fps, 84, 15);
  const url = prog(frame, 98, 16);
  const region = prog(frame, 106, 16);
  const fadeOut = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], CLAMP);
  return (
    <AbsoluteFill>
      <BrandBackdrop />
      <SoftParticles count={10} seed="m06" />
      <SpeedLines y={560} start={0} length={680} thickness={18} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', clipPath: `inset(-10% ${(1 - logoT) * 50}% -10% ${(1 - logoT) * 50}%)`, transform: `scale(${0.95 + 0.05 * logoT})`}}>
        <Logo src={brandFiles.mitraWordmark} width={640} />
      </div>
      <div style={{position: 'absolute', left: 90, right: 90, top: 640}}>
        <WordReveal text={copy.M06.headline} delay={20} size={66} align="center" highlight={[0]} lineHeight={1.15} />
      </div>
      {/* Tiga langkah daftar, tersambung garis */}
      <div style={{position: 'absolute', left: 170, top: 870, width: 8, height: interpolate(prog(frame, 36, 40), [0, 1], [0, 300]), background: brand.pinkBorder, borderRadius: 4}} />
      {copy.M06.steps.map((step, i) => {
        const t = pop(frame, fps, 36 + i * 14, 15);
        return (
          <div key={step} style={{position: 'absolute', left: 120, top: 820 + i * 150, display: 'flex', alignItems: 'center', gap: 30, opacity: t, transform: `translateX(${(1 - t) * -60}px)`}}>
            <div style={{width: 108, height: 108, borderRadius: 54, background: `linear-gradient(135deg, ${brand.pink}, ${brand.pinkLight})`, color: '#fff', fontFamily: font.family, fontWeight: 800, fontSize: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 32px rgba(216,27,96,0.32)', transform: `scale(${t})`}}>
              {i + 1}
            </div>
            <div style={{fontFamily: font.family, fontWeight: 700, fontSize: 46, color: brand.ink, letterSpacing: -0.8}}>{step}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            fontFamily: font.family,
            fontWeight: 800,
            fontSize: 54,
            color: '#fff',
            background: `linear-gradient(135deg, ${brand.pink}, ${brand.pinkLogo} 60%, ${brand.pinkLight})`,
            padding: '32px 72px',
            borderRadius: 999,
            boxShadow: '0 24px 48px rgba(216,27,96,0.4)',
            transform: `scale(${cta})`,
            opacity: cta,
          }}
        >
          {copy.M06.cta}
          <LightSweep start={108} dur={30} width={150} opacity={0.9} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1490, textAlign: 'center', fontFamily: font.family, fontWeight: 700, fontSize: 44, color: brand.pink, opacity: url, letterSpacing: 0.5}}>{copy.M06.url}</div>
      {copy.M06.region && (
        <div style={{position: 'absolute', left: 80, right: 80, top: 1580, textAlign: 'center', fontFamily: font.family, fontWeight: 600, fontSize: 32, color: brand.text2, opacity: region}}>{copy.M06.region}</div>
      )}
      <AbsoluteFill style={{background: '#fff', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
