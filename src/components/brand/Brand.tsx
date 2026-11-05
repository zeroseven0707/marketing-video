import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {prog} from '../../animations/anim';
import {copy} from '../../config/copy';
import {footage} from '../../config/media';
import {brand, font} from '../../config/theme';

// Logo resmi dari file PNG (tidak digambar ulang). Rasio dijaga lewat lebar saja.
export const Logo: React.FC<{src: string; width: number; style?: React.CSSProperties}> = ({src, width, style}) => (
  <Img src={staticFile(src)} style={{width, height: 'auto', display: 'block', ...style}} />
);

// Pin lokasi (motif titik huruf "i"), digambar dari path favicon.svg merek.
export const Pin: React.FC<{size: number; color?: string; dot?: string}> = ({size, color = brand.pink, dot = '#fff'}) => (
  <svg width={size} height={size} viewBox="15 10 34 44">
    <path d="M32 12c-8.3 0-15 6.5-15 14.6C17 37.5 32 52 32 52s15-14.5 15-25.4C47 18.5 40.3 12 32 12z" fill={color} />
    <circle cx="32" cy="26.5" r="6" fill={dot} />
  </svg>
);

// Footage asli bila slot diisi di config/media.ts; bila tidak, tampilkan ilustrasi (children).
export const FootageSlot: React.FC<{sceneId: string; children: React.ReactNode}> = ({sceneId, children}) => {
  const src = footage[sceneId];
  if (!src) return <>{children}</>;
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

// Label jujur di atas UI rekonstruksi.
export const SimTag: React.FC<{delay?: number; dark?: boolean; y?: number}> = ({delay = 6, dark, y = 214}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 14);
  if (!copy.simTag) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', opacity: t * 0.9}}>
      <div
        style={{
          fontFamily: font.family,
          fontSize: 24,
          fontWeight: 600,
          color: dark ? 'rgba(255,255,255,0.75)' : brand.text2,
          background: dark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)',
          padding: '8px 18px',
          borderRadius: 999,
        }}
      >
        {copy.simTag}
      </div>
    </div>
  );
};
