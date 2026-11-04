import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {CLAMP, EASE, EASE_INOUT, float, prog} from '../animations/anim';
import {FootageSlot, Logo} from '../components/brand/Brand';
import {Phone} from '../components/phone/Phone';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';
import {brand, font} from '../config/theme';

const PHONE = {w: 500, x: 540, y: 1040};
const FLOOR = 1640; // garis lantai studio; pantulan dicerminkan di sini

// Product showcase premium: studio gelap, cahaya pink dramatis, HP berputar pelan ke depan.
export const Scene01Opening: React.FC = () => {
  const frame = useCurrentFrame();
  // Kamera: mulai dekat dari sudut miring, lalu mundur perlahan dan sedikit mendorong lagi di akhir.
  const reveal = prog(frame, 0, 120, EASE_INOUT);
  const camScale = interpolate(reveal, [0, 1], [1.32, 1]) * interpolate(frame, [120, 180], [1, 1.05], CLAMP);
  const camY = interpolate(reveal, [0, 1], [-120, 0]);
  const rotY = interpolate(reveal, [0, 1], [-38, -7]) + float(frame, 220, 1.2);
  const rotX = interpolate(reveal, [0, 1], [16, 5]);
  const rotZ = interpolate(reveal, [0, 1], [-7, 0]);
  const hover = float(frame, 150, 8);
  const wake = prog(frame, 58, 26, EASE);
  const glare = interpolate(frame, [24, 96], [0, 1], CLAMP);
  const keyLight = prog(frame, 4, 40);
  // Akhir scene: layar memancarkan cahaya terang agar dissolve ke Scene 2 (latar terang) mulus.
  const bloom = prog(frame, 138, 42, EASE_INOUT);
  // Teks keluar di frame 150 (sama seperti versi lama) agar tidak menumpuk dengan judul Scene 2.
  const textT = prog(frame, 92, 30) - prog(frame, 136, 14, EASE_INOUT);

  const phone = (
    <Phone width={PHONE.w} x={PHONE.x} y={PHONE.y + hover} rotateX={rotX} rotateY={rotY} rotateZ={rotZ} glare={glare} dark>
      <Wallpaper wake={wake} frame={frame} />
    </Phone>
  );

  return (
    <AbsoluteFill style={{background: '#060407'}}>
      <FootageSlot sceneId="S01Opening">
        <Studio keyLight={keyLight} frame={frame} />
        <Bokeh frame={frame} layer="back" />
        <AbsoluteFill style={{transform: `translateY(${camY}px) scale(${camScale})`}}>
          {/* Lampu belakang pink: membentuk rim light di tepi HP */}
          <div
            style={{
              position: 'absolute',
              left: PHONE.x - 420,
              top: PHONE.y - 640,
              width: 840,
              height: 1280,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at 50% 50%, ${brand.pinkLogo}AA 0%, ${brand.pink}55 35%, transparent 70%)`,
              filter: 'blur(60px)',
              opacity: 0.35 + keyLight * 0.5 + wake * 0.15,
            }}
          />
          {/* Pantulan di lantai mengkilap */}
          <AbsoluteFill
            style={{
              transform: 'scaleY(-1)',
              transformOrigin: `50% ${FLOOR}px`,
              opacity: 0.22,
              filter: 'blur(3px)',
              // Mask dihitung sebelum dicerminkan: hanya bagian bawah HP yang tampak, memudar ke atas.
              WebkitMaskImage: 'linear-gradient(180deg, transparent 66%, black 84%)',
              maskImage: 'linear-gradient(180deg, transparent 66%, black 84%)',
            }}
          >
            {phone}
          </AbsoluteFill>
          {/* Bayangan kontak lembut di bawah HP */}
          <div
            style={{
              position: 'absolute',
              left: PHONE.x - 260,
              top: FLOOR - 40,
              width: 520,
              height: 80,
              borderRadius: '50%',
              background: `radial-gradient(ellipse, ${brand.pink}66 0%, transparent 70%)`,
              filter: 'blur(18px)',
              opacity: 0.5 + wake * 0.4,
            }}
          />
          {phone}
        </AbsoluteFill>
        <Streak frame={frame} />
        <Bokeh frame={frame} layer="front" />
      </FootageSlot>
      {/* Vignette */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 65% at 50% 52%, transparent 45%, rgba(0,0,0,0.75) 100%)'}} />
      {/* Teks pembuka: 2 baris (Super App + Wilayah) muncul tajam dari blur */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 260,
          padding: '0 40px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          textAlign: 'center',
          fontFamily: font.family,
          opacity: textT,
          filter: `blur(${(1 - textT) * 14}px)`,
          transform: `translateY(${(1 - textT) * 24}px)`,
          textShadow: '0 10px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: interpolate(textT, [0, 1], [6, -1]),
            backgroundImage: `linear-gradient(100deg, #FFFFFF 10%, ${brand.pinkLight} 75%, ${brand.pinkLogo} 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {copy.S01.line1}
        </div>
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: 2,
            color: '#FFFFFF',
            opacity: 0.95,
          }}
        >
          {copy.S01.line2}
        </div>
      </div>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 60% at 50% 52%, #FFF7F0 0%, ${brand.pinkMuted} 45%, ${brand.pinkLight}00 100%)`,
          mixBlendMode: 'screen',
          opacity: bloom * 0.9,
        }}
      />
      <AbsoluteFill style={{background: '#000', opacity: 1 - prog(frame, 0, 20)}} />
    </AbsoluteFill>
  );
};

