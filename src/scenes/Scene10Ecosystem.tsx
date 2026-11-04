import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bike, Home, Store} from 'lucide-react';
import {CLAMP, EASE, pop, prog} from '../animations/anim';
import {FootageSlot} from '../components/brand/Brand';
import {Camera} from '../components/Camera';
import {Headline} from '../components/typography/Headline';
import {pointAt, polyLength, type Pt} from '../components/ui/MapView';
import {copy} from '../config/copy';
import {brand, font} from '../config/theme';

const NODES = {
  customer: {x: 290, y: 1270, Icon: Home, color: '#1D4ED8', label: copy.S10.nodes.customer, lx: -40, ly: 90},
  merchant: {x: 790, y: 980, Icon: Store, color: brand.pink, label: copy.S10.nodes.merchant, lx: -260, ly: -140},
  driver: {x: 700, y: 1560, Icon: Bike, color: '#E8590C', label: copy.S10.nodes.driver, lx: 70, ly: -30},
};

// Lingkaran ekonomi lokal: warga -> warung -> driver -> warga.
const LOOP: Pt[][] = [
  [[290, 1270], [420, 1120], [600, 1040], [790, 980]],
  [[790, 980], [860, 1180], [800, 1400], [700, 1560]],
  [[700, 1560], [520, 1520], [360, 1420], [290, 1270]],
];

// Ekosistem: peta kampung dari atas, tiga simpul terhubung rute pink; jaringan tumbuh perlahan.
export const Scene10Ecosystem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const extra = Array.from({length: 14}, (_, i) => ({
    x: 120 + random(`ex${i}`) * 840,
    y: 760 + random(`ey${i}`) * 1000,
    kind: i % 3,
    at: 60 + i * 5,
  }));
  return (
    <AbsoluteFill style={{background: '#F3F1EC'}}>
      <FootageSlot sceneId="S10Ecosystem">
        <Camera from={{scale: 1.18, y: 60}} to={{scale: 1.0, y: 0}}>
          <VillageMap />
          <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
            {/* Jaringan tambahan yang tumbuh */}
            {extra.map((e, i) => {
              const t = prog(frame, e.at, 20);
              const target = [NODES.customer, NODES.merchant, NODES.driver][e.kind];
              return <line key={i} x1={e.x} y1={e.y} x2={e.x + (target.x - e.x) * t} y2={e.y + (target.y - e.y) * t} stroke={brand.pinkLight} strokeWidth={3} strokeDasharray="8 10" opacity={0.55 * t} />;
            })}
            {LOOP.map((seg, i) => {
              const len = polyLength(seg);
              const t = prog(frame, 18 + i * 14, 26, EASE);
              const d = seg.map((p, k) => `${k ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
              return <path key={i} d={d} stroke={brand.pink} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - t)} />;
            })}
            {/* Titik berjalan di sepanjang lingkaran */}
            {frame > 70 &&
              [0, 1, 2].map((k) => {
                const t = (((frame - 70) / 75 + k / 3) % 1) * 3;
                const seg = LOOP[Math.floor(t) % 3];
                const {p} = pointAt(seg, t % 1);
                return <circle key={k} cx={p[0]} cy={p[1]} r={13} fill="#fff" stroke={brand.pink} strokeWidth={6} />;
              })}
          </svg>
          {extra.map((e, i) => {
            const t = pop(frame, fps, e.at, 16);
            const Icon = [Home, Store, Bike][e.kind];
            return (
              <div key={i} style={{position: 'absolute', left: e.x - 26, top: e.y - 26, width: 52, height: 52, borderRadius: 26, background: '#fff', border: `3px solid ${brand.pinkBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${t})`, opacity: 0.9}}>
                <Icon size={24} color={brand.pinkDark} />
              </div>
            );
          })}
          {Object.values(NODES).map((n, i) => {
            const t = pop(frame, fps, 6 + i * 8, 14);
            const pulse = (frame % 45) / 45;
            return (
              <React.Fragment key={n.label}>
                <div style={{position: 'absolute', left: n.x - 70, top: n.y - 70, width: 140, height: 140, borderRadius: 70, background: `${n.color}22`, transform: `scale(${t * (1 + pulse * 0.6)})`, opacity: 1 - pulse}} />
                <div style={{position: 'absolute', left: n.x - 56, top: n.y - 56, width: 112, height: 112, borderRadius: 56, background: '#fff', border: `6px solid ${n.color}`, boxShadow: '0 16px 32px rgba(42,18,32,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${t})`}}>
                  <n.Icon size={52} color={n.color} strokeWidth={2.2} />
                </div>
                <div style={{position: 'absolute', left: n.x + n.lx, top: n.y + n.ly, fontFamily: font.family, fontWeight: 800, fontSize: 36, color: brand.ink, background: '#fff', padding: '10px 22px', borderRadius: 999, boxShadow: '0 10px 24px rgba(42,18,32,0.12)', whiteSpace: 'nowrap', opacity: prog(frame, 20 + i * 8, 14), transform: `translateY(${(1 - prog(frame, 20 + i * 8, 14)) * 16}px)`}}>
                  {n.label}
                </div>
              </React.Fragment>
            );
          })}
        </Camera>
      </FootageSlot>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,247,250,0.97) 0%, rgba(255,247,250,0.85) 32%, rgba(255,247,250,0) 44%)'}} />
      <Headline lines={copy.S10.headline} delay={4} size={74} highlight={[[2, 1], [2, 2]]} />
    </AbsoluteFill>
  );
};

// Peta kampung dari atas: petak sawah, sungai, jalan, atap rumah. Generik, tanpa nama tempat.
const VillageMap: React.FC = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    {Array.from({length: 40}, (_, i) => {
      const x = (i % 5) * 230 - 40 + random(`vx${i}`) * 30;
      const y = Math.floor(i / 5) * 250 + random(`vy${i}`) * 30;
      return <rect key={i} x={x} y={y} width={200} height={210} rx={22} fill={['#DDEBCF', '#E5EFD6', '#D3E5C1'][i % 3]} />;
    })}
    <path d="M-40 1720 C 200 1640, 380 1800, 620 1700 S 980 1620, 1120 1680" stroke="#CFE2EA" strokeWidth={60} fill="none" />
    <g stroke="#fff" strokeLinecap="round" fill="none">
      <path d="M-40 1120 C 300 1080, 500 1180, 1120 1040" strokeWidth={30} />
      <path d="M540 -40 C 520 500, 620 900, 560 1960" strokeWidth={26} />
      <path d="M-40 1450 C 300 1420, 700 1500, 1120 1380" strokeWidth={22} />
      <path d="M180 600 L 900 760" strokeWidth={16} />
    </g>
    {Array.from({length: 46}, (_, i) => (
      <rect key={i} x={random(`hx${i}`) * 1040} y={random(`hy${i}`) * 1900} width={34} height={26} rx={5} fill={i % 3 ? '#E2A585' : '#E7E2DA'} />
    ))}
  </svg>
);
