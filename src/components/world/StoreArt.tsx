import React from 'react';
import {world} from '../../config/theme';

// Ilustrasi fasad warung kecil, pengganti foto toko dari server (data contoh).
export const StoreArt: React.FC<{variant?: number; w: number; h: number}> = ({variant = 0, w, h}) => {
  const awning = ['#3F7F62', '#B5562F', '#5A6C9C'][variant % 3];
  return (
    <svg width={w} height={h} viewBox="0 0 390 250" preserveAspectRatio="xMidYMid slice">
      <rect width="390" height="250" fill="#F6E3CF" />
      <rect y="170" width="390" height="80" fill="#D9C4A8" />
      <path d="M60 70 L195 20 L330 70 Z" fill={world.roof} />
      <path d="M60 70 L195 20 L195 30 L72 74 Z" fill={world.roofDark} opacity="0.5" />
      <rect x="78" y="70" width="234" height="120" fill={world.wall} />
      <rect x="78" y="70" width="234" height="10" fill={world.wallShade} />
      {/* Kanopi bergaris */}
      {Array.from({length: 9}, (_, i) => (
        <path key={i} d={`M${66 + i * 29} 84 h29 l-4 26 h-21 z`} fill={i % 2 ? '#F4EBDD' : awning} />
      ))}
      <rect x="96" y="120" width="198" height="70" rx="4" fill={world.wood} />
      <rect x="104" y="128" width="182" height="34" rx="3" fill="#6E4630" />
      {/* Toples & panci */}
      {[118, 146, 174].map((x, i) => (
        <rect key={x} x={x} y={134} width={20} height={24} rx={5} fill={['#F5D06B', '#E8A25A', '#BFD98A'][i]} opacity={0.9} />
      ))}
      <ellipse cx="236" cy="140" rx="30" ry="8" fill="#9AA3A8" />
      <rect x="206" y="140" width="60" height="18" rx="6" fill="#B7BEC2" />
      <rect x="150" y="196" width="90" height="10" rx="3" fill={world.wood} opacity="0.8" />
    </svg>
  );
};
