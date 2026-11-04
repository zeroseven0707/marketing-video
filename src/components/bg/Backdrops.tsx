import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {float} from '../../animations/anim';
import {brand} from '../../config/theme';

// Latar merek terang: gradien hero, orb blur yang melayang, dan grid titik pink
// (meniru hero landing, mihp-backend/public/css/landing.css:89-94).
export const BrandBackdrop: React.FC<{tint?: 'light' | 'pink'; grid?: boolean}> = ({tint = 'light', grid = true}) => {
  const frame = useCurrentFrame();
  const orbs = [
    {x: 160, y: 380, r: 520, c: '#FFC1D6', p: 220},
    {x: 940, y: 820, r: 600, c: '#FFE0EB', p: 260},
    {x: 300, y: 1560, r: 560, c: `${brand.pinkLight}55`, p: 300},
  ];
  return (
    <AbsoluteFill style={{background: tint === 'pink' ? brand.pinkSoft : `linear-gradient(180deg, ${brand.bgHero} 0%, #FFFFFF 100%)`}}>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: o.x - o.r / 2 + float(frame, o.p, 60, i * 40),
            top: o.y - o.r / 2 + float(frame, o.p * 1.3, 50, i * 70),
            width: o.r,
            height: o.r,
            borderRadius: '50%',
            background: o.c,
            filter: 'blur(90px)',
            opacity: 0.9,
          }}
        />
      ))}
      {grid && <DotGrid />}
    </AbsoluteFill>
  );
};

// Grid titik yang bergeser pelan, memudar ke bawah.
export const DotGrid: React.FC<{color?: string; opacity?: number; speed?: number}> = ({color = brand.pink, opacity = 0.16, speed = 0.25}) => {
  const frame = useCurrentFrame();
  const off = (frame * speed) % 48;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${color} 2.4px, transparent 2.6px)`,
        backgroundSize: '48px 48px',
        backgroundPosition: `${off}px ${off}px`,
        opacity,
        WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 35%, transparent 80%)',
        maskImage: 'linear-gradient(180deg, black 0%, black 35%, transparent 80%)',
      }}
    />
  );
};

// Tiga garis kecepatan (motif kiri huruf "M" pada logo) yang melesat lewat.
export const SpeedLines: React.FC<{y: number; start: number; color?: string; length?: number; dir?: 1 | -1; thickness?: number}> = ({
  y,
  start,
  color = brand.pink,
  length = 520,
  dir = 1,
  thickness = 14,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {[0, 1, 2].map((i) => {
        const t = (frame - start - i * 3) / 22;
        if (t < 0 || t > 1) return null;
        const x = dir === 1 ? -length + t * (1080 + length * 2) : 1080 + length - t * (1080 + length * 2);
        const w = length * [1, 0.72, 0.46][i];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y + i * (thickness + 16),
              width: w,
              height: thickness,
              borderRadius: thickness,
              background: `linear-gradient(${dir === 1 ? 90 : 270}deg, transparent, ${color})`,
              opacity: Math.sin(t * Math.PI),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Partikel halus (titik pink kecil) yang naik pelan. Jumlah sedikit agar tidak mengganggu.
export const SoftParticles: React.FC<{count?: number; color?: string; seed?: string}> = ({count = 14, color = brand.pinkLight, seed = 'p'}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const speed = 0.4 + random(`${seed}s${i}`) * 0.8;
        const y = 1960 - ((random(`${seed}y${i}`) * 1960 + frame * speed) % 2000);
        const r = 4 + random(`${seed}r${i}`) * 8;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + float(frame, 120 + i * 9, 18, i * 13),
              top: y,
              width: r,
              height: r,
              borderRadius: '50%',
              background: color,
              opacity: 0.25 + random(`${seed}o${i}`) * 0.3,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Kilau cahaya diagonal yang menyapu satu kali (untuk logo/kartu).
export const LightSweep: React.FC<{start: number; dur?: number; width?: number; opacity?: number}> = ({start, dur = 26, width = 260, opacity = 0.55}) => {
  const frame = useCurrentFrame();
  const t = (frame - start) / dur;
  if (t < 0 || t > 1) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden', mixBlendMode: 'soft-light'}}>
      <div
        style={{
          position: 'absolute',
          top: -400,
          bottom: -400,
          left: -width + t * (1080 + width * 2),
          width,
          transform: 'rotate(18deg)',
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,${opacity}), transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Vignette lembut + grain tipis agar footage/ilustrasi terasa sinematik.
export const CinematicGrade: React.FC<{strength?: number}> = ({strength = 0.35}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(42,18,32,${strength}) 100%)`,
    }}
  />
);
