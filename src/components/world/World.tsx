// Ilustrasi suasana kampung Jawa Barat (generik, bukan lokasi tertentu):
// langit pagi, bukit berlapis, sawah terasering, pohon kelapa, rumah genteng, jalan desa.
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {float} from '../../animations/anim';
import {world as W} from '../../config/theme';

export const Sky: React.FC<{sunY?: number; sunX?: number; warm?: number}> = ({sunY = 760, sunX = 760, warm = 1}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, ${W.skyTop} 0%, ${W.skyMid} 38%, ${W.skyLow} 62%)`}}>
    <div
      style={{
        position: 'absolute',
        left: sunX - 360,
        top: sunY - 360,
        width: 720,
        height: 720,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(255,226,186,${0.9 * warm}) 0%, rgba(255,226,186,0) 65%)`,
      }}
    />
    <div style={{position: 'absolute', left: sunX - 92, top: sunY - 92, width: 184, height: 184, borderRadius: '50%', background: W.sun}} />
  </AbsoluteFill>
);

// Bukit berlapis. `y` = garis dasar puncak, `amp` = tinggi gelombang.
export const Hill: React.FC<{y: number; amp: number; color: string; seed: number; height?: number; trees?: boolean}> = ({y, amp, color, seed, height = 1920, trees}) => {
  const pts = Array.from({length: 9}, (_, i) => [i * 160 - 100, y - amp * (0.4 + random(`h${seed}-${i}`) * 0.6)] as const);
  const d = pts.reduce((s, [x, yy], i) => {
    if (i === 0) return `M${x} ${yy}`;
    const [px, py] = pts[i - 1];
    const cx = (px + x) / 2;
    return `${s} Q${px + 80} ${py} ${cx} ${(py + yy) / 2}`;
  }, '');
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <path d={`${d} T1300 ${y} L1300 ${height} L-200 ${height} Z`} fill={color} />
      {trees &&
        pts.slice(1, 8).map(([x, yy], i) => (
          <g key={i}>
            {[0, 1, 2].map((k) => (
              <circle key={k} cx={x + k * 22 - 22 + random(`t${seed}${i}${k}`) * 20} cy={yy + 24 + random(`ty${seed}${i}${k}`) * 20} r={14 + random(`tr${seed}${i}${k}`) * 10} fill={W.treeDark} opacity={0.35} />
            ))}
          </g>
        ))}
    </svg>
  );
};

