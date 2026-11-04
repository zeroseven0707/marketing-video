import React from 'react';
import {Bike, Home, Store} from 'lucide-react';
import {brand} from '../../config/theme';

export type Pt = [number, number];

// Titik di sepanjang polyline pada progres t (0..1), berdasarkan panjang lintasan.
export const pointAt = (pts: Pt[], t: number): {p: Pt; angle: number} => {
  const seg = pts.slice(1).map((b, i) => Math.hypot(b[0] - pts[i][0], b[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
      const a = pts[i];
      const b = pts[i + 1];
      return {p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], angle: Math.atan2(b[1] - a[1], b[0] - a[0])};
    }
    d -= seg[i];
  }
  return {p: pts[pts.length - 1], angle: 0};
};

export const polyLength = (pts: Pt[]) => pts.slice(1).reduce((n, b, i) => n + Math.hypot(b[0] - pts[i][0], b[1] - pts[i][1]), 0);

// Rute contoh di peta (koordinat layar 390x844). Tidak mewakili lokasi nyata.
export const DEMO_ROUTE: Pt[] = [
  [96, 250],
  [150, 300],
  [168, 380],
  [236, 430],
  [250, 520],
  [300, 560],
];

// Peta bergaya ringan tanpa nama tempat: sawah, sungai, jalan desa. Meniru tile terang
// yang dipakai aplikasi (Leaflet + CARTO), tanpa meniru wilayah tertentu.
export const MapView: React.FC<{
  route?: Pt[];
  progress: number; // posisi driver di rute 0..1
  frame: number;
  w?: number;
  h?: number;
  showRoute?: number; // 0..1 gambar rute
}> = ({route = DEMO_ROUTE, progress, frame, w = 390, h = 844, showRoute = 1}) => {
  const len = polyLength(route);
  const d = route.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  const {p} = pointAt(route, progress);
  const pulse = (frame % 54) / 54;
  return (
    <div style={{position: 'absolute', inset: 0, width: w, height: h, background: '#F3F1EC', overflow: 'hidden'}}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute', inset: 0}}>
        {/* Petak sawah */}
        {[
          [10, 120, 120, 90],
          [250, 140, 130, 110],
          [20, 430, 130, 120],
          [280, 640, 120, 130],
          [40, 640, 150, 100],
          [200, 260, 70, 80],
        ].map(([x, y, ww, hh], i) => (
          <rect key={i} x={x} y={y} width={ww} height={hh} rx={14} fill={i % 2 ? '#DDEBCF' : '#E5EFD6'} />
        ))}
        {/* Sungai */}
        <path d="M-10 760 C 90 720, 160 790, 250 740 S 380 700, 420 720" stroke="#CFE2EA" strokeWidth={26} fill="none" />
        {/* Jalan desa */}
        <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
          <path d="M-20 300 C 120 290, 160 340, 168 380 S 260 420, 420 410" strokeWidth={16} />
          <path d="M96 -20 L 96 250 L 150 300" strokeWidth={14} />
          <path d="M236 430 C 250 470, 246 500, 250 520 L 300 560 L 420 600" strokeWidth={14} />
          <path d="M-20 560 L 120 540 L 250 520" strokeWidth={10} />
          <path d="M300 560 L 310 860" strokeWidth={10} />
          <path d="M200 -20 L 210 180 L 300 230 L 420 220" strokeWidth={9} />
        </g>
        <g stroke="#E6E1D8" strokeWidth={1.5} fill="none">
          <path d="M-20 300 C 120 290, 160 340, 168 380 S 260 420, 420 410" />
        </g>
        {/* Rumah-rumah kecil */}
        {[
          [60, 340],
          [200, 360],
          [330, 470],
          [130, 600],
          [350, 300],
          [70, 210],
          [260, 610],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={18} height={14} rx={3} fill="#E7E2DA" />
        ))}
        {/* Rute pink (weight 5, opacity .85 seperti di LeafletMap.tsx:154) */}
        <path d={d} stroke={brand.pink} strokeWidth={5} strokeOpacity={0.85} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - showRoute)} />
      </svg>
      <Marker x={route[0][0]} y={route[0][1]} color={brand.pink} icon={<Store size={14} color={brand.pink} strokeWidth={2.4} />} />
      <Marker x={route[route.length - 1][0]} y={route[route.length - 1][1]} color="#1D4ED8" icon={<Home size={14} color="#1D4ED8" strokeWidth={2.4} />} />
      {/* Driver berdenyut */}
      <div style={{position: 'absolute', left: p[0], top: p[1], width: 0, height: 0}}>
        <div
          style={{
            position: 'absolute',
            left: -19,
            top: -19,
            width: 38,
            height: 38,
            borderRadius: 19,
            background: `${brand.pink}33`,
            transform: `scale(${1 + Math.sin(pulse * Math.PI) * 0.8})`,
            opacity: 0.7 - Math.sin(pulse * Math.PI) * 0.6,
          }}
        />
        <Marker x={0} y={0} color={brand.pink} icon={<Bike size={15} color={brand.pink} strokeWidth={2.4} />} />
      </div>
    </div>
  );
};

const Marker: React.FC<{x: number; y: number; color: string; icon: React.ReactNode}> = ({x, y, color, icon}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 14,
      top: y - 14,
      width: 28,
      height: 28,
      borderRadius: 14,
      background: '#fff',
      border: `2px solid ${color}`,
      boxShadow: '0 2px 6px rgba(42,18,32,.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
    }}
  >
    {icon}
  </div>
);
