import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Package} from 'lucide-react';
import {CLAMP, float, pop} from '../animations/anim';
import {FootageSlot, Pin} from '../components/brand/Brand';
import {Camera} from '../components/Camera';
import {Headline} from '../components/typography/Headline';
import {House, Rider} from '../components/world/World';
import {copy} from '../config/copy';
import {brand, font, safe, world as W} from '../config/theme';

// Tiga kebutuhan sehari-hari muncul sebagai panel bergantian dari kiri/kanan.
export const Scene02Needs: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panels = [0, 1, 2];
  return (
    <AbsoluteFill style={{background: '#FFF7F0'}}>
      <FootageSlot sceneId="S02Needs">
        <Camera from={{y: 20}} to={{y: -20, scale: 1.03}}>
          <AbsoluteFill style={{backgroundImage: `radial-gradient(${W.roof}22 2px, transparent 2.4px)`, backgroundSize: '44px 44px', opacity: 0.6}} />
          {panels.map((i) => {
            const t = pop(frame, fps, 26 + i * 20, 20);
            const dir = i % 2 ? 1 : -1;
            const y = 640 + i * 370;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: safe.side,
                  right: safe.side,
                  top: y,
                  height: 330,
                  borderRadius: 40,
                  overflow: 'hidden',
                  background: '#fff',
                  boxShadow: '0 30px 60px rgba(42,18,32,0.12)',
                  transform: `translateX(${(1 - t) * dir * 1100}px) rotate(${(1 - t) * dir * 4}deg) translateY(${float(frame, 90, 6, i * 30)}px)`,
                }}
              >
                <PanelArt i={i} frame={frame} enter={t} />
                <div style={{position: 'absolute', left: 48, top: 0, bottom: 0, width: 420, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: font.family}}>
                  <div style={{fontSize: 52, fontWeight: 800, color: brand.ink, letterSpacing: -1.4, lineHeight: 1.08}}>{copy.S02.needs[i].title}</div>
                  <div style={{fontSize: 40, fontWeight: 600, color: brand.text2, marginTop: 8, letterSpacing: -0.6}}>{copy.S02.needs[i].sub}</div>
                </div>
              </div>
            );
          })}
        </Camera>
      </FootageSlot>
      <Headline lines={[copy.S02.headline]} delay={4} size={76} />
    </AbsoluteFill>
  );
};

// Ilustrasi kecil di sisi kanan tiap panel, ikut bergerak parallax saat panel masuk.
const PanelArt: React.FC<{i: number; frame: number; enter: number}> = ({i, frame, enter}) => {
  const shift = (1 - enter) * 120;
  return (
    <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 440, overflow: 'hidden', background: ['#FFF1E6', '#EEF5E6', '#F3EEFF'][i]}}>
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${shift}px)`}}>
        {i === 0 && (
          <div style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', left: -280, top: -1340, transform: 'scale(1)'}}>
              <House x={380} y={1620} w={230} lit={0.5 + 0.5 * Math.sin(frame / 10)} />
            </div>
            <Clock frame={frame} />
          </div>
        )}
        {i === 1 && <RoadArt frame={frame} />}
        {i === 2 && (
          <div style={{position: 'absolute', inset: 0}}>
            <div style={{position: 'absolute', left: 40, top: 40, width: 130, height: 130, borderRadius: 30, background: '#E9DCC4', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${float(frame, 60, 5)}deg)`}}>
              <Package size={78} color={serviceAccent} strokeWidth={1.8} />
            </div>
            <div style={{position: 'absolute', left: -470, top: -1300}}>
              <Rider x={700} y={1560} scale={0.42} frame={frame} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const serviceAccent = '#7C3AED';

const Clock: React.FC<{frame: number}> = ({frame}) => {
  const a = frame * 6;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{position: 'absolute', right: 40, top: 30}}>
      <circle cx="60" cy="60" r="50" fill="#fff" stroke={brand.ink} strokeWidth="6" />
      <line x1="60" y1="60" x2="60" y2="30" stroke={brand.ink} strokeWidth="6" strokeLinecap="round" transform={`rotate(${a / 12} 60 60)`} />
      <line x1="60" y1="60" x2="84" y2="60" stroke={brand.pink} strokeWidth="5" strokeLinecap="round" transform={`rotate(${a} 60 60)`} />
      <circle cx="60" cy="60" r="5" fill={brand.ink} />
    </svg>
  );
};

const RoadArt: React.FC<{frame: number}> = ({frame}) => {
  const dash = -frame * 4;
  const pinBob = interpolate(Math.sin(frame / 8), [-1, 1], [0, -12], CLAMP);
  return (
    <svg width="440" height="330" viewBox="0 0 440 330" style={{position: 'absolute', inset: 0}}>
      <rect width="440" height="330" fill="#E7F1DC" />
      <path d="M0 250 Q120 200 220 160 T440 60" stroke={W.road} strokeWidth="56" fill="none" strokeLinecap="round" />
      <path d="M0 250 Q120 200 220 160 T440 60" stroke="#fff" strokeWidth="5" fill="none" strokeDasharray="18 18" strokeDashoffset={dash} />
      <foreignObject x="330" y={20 + pinBob} width="80" height="90">
        <Pin size={80} />
      </foreignObject>
    </svg>
  );
};