// Sawah terasering: pita-pita lengkung bergradasi hijau dengan garis air tipis.
export const RiceTerraces: React.FC<{top: number; rows?: number; sway?: number}> = ({top, rows = 9, sway = 0}) => {
  const bandH = (1920 - top) / rows;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      {Array.from({length: rows}, (_, i) => {
        const y0 = top + i * bandH;
        const bend = 40 + i * 14;
        const c = W.rice[i % W.rice.length];
        const d = `M-60 ${y0 + bend} Q540 ${y0 - bend * 0.6} 1140 ${y0 + bend * 0.7} L1140 1960 L-60 1960 Z`;
        return (
          <g key={i}>
            <path d={d} fill={c} />
            <path d={`M-60 ${y0 + bend} Q540 ${y0 - bend * 0.6} 1140 ${y0 + bend * 0.7}`} stroke={W.water} strokeWidth={4 + i * 0.6} fill="none" opacity={0.75} />
            {/* Tunas padi */}
            {Array.from({length: 22}, (_, k) => {
              const x = (k / 21) * 1100 - 10 + random(`r${i}${k}`) * 30;
              const yy = y0 + bend * 0.4 + 14 + i * 2 + random(`ry${i}${k}`) * bandH * 0.6;
              const h = 10 + i * 2.2;
              const s = Math.sin((sway + k * 7 + i * 13) / 18) * (2 + i * 0.4);
              return <path key={k} d={`M${x} ${yy} q${s} ${-h / 2} ${s * 1.6} ${-h}`} stroke={W.riceDark} strokeWidth={2 + i * 0.25} fill="none" opacity={0.45} strokeLinecap="round" />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

export const CoconutTree: React.FC<{x: number; y: number; h: number; lean?: number; frame: number; seed?: number}> = ({x, y, h, lean = 30, frame, seed = 0}) => {
  const top: [number, number] = [x + lean, y - h];
  const sway = Math.sin((frame + seed * 40) / 34) * 4;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <path d={`M${x} ${y} Q${x + lean * 0.2} ${y - h * 0.5} ${top[0]} ${top[1]}`} stroke={W.trunk} strokeWidth={h * 0.045} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${sway} ${top[0]} ${top[1]})`}>
        {[-150, -110, -70, -30, 10, 50, 200, 160].map((a, i) => {
          const r = h * (0.36 + (i % 3) * 0.05);
          const rad = (a * Math.PI) / 180;
          const ex = top[0] + Math.cos(rad) * r;
          const ey = top[1] + Math.sin(rad) * r * 0.55 + r * 0.25;
          const cx = top[0] + Math.cos(rad) * r * 0.5;
          const cy = top[1] + Math.sin(rad) * r * 0.5 - r * 0.15;
          return <path key={i} d={`M${top[0]} ${top[1]} Q${cx} ${cy} ${ex} ${ey}`} stroke={i % 2 ? W.tree : W.treeDark} strokeWidth={h * 0.05} fill="none" strokeLinecap="round" />;
        })}
        <circle cx={top[0]} cy={top[1] + 6} r={h * 0.035} fill={W.trunk} />
      </g>
    </svg>
  );
};

export const BushTree: React.FC<{x: number; y: number; r: number; color?: string}> = ({x, y, r, color = W.tree}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
    <rect x={x - r * 0.08} y={y - r * 0.6} width={r * 0.16} height={r * 0.7} fill={W.trunk} />
    <circle cx={x - r * 0.45} cy={y - r * 0.85} r={r * 0.6} fill={color} />
    <circle cx={x + r * 0.45} cy={y - r * 0.9} r={r * 0.62} fill={color} />
    <circle cx={x} cy={y - r * 1.35} r={r * 0.7} fill={color} />
    <circle cx={x + r * 0.2} cy={y - r * 1.45} r={r * 0.35} fill="#fff" opacity={0.08} />
  </svg>
);

// Rumah kampung dengan atap genteng. `lit` = jendela menyala (0..1).
export const House: React.FC<{x: number; y: number; w: number; lit?: number; flip?: boolean}> = ({x, y, w, lit = 0, flip}) => {
  const h = w * 0.62;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={flip ? `translate(${2 * x + w} 0) scale(-1 1)` : undefined}>
        <rect x={x + w * 0.06} y={y - h} width={w * 0.88} height={h} fill={W.wall} />
        <rect x={x + w * 0.06} y={y - h} width={w * 0.22} height={h} fill={W.wallShade} />
        <path d={`M${x - w * 0.06} ${y - h} L${x + w * 0.3} ${y - h - w * 0.42} L${x + w * 0.7} ${y - h - w * 0.42} L${x + w * 1.06} ${y - h} Z`} fill={W.roof} />
        <path d={`M${x - w * 0.06} ${y - h} L${x + w * 0.3} ${y - h - w * 0.42} L${x + w * 0.36} ${y - h - w * 0.42} L${x + w * 0.06} ${y - h} Z`} fill={W.roofDark} />
        <rect x={x + w * 0.38} y={y - h * 0.62} width={w * 0.2} height={h * 0.62} fill={W.wood} />
        <rect x={x + w * 0.66} y={y - h * 0.7} width={w * 0.18} height={h * 0.3} fill={lit ? `rgba(255,205,120,${0.4 + lit * 0.6})` : '#9FB4B8'} />
        <rect x={x + w * 0.66} y={y - h * 0.7} width={w * 0.18} height={h * 0.3} fill="none" stroke={W.wood} strokeWidth={w * 0.02} />
      </g>
    </svg>
  );
};

// Kabut tipis yang bergeser.
export const Mist: React.FC<{y: number; opacity?: number; speed?: number}> = ({y, opacity = 0.55, speed = 0.4}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        left: -400 + ((frame * speed) % 400),
        top: y,
        width: 1880,
        height: 220,
        background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.9), rgba(255,255,255,0) 60%), radial-gradient(ellipse at 75% 40%, rgba(255,255,255,0.8), rgba(255,255,255,0) 55%)',
        opacity,
        filter: 'blur(16px)',
      }}
    />
  );
};

// Pengendara motor tampak samping (atribut netral: helm, jaket, tas; tanpa logo).
export const Rider: React.FC<{x: number; y: number; scale?: number; frame: number; speed?: number; passenger?: boolean}> = ({x, y, scale = 1, frame, speed = 1, passenger}) => {
  const rot = (frame * 14 * speed) % 360;
  const bob = Math.sin(frame / 3.2) * 2.5 * speed;
  const wheel = (cx: number) => (
    <g transform={`rotate(${rot} ${cx} 0)`}>
      <circle cx={cx} cy={0} r={46} fill="#26232B" />
      <circle cx={cx} cy={0} r={30} fill="#5A5560" />
      {[0, 60, 120].map((a) => (
        <rect key={a} x={cx - 2} y={-30} width={4} height={60} fill="#8C8794" transform={`rotate(${a} ${cx} 0)`} />
      ))}
      <circle cx={cx} cy={0} r={8} fill="#C9C4CF" />
    </g>
  );
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <ellipse cx={0} cy={50} rx={170} ry={14} fill="rgba(42,18,32,0.18)" />
        {wheel(-110)}
        {wheel(110)}
        <g transform={`translate(0 ${bob})`}>
          {/* Rangka motor */}
          <path d="M-110 0 L-60 -60 L40 -64 L110 0" stroke="#3A3640" strokeWidth={14} fill="none" strokeLinejoin="round" />
          <path d="M-80 -70 Q-10 -110 70 -82 L84 -54 L-70 -46 Z" fill="#4C6C8C" />
          <path d="M-96 -78 L-30 -86 L-28 -70 L-92 -64 Z" fill="#2B2730" />
          <path d="M70 -82 L104 -132" stroke="#3A3640" strokeWidth={10} strokeLinecap="round" />
          <rect x={96} y={-142} width={30} height={10} rx={5} fill="#2B2730" />
          <circle cx={124} cy={-104} r={10} fill="#FFE7B0" />
          <path d="M-40 -28 L60 -30" stroke="#C9C4CF" strokeWidth={6} strokeLinecap="round" />
          {/* Tas belakang */}
          <rect x={-150} y={-150} width={74} height={70} rx={10} fill="#6B5B4E" />
          <rect x={-150} y={-150} width={74} height={14} rx={7} fill="#5A4B40" />
          {/* Pengendara */}
          <path d="M-36 -86 L0 -96 L46 -36 L36 -28 L-6 -70 Z" fill="#2F3A4A" />
          <path d="M-34 -96 Q-30 -170 6 -190 L40 -182 Q48 -130 22 -92 Z" fill="#33475E" />
          <path d="M24 -170 Q64 -150 90 -128" stroke="#33475E" strokeWidth={20} strokeLinecap="round" fill="none" />
          <circle cx={92} cy={-128} r={9} fill="#C68E62" />
          <circle cx={14} cy={-214} r={30} fill="#F4F2F6" />
          <path d="M14 -244 A30 30 0 0 1 44 -214 L20 -214 Z" fill="#DAD6DE" />
          <path d="M26 -222 L46 -218 L44 -204 L24 -206 Z" fill="#2B2730" opacity={0.85} />
          {passenger && (
            <g>
              <path d="M-80 -96 Q-80 -160 -48 -176 L-20 -168 Q-16 -124 -36 -94 Z" fill="#8C5A6B" />
              <circle cx={-48} cy={-198} r={26} fill="#F4F2F6" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};

// Warung tampak depan, ukuran besar (latar scene toko).
export const WarungFront: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="warungFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9C4A8" />
          <stop offset="1" stopColor="#BFA88C" />
        </linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="#F2DCC4" />
      <rect y="1380" width="1080" height="540" fill="url(#warungFloor)" />
      {/* Dinding & atap */}
      <path d="M-40 360 L540 140 L1120 360 Z" fill={W.roof} />
      <path d="M-40 360 L540 140 L540 175 L30 380 Z" fill={W.roofDark} opacity={0.5} />
      <rect x="40" y="360" width="1000" height="1030" fill={W.wall} />
      {/* Kanopi */}
      {Array.from({length: 13}, (_, i) => (
        <path key={i} d={`M${i * 85} 400 h85 l-10 90 h-65 z`} fill={i % 2 ? '#F4EBDD' : '#3F7F62'} />
      ))}
      {/* Papan nama generik */}
      <rect x="300" y="520" width="480" height="110" rx="14" fill={W.wood} />
      <text x="540" y="595" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight={800} fontSize={58} fill="#F8EBD8" letterSpacing={6}>
        WARUNG NASI
      </text>
      {/* Etalase */}
      <rect x="120" y="900" width="840" height="490" rx="18" fill={W.wood} />
      <rect x="150" y="930" width="780" height="230" rx="12" fill="#CFE0E3" opacity={0.65} />
      {[200, 330, 460, 590, 720].map((x, i) => (
        <g key={x}>
          <ellipse cx={x + 50} cy={1120} rx={56} ry={16} fill="#F4EBDD" />
          <ellipse cx={x + 50} cy={1110} rx={42} ry={14} fill={['#C9862F', '#7AA843', '#E8A25A', '#B5562F', '#E9C27A'][i]} />
        </g>
      ))}
      <rect x="120" y="1180" width="840" height="24" fill="#6E4630" />
      {/* Panci di atas kompor */}
      <rect x="760" y="760" width="160" height="110" rx="20" fill="#A7AFB4" />
      <ellipse cx="840" cy="760" rx="86" ry="20" fill="#C6CCD0" />
      <rect x="230" y="800" width="120" height="80" rx="16" fill="#E5D3B4" />
      <rect x="380" y="780" width="70" height="100" rx="14" fill="#F5D06B" opacity={0.9} />
      <rect x="470" y="800" width="70" height="80" rx="14" fill="#BFD98A" opacity={0.9} />
      {/* Bangku */}
      <rect x="160" y="1480" width="760" height="40" rx="10" fill={W.wood} />
      <rect x="200" y="1520" width="24" height="120" fill="#6E4630" />
      <rect x="856" y="1520" width="24" height="120" fill="#6E4630" />
    </svg>
    <Steam x={840} y={730} frame={frame} />
  </AbsoluteFill>
);

const Steam: React.FC<{x: number; y: number; frame: number}> = ({x, y, frame}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
    {[0, 1, 2].map((i) => {
      const t = ((frame + i * 30) % 90) / 90;
      const yy = y - t * 220;
      const xx = x - 40 + i * 40 + float(frame, 40, 14, i * 20);
      return <path key={i} d={`M${xx} ${yy + 60} q-18 -30 0 -60 q18 -30 0 -60`} stroke="#fff" strokeWidth={12} strokeLinecap="round" fill="none" opacity={Math.sin(t * Math.PI) * 0.6} />;
    })}
  </svg>
);
