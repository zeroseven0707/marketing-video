import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, EASE, prog, shake} from '../animations/anim';
import {FootageSlot, Logo, SimTag} from '../components/brand/Brand';
import {CinematicGrade} from '../components/bg/Backdrops';
import {Camera, Layer} from '../components/Camera';
import {Phone, Tap} from '../components/phone/Phone';
import {Headline} from '../components/typography/Headline';
import {MerchantAccepted, MerchantIncoming} from '../components/ui/MitraScreens';
import {WarungFront} from '../components/world/World';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';

export const S06_TAP = 112;

// Warung menerima pesanan: HP Mitra berdering di depan warung, pemilik menekan "Terima".
export const Scene06Merchant: React.FC<{kicker?: string | null; headline?: readonly string[]; highlight?: [number, number][]}> = ({
  kicker = copy.S06.kicker,
  headline = copy.S06.headline,
  highlight = [[0, 1]],
}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, 0, 30, EASE);
  const ringing = frame < S06_TAP;
  const ring = ringing ? (frame % 30) / 30 : 0;
  const jx = ringing && frame > 10 ? shake('s06x', frame, 5) : 0;
  const jr = ringing && frame > 10 ? shake('s06r', frame, 1.2) : 0;
  const accepted = prog(frame, S06_TAP + 8, 18);
  const pressed = interpolate(frame, [S06_TAP - 2, S06_TAP, S06_TAP + 8], [0, 1, 0], CLAMP);
  const secondsLeft = 299 - Math.floor(frame / 30);
  return (
    <AbsoluteFill style={{background: '#F2DCC4'}}>
      <Camera from={{scale: 1.08, x: 30}} to={{scale: 1.18, x: -20}}>
        <Layer depth={0.5} style={{filter: 'blur(5px) brightness(0.92)'}}>
          <FootageSlot sceneId="S06Merchant">
            <WarungFront frame={frame} />
          </FootageSlot>
        </Layer>
      </Camera>
      <CinematicGrade strength={0.3} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,247,250,0.98) 0%, rgba(255,247,250,0.97) 33%, rgba(255,247,250,0) 50%)'}} />
      <Phone
        width={560}
        x={interpolate(enter, [0, 1], [1300, 560]) + jx}
        y={1210}
        rotateY={interpolate(enter, [0, 1], [-40, -10])}
        rotateZ={interpolate(enter, [0, 1], [10, 2]) + jr}
        dark
        captureKey="merchantIncoming"
      >
        <MerchantIncoming ring={ring} secondsLeft={secondsLeft} pressed={pressed} />
        {accepted > 0 && (
          <div style={{position: 'absolute', inset: 0, opacity: accepted}}>
            <MerchantAccepted t={accepted} />
          </div>
        )}
        <Tap x={266} y={755} at={S06_TAP} frame={frame} />
      </Phone>
      <div style={{position: 'absolute', left: 40, top: 1700, opacity: prog(frame, 30, 16) * 0.95}}>
        <Logo src={brandFiles.mitraWordmark} width={230} />
      </div>
      <Headline lines={headline} kicker={kicker ?? undefined} delay={6} size={76} highlight={highlight} />
      <SimTag delay={30} />
    </AbsoluteFill>
  );
};