// Layar HP: mati (kaca gelap) lalu menyala ke wallpaper pink dengan simbol merek.
const Wallpaper: React.FC<{wake: number; frame: number}> = ({wake, frame}) => (
  <AbsoluteFill style={{background: '#050405'}}>
    <AbsoluteFill
      style={{
        opacity: wake,
        background: `radial-gradient(circle at 50% ${38 + float(frame, 200, 3)}%, ${brand.pinkLight} 0%, ${brand.pinkLogo} 30%, ${brand.pinkDark} 62%, #3A0A1E 100%)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 195 - 60,
        top: 330 - 60,
        opacity: wake,
        transform: `scale(${0.9 + wake * 0.1})`,
        filter: `drop-shadow(0 10px 30px rgba(0,0,0,0.3))`,
      }}
    >
      <Logo src={brandFiles.symbolWhite} width={120} />
    </div>
  </AbsoluteFill>
);

// Latar studio: spotlight dari atas, lantai mengkilap, cahaya pink tersebar.
const Studio: React.FC<{keyLight: number; frame: number}> = ({keyLight, frame}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 90% 55% at 50% 42%, #2A0C1C 0%, #12070D 45%, #060407 80%)`}} />
    {/* Berkas cahaya dari atas */}
    <div
      style={{
        position: 'absolute',
        left: 540 - 520,
        top: -200,
        width: 1040,
        height: 1900,
        clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
        background: `linear-gradient(180deg, ${brand.pinkLight}40 0%, ${brand.pink}18 55%, transparent 90%)`,
        filter: 'blur(40px)',
        opacity: keyLight * (0.85 + float(frame, 90, 0.05)),
      }}
    />
    {/* Lantai */}
    <div style={{position: 'absolute', left: 0, right: 0, top: FLOOR, bottom: 0, background: 'linear-gradient(180deg, #160910 0%, #060407 70%)'}} />
    <div
      style={{
        position: 'absolute',
        left: -100,
        right: -100,
        top: FLOOR - 2,
        height: 4,
        background: `linear-gradient(90deg, transparent, ${brand.pinkLight}66, transparent)`,
        filter: 'blur(2px)',
        opacity: keyLight,
      }}
    />
  </AbsoluteFill>
);

// Bokeh lensa: lapisan belakang kecil-redup, lapisan depan besar-blur (kesan depth of field).
const Bokeh: React.FC<{frame: number; layer: 'back' | 'front'}> = ({frame, layer}) => {
  const front = layer === 'front';
  const n = front ? 4 : 14;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const s = `${layer}${i}`;
        const r = front ? 140 + random(`r${s}`) * 160 : 20 + random(`r${s}`) * 60;
        const x = random(`x${s}`) * 1180 - 50 + frame * (front ? -1.6 : 0.25) * (random(`d${s}`) > 0.5 ? 1 : -1);
        const y = (front ? 200 + random(`y${s}`) * 1500 : 150 + random(`y${s}`) * 1300) + float(frame, 160 + i * 11, 14, i * 17);
        const pink = random(`c${s}`) > 0.35;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${pink ? brand.pinkLight : '#FFFFFF'} 0%, transparent 70%)`,
              filter: `blur(${front ? 30 : 6}px)`,
              opacity: (front ? 0.12 : 0.08 + random(`o${s}`) * 0.18) * prog(frame, 6 + i * 3, 30),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Kilatan cahaya anamorfik horizontal, sekali lewat saat kilau menyapu layar.
const Streak: React.FC<{frame: number}> = ({frame}) => {
  const t = prog(frame, 40, 46, EASE_INOUT);
  const a = Math.sin(t * Math.PI);
  return (
    <div
      style={{
        position: 'absolute',
        left: -200,
        right: -200,
        top: 860 + t * 80,
        height: 6,
        background: `linear-gradient(90deg, transparent 10%, ${brand.pinkLight} 45%, #fff 50%, ${brand.pinkLight} 55%, transparent 90%)`,
        filter: 'blur(3px)',
        opacity: a * 0.55,
        transform: `translateX(${(t - 0.5) * 300}px)`,
        boxShadow: `0 0 40px 10px ${brand.pink}55`,
      }}
    />
  );
};
