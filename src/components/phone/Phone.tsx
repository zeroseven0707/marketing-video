import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {captures} from '../../config/media';
import {brand} from '../../config/theme';

// Ukuran logis layar aplikasi (setara 390x844 pt). UI rekonstruksi digambar di ukuran ini.
export const SCREEN_W = 390;
export const SCREEN_H = 844;

type PhoneProps = {
  // Lebar HP di kanvas (px). Tinggi mengikuti rasio.
  width?: number;
  x?: number; // pusat
  y?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  opacity?: number;
  // Kunci slot screenshot asli di config/media.ts. Bila terisi, gambar asli dipakai.
  captureKey?: string;
  dark?: boolean; // warna status bar
  children?: React.ReactNode;
  glare?: number; // 0..1 posisi kilau
};

// Mockup smartphone dengan bezel, dynamic island, bayangan bertingkat, dan rotasi 3D.
export const Phone: React.FC<PhoneProps> = ({
  width = 560,
  x = 540,
  y = 1080,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
  opacity = 1,
  captureKey,
  dark = false,
  children,
  glare,
}) => {
  const bezel = width * 0.035;
  const screenW = width - bezel * 2;
  const k = screenW / SCREEN_W;
  const screenH = SCREEN_H * k;
  const height = screenH + bezel * 2;
  const radius = width * 0.14;
  const capture = captureKey ? captures[captureKey] : null;
  // Bayangan jatuh berlawanan dengan arah rotasi agar terasa ada kedalaman.
  const sx = -rotateY * 1.4;
  const sy = 40 + rotateX * 1.2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        opacity,
        transform: `perspective(2600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Bayangan lembut di lantai */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          transform: `translate(${sx}px, ${sy}px)`,
          boxShadow: `0 60px 120px rgba(42,18,32,0.28), 0 18px 40px rgba(173,20,87,0.18)`,
        }}
      />
      {/* Rangka */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          background: 'linear-gradient(145deg, #3A3440 0%, #17141B 45%, #2B2630 100%)',
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12), inset 0 0 0 5px #0E0C10',
        }}
      />
      {/* Tombol samping */}
      <div style={{position: 'absolute', right: -5, top: height * 0.22, width: 6, height: height * 0.1, borderRadius: 3, background: '#2B2630'}} />
      <div style={{position: 'absolute', left: -5, top: height * 0.18, width: 6, height: height * 0.06, borderRadius: 3, background: '#2B2630'}} />
      <div style={{position: 'absolute', left: -5, top: height * 0.26, width: 6, height: height * 0.09, borderRadius: 3, background: '#2B2630'}} />
      {/* Layar */}
      <div
        style={{
          position: 'absolute',
          left: bezel,
          top: bezel,
          width: screenW,
          height: screenH,
          borderRadius: radius - bezel,
          overflow: 'hidden',
          background: brand.bg,
        }}
      >
        {capture ? (
          <Img src={staticFile(capture)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <div style={{width: SCREEN_W, height: SCREEN_H, transform: `scale(${k})`, transformOrigin: 'top left', position: 'relative'}}>
            {children}
            <StatusBar dark={dark} />
          </div>
        )}
        {/* Dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 11 * k,
            left: '50%',
            width: 120 * k,
            height: 34 * k,
            marginLeft: -60 * k,
            borderRadius: 20 * k,
            background: '#000',
          }}
        />
        {/* Kilau kaca */}
        {glare !== undefined && (
          <AbsoluteFill style={{pointerEvents: 'none'}}>
            <div
              style={{
                position: 'absolute',
                top: -screenH * 0.2,
                bottom: -screenH * 0.2,
                width: screenW * 0.45,
                left: -screenW * 0.5 + glare * screenW * 1.6,
                transform: 'rotate(20deg)',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
              }}
            />
          </AbsoluteFill>
        )}
      </div>
    </div>
  );
};

const StatusBar: React.FC<{dark: boolean}> = ({dark}) => {
  const c = dark ? '#fff' : brand.ink;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 54,
        padding: '18px 30px 0 34px',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: '-apple-system, "Plus Jakarta Sans", sans-serif',
        fontWeight: 700,
        fontSize: 15,
        color: c,
        zIndex: 50,
      }}
    >
      <span>09.41</span>
      <span style={{display: 'flex', gap: 6, alignItems: 'center'}}>
        <svg width="18" height="11" viewBox="0 0 18 11">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.6} y={8 - i * 2.4} width="3.2" height={3 + i * 2.4} rx="0.8" fill={c} />
          ))}
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke={c} opacity="0.45" />
          <rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill={c} />
          <rect x="22.5" y="4" width="1.6" height="4" rx="0.8" fill={c} opacity="0.45" />
        </svg>
      </span>
    </div>
  );
};

// Indikator ketukan jari: lingkaran mengecil lalu riak keluar.
export const Tap: React.FC<{x: number; y: number; at: number; frame: number}> = ({x, y, at, frame}) => {
  const t = frame - at;
  if (t < -8 || t > 22) return null;
  const press = t < 0 ? (t + 8) / 8 : 1;
  const ripple = Math.max(0, t) / 22;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex: 100}}>
      <div
        style={{
          position: 'absolute',
          left: -26,
          top: -26,
          width: 52,
          height: 52,
          borderRadius: 26,
          background: 'rgba(28,27,34,0.28)',
          border: '2px solid rgba(255,255,255,0.8)',
          transform: `scale(${t < 0 ? 1.3 - press * 0.3 : 1 - ripple * 0.2})`,
          opacity: t < 0 ? press : 1 - ripple,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -26,
          top: -26,
          width: 52,
          height: 52,
          borderRadius: 26,
          border: `3px solid ${brand.pinkLight}`,
          transform: `scale(${1 + ripple * 1.8})`,
          opacity: t < 0 ? 0 : 1 - ripple,
        }}
      />
    </div>
  );
};
