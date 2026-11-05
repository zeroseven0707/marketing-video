import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, EASE, float, pop, prog} from '../animations/anim';
import {Logo} from '../components/brand/Brand';
import {BrandBackdrop, LightSweep, SoftParticles, SpeedLines} from '../components/bg/Backdrops';
import {Headline} from '../components/typography/Headline';
import {CharStagger} from '../components/typography/Kinetic';
import {FoodArt} from '../components/ui/kit';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';
import {brand} from '../config/theme';

const EXIT = 66;

// Menu warung melayang mengelilingi pusat layar.
const FOODS = [
  {kind: 0, x: 210, y: 1130, size: 230},
  {kind: 1, x: 860, y: 1060, size: 210},
  {kind: 2, x: 300, y: 1520, size: 190},
  {kind: 3, x: 790, y: 1470, size: 240},
];

// Hook video pelanggan: "Lapar, tapi malas keluar?" lalu jawaban "Pesan aja di Mihape." + ikon aplikasi.
export const SceneC01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const answer = prog(frame, EXIT, 16, EASE);
  const icon = pop(frame, fps, EXIT + 10, 13);
  return (
    <AbsoluteFill>
      <BrandBackdrop tint="pink" />
      <SoftParticles count={12} seed="c01" />
      {FOODS.map((f, i) => {
        const t = pop(frame, fps, 6 + i * 5, 14);
        // Saat jawaban muncul, menu tersedot ke ikon aplikasi
        const x = interpolate(answer, [0, 1], [f.x, 540]);
        const y = interpolate(answer, [0, 1], [f.y, 1300]) + float(frame, 70, 12, i * 20) * (1 - answer);
        const s = t * (1 - answer * 0.85);
        return (
          <div key={i} style={{position: 'absolute', left: x - f.size / 2, top: y - f.size / 2, transform: `scale(${s}) rotate(${(1 - t) * 20 + float(frame, 90, 6, i * 15)}deg)`, opacity: 1 - answer}}>
            <div style={{width: f.size, height: f.size, borderRadius: f.size / 2, background: '#fff', boxShadow: '0 24px 48px rgba(42,18,32,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <FoodArt kind={f.kind} size={f.size * 0.78} />
            </div>
          </div>
        );
      })}
      <Headline lines={copy.C01.lines} delay={4} exitAt={EXIT - 6} size={112} highlight={[[1, 1]]} top={420} />
      {answer > 0 && (
        <>
          <SpeedLines y={760} start={EXIT} length={620} thickness={18} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 560}}>
            <CharStagger text={copy.C01.punch} delay={EXIT + 2} size={96} gradient />
          </div>
          <div style={{position: 'absolute', left: 540 - 150, top: 1300 - 150, width: 300, height: 300, transform: `scale(${icon}) rotate(${(1 - icon) * -14}deg)`}}>
            <div style={{width: 300, height: 300, borderRadius: 70, overflow: 'hidden', boxShadow: '0 40px 80px rgba(216,27,96,0.3)'}}>
              <Logo src={brandFiles.appIcon} width={300} />
              <LightSweep start={EXIT + 24} dur={22} width={160} opacity={0.9} />
            </div>
          </div>
          {/* Riak dari ikon */}
          <div
            style={{
              position: 'absolute',
              left: 540 - 300,
              top: 1300 - 300,
              width: 600,
              height: 600,
              borderRadius: '50%',
              border: `6px solid ${brand.pinkLight}`,
              transform: `scale(${0.3 + prog(frame, EXIT + 10, 30) * 1.3})`,
              opacity: interpolate(prog(frame, EXIT + 10, 30), [0, 1], [0.8, 0], CLAMP),
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
