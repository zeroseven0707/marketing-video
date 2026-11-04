import React from 'react';
import {brand} from '../../config/theme';

// Primitif UI aplikasi, meniru mihp-customer/lib/theme.ts (radius, warna, ukuran font).
export const appFont = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
export const radius = {xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 999};

export const Screen: React.FC<{bg?: string; children: React.ReactNode}> = ({bg = brand.bg, children}) => (
  <div style={{position: 'absolute', inset: 0, background: bg, fontFamily: appFont, color: brand.ink, overflow: 'hidden'}}>{children}</div>
);

export const Card: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div style={{background: '#fff', borderRadius: radius.lg, border: `1px solid ${brand.border}`, ...style}}>{children}</div>
);

export const Row: React.FC<{style?: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => (
  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', ...style}}>{children}</div>
);

export const Txt: React.FC<{size?: number; weight?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({
  size = 14,
  weight = 400,
  color = brand.ink,
  style,
  children,
}) => <div style={{fontSize: size, fontWeight: weight, color, lineHeight: 1.3, ...style}}>{children}</div>;

// Tombol utama pink dengan bayangan pink (shadow.primary).
export const PrimaryBtn: React.FC<{label: string; pressed?: number; style?: React.CSSProperties; height?: number; size?: number}> = ({
  label,
  pressed = 0,
  style,
  height = 52,
  size = 16,
}) => (
  <div
    style={{
      height,
      borderRadius: radius.md,
      background: pressed > 0.5 ? brand.pinkPressed : brand.pink,
      color: '#fff',
      fontWeight: 800,
      fontSize: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 18px rgba(216,27,96,0.35)',
      transform: `scale(${1 - pressed * 0.04})`,
      ...style,
    }}
  >
    {label}
  </div>
);

// Ilustrasi makanan sederhana pengganti foto menu dari server (data contoh).
export const FoodArt: React.FC<{kind: number; size?: number}> = ({kind, size = 80}) => {
  const k = kind % 4;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <ellipse cx="40" cy="58" rx="30" ry="9" fill="rgba(42,18,32,0.10)" />
      {k === 0 && (
        <>
          <ellipse cx="40" cy="50" rx="30" ry="12" fill="#5E9A4E" />
          <path d="M14 48c4-16 48-16 52 0-10 8-42 8-52 0z" fill="#79B35F" />
          <ellipse cx="34" cy="40" rx="13" ry="8" fill="#FBF7EF" />
          <circle cx="52" cy="40" r="6" fill="#C8643B" />
          <circle cx="47" cy="45" r="4" fill="#E8B04A" />
        </>
      )}
      {k === 1 && (
        <>
          <path d="M12 38h56c0 16-12 24-28 24S12 54 12 38z" fill="#F4EBDD" />
          <ellipse cx="40" cy="38" rx="28" ry="8" fill="#C9862F" />
          <circle cx="32" cy="37" r="4" fill="#7AA843" />
          <circle cx="46" cy="36" r="3.5" fill="#E8590C" />
          <circle cx="40" cy="40" r="3" fill="#F5D06B" />
        </>
      )}
      {k === 2 && (
        <>
          <path d="M26 18h28l-4 42H30z" fill="#E9C27A" opacity="0.95" />
          <path d="M27 26h26l-1 6H28z" fill="#C2852E" />
          <rect x="30" y="34" width="8" height="8" rx="2" fill="#FFFFFF" opacity="0.7" />
          <rect x="41" y="40" width="7" height="7" rx="2" fill="#FFFFFF" opacity="0.6" />
          <path d="M46 10l-4 16" stroke="#D81B60" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {k === 3 && (
        <>
          <ellipse cx="40" cy="48" rx="28" ry="11" fill="#F4EBDD" />
          <path d="M18 46c6-14 38-14 44 0-8 7-36 7-44 0z" fill="#8FB55A" />
          <path d="M24 44c8-8 26-8 32 0" stroke="#5C8A36" strokeWidth="2" fill="none" />
          <ellipse cx="40" cy="42" rx="12" ry="5" fill="#D9A15A" />
        </>
      )}
    </svg>
  );
};
