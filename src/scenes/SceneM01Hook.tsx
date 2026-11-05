import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {EASE, pop, prog} from '../animations/anim';
import {Logo} from '../components/brand/Brand';
import {LightSweep, SpeedLines} from '../components/bg/Backdrops';
import {Camera, Layer} from '../components/Camera';
import {CharStagger} from '../components/typography/Kinetic';
import {Rider, WarungFront} from '../components/world/World';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';
import {brand, font} from '../config/theme';

const JOIN = 70;

const Question: React.FC<{text: string; t: number; top: number; tilt: number}> = ({text, t, top, tilt}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', opacity: t, transform: `translateY(${(1 - t) * 40}px) scale(${0.9 + 0.1 * t}) rotate(${tilt}deg)`}}>
    <div style={{fontFamily: font.family, fontWeight: 800, fontSize: 100, letterSpacing: -2.5, color: brand.ink, background: 'rgba(255,255,255,0.94)', padding: '18px 48px', borderRadius: 40, boxShadow: '0 24px 50px rgba(42,18,32,0.16)'}}>{text}</div>
  </div>
);

// Hook video mitra: satu gambar warung dengan motor yang datang ke depannya (keduanya satu ekosistem),
// dua pertanyaan, lalu "Gabung Mihape Mitra."
export const SceneM01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const qStore = pop(frame, fps, 6, 15);
  const qDriver = pop(frame, fps, 24, 15);
  // Motor masuk dari kiri lalu berhenti di depan warung
  const arrive = prog(frame, 8, 46, EASE);
  const join = prog(frame, JOIN, 18, EASE);
  const icon = pop(frame, fps, JOIN + 8, 13);
  return (
    <AbsoluteFill style={{background: '#F2DCC4'}}>
      <Camera from={{scale: 1.02}} to={{scale: 1.1, y: -20}}>
        <Layer depth={0.5}>
          <WarungFront frame={frame} />
        </Layer>
        <Rider x={interpolate(arrive, [0, 1], [-320, 560])} y={1640} scale={1.15} frame={frame} speed={1 - arrive} />
      </Camera>
      <Question text={copy.M01.storeQ} t={qStore * (1 - join)} top={250} tilt={-2} />
      <Question text={copy.M01.driverQ} t={qDriver * (1 - join)} top={420} tilt={2} />
      {/* Menyatu: layar memutih, ikon & ajakan */}
      <AbsoluteFill style={{background: `rgba(255,247,250,${join * 0.94})`}} />
      {join > 0 && (
        <>
          <SpeedLines y={1150} start={JOIN} length={600} thickness={18} />
          <div style={{position: 'absolute', left: 540 - 120, top: 640, width: 240, height: 240, transform: `scale(${icon})`}}>
            <div style={{width: 240, height: 240, borderRadius: 56, overflow: 'hidden', boxShadow: '0 30px 60px rgba(216,27,96,0.3)'}}>
              <Logo src={brandFiles.mitraIcon} width={240} />
              <LightSweep start={JOIN + 22} dur={22} width={140} opacity={0.9} />
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 960}}>
            <CharStagger text={copy.M01.punch} delay={JOIN + 4} size={92} gradient />
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
