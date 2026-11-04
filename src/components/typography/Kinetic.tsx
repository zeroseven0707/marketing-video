import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, EASE, EASE_IN, prog} from '../../animations/anim';
import {brand, font} from '../../config/theme';

type Base = {
  delay?: number; // frame mulai masuk
  exitAt?: number; // frame mulai keluar (opsional)
  size?: number;
  weight?: number;
  color?: string;
  align?: 'left' | 'center';
  style?: React.CSSProperties;
};

const exitT = (frame: number, exitAt?: number, dur = 10) => (exitAt === undefined ? 0 : prog(frame, exitAt, dur, EASE_IN));

// Kata demi kata naik dari balik mask. `highlight` = indeks kata yang diberi gradien merek.
export const WordReveal: React.FC<Base & {text: string; stagger?: number; highlight?: number[]; lineHeight?: number}> = ({
  text,
  delay = 0,
  exitAt,
  stagger = 4,
  size = 88,
  weight = 800,
  color = brand.ink,
  align = 'left',
  highlight = [],
  lineHeight = 1.08,
  style,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  const out = exitT(frame, exitAt);
  return (
    <div
      style={{
        fontFamily: font.family,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: -size * 0.03,
        lineHeight,
        color,
        textAlign: align,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const t = prog(frame, delay + i * stagger, 16);
        const isHi = highlight.includes(i);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12}}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - t) * 105 + out * -40}%) rotate(${(1 - t) * 4}deg)`,
                opacity: interpolate(t, [0, 0.4], [0, 1], CLAMP) * (1 - out),
                ...(isHi
                  ? {
                      backgroundImage: `linear-gradient(100deg, ${brand.pink}, ${brand.pinkLight})`,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }
                  : null),
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// Huruf demi huruf: skala + opasitas bertahap.
export const CharStagger: React.FC<Base & {text: string; stagger?: number; gradient?: boolean}> = ({
  text,
  delay = 0,
  exitAt,
  stagger = 1.6,
  size = 120,
  weight = 800,
  color = brand.ink,
  align = 'center',
  gradient = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const out = exitT(frame, exitAt);
  return (
    <div
      style={{
        fontFamily: font.family,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: -size * 0.035,
        lineHeight: 1,
        color,
        textAlign: align,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {[...text].map((ch, i) => {
        const t = prog(frame, delay + i * stagger, 18);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - t) * size * 0.5}px) scale(${0.6 + 0.4 * t})`,
              opacity: t * (1 - out),
              filter: `blur(${(1 - t) * 8}px)`,
              ...(gradient
                ? {
                    backgroundImage: `linear-gradient(100deg, ${brand.pink}, ${brand.pinkLogo} 55%, ${brand.pinkLight})`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }
                : null),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

// Blok teks muncul lewat mask yang terbuka dari kiri.
export const MaskReveal: React.FC<{delay?: number; exitAt?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay = 0,
  exitAt,
  dur = 18,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, dur);
  const out = exitT(frame, exitAt);
  return (
    <div
      style={{
        clipPath: `inset(-20% ${(1 - t) * 100}% -20% ${out * 100}%)`,
        transform: `translateX(${(1 - t) * -24}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Pil kecil di atas judul.
export const Kicker: React.FC<{text: string; delay?: number; exitAt?: number; dark?: boolean; style?: React.CSSProperties}> = ({
  text,
  delay = 0,
  exitAt,
  dark = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, 16, EASE);
  const out = exitT(frame, exitAt);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 26px',
        borderRadius: 999,
        background: dark ? 'rgba(255,255,255,0.14)' : brand.pinkSoft,
        border: `2px solid ${dark ? 'rgba(255,255,255,0.28)' : brand.pinkBorder}`,
        color: dark ? '#fff' : brand.pinkDark,
        fontFamily: font.family,
        fontWeight: 700,
        fontSize: 32,
        letterSpacing: 0.4,
        opacity: t * (1 - out),
        transform: `translateY(${(1 - t) * 20}px) scale(${0.92 + 0.08 * t})`,
        ...style,
      }}
    >
      <span style={{width: 12, height: 12, borderRadius: 6, background: dark ? brand.pinkLight : brand.pink}} />
      {text}
    </div>
  );
};
