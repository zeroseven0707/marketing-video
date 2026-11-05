import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, EASE, EASE_IN, prog, shake} from '../animations/anim';
import {FootageSlot, SimTag} from '../components/brand/Brand';
import {CinematicGrade, SpeedLines} from '../components/bg/Backdrops';
import {Phone, Tap} from '../components/phone/Phone';
import {Headline} from '../components/typography/Headline';
import {DriverDashboard, DriverOffer} from '../components/ui/MitraScreens';
import {BushTree, CoconutTree, Hill, House, Rider, Sky} from '../components/world/World';
import {copy} from '../config/copy';
import {world as W} from '../config/theme';

export const S07_TOGGLE = 18;
export const S07_OFFER = 44;
export const S07_ACCEPT = 88;

// Driver: aktifkan Online, tawaran masuk, terima; lalu motor melaju di jalan kampung.
export const Scene07Driver: React.FC<{kicker?: string | null; headline?: readonly string[]; highlight?: [number, number][]}> = ({
  kicker = copy.S07.kicker,
  headline = copy.S07.headline,
  highlight = [[0, 1]],
}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, 0, 26, EASE);
  const online = prog(frame, S07_TOGGLE, 8);
  const offer = prog(frame, S07_OFFER, 10);
  const ringing = frame >= S07_OFFER && frame < S07_ACCEPT;
  const pressed = interpolate(frame, [S07_ACCEPT - 2, S07_ACCEPT, S07_ACCEPT + 8], [0, 1, 0], CLAMP);
  const phoneOut = prog(frame, 100, 22, EASE_IN);
  // Motor masuk dari kiri setelah tawaran diterima, latar bergulir.
  const ride = prog(frame, 96, 40, EASE);
  const scroll = Math.max(0, frame - 90) * 9;
  return (
    <AbsoluteFill>
      <FootageSlot sceneId="S07Driver">
        <Sky sunY={640} sunX={300} />
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${-(scroll * 0.15) % 1080}px)`}}>
          <Hill y={1060} amp={180} color={W.hillFar} seed={5} />
        </div>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${-(scroll * 0.35) % 1080}px)`}}>
          {[0, 1].map((k) => (
            <div key={k} style={{position: 'absolute', inset: 0, left: k * 1080}}>
              <Hill y={1180} amp={120} color={W.hillMid} seed={6} trees />
            </div>
          ))}
        </div>
        {/* Deretan rumah & pohon di tepi jalan (berulang) */}
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${-(scroll * 0.7) % 1080}px)`}}>
          {[0, 1].map((k) => (
            <div key={k} style={{position: 'absolute', top: 0, bottom: 0, left: k * 1080, width: 1080}}>
              <House x={60} y={1330} w={200} lit={0.2} />
              <BushTree x={360} y={1320} r={70} />
              <House x={520} y={1330} w={170} flip />
              <CoconutTree x={820} y={1330} h={420} lean={30} frame={frame} />
              <BushTree x={980} y={1320} r={55} color={W.treeDark} />
            </div>
          ))}
        </div>
        {/* Jalan desa */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1320, height: 600, background: W.rice[1]}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1360, height: 260, background: W.road, borderTop: `10px solid ${W.roadEdge}`, borderBottom: `10px solid ${W.roadEdge}`}} />
        <div style={{position: 'absolute', left: -200, right: -200, top: 1484, height: 10, transform: `translateX(${-scroll % 160}px)`, backgroundImage: 'linear-gradient(90deg, #F8F2E8 0 80px, transparent 80px 160px)', backgroundSize: '160px 10px'}} />
        <Rider x={interpolate(ride, [0, 1], [-300, 520])} y={1520} scale={1.25} frame={frame} speed={ride > 0 ? 1.6 : 0} />
        {ride > 0.3 && <SpeedLines y={1300} start={110} length={400} thickness={10} color="#FFFFFF" dir={-1} />}
      </FootageSlot>
      <CinematicGrade strength={0.25} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,247,250,0.9) 0%, rgba(255,247,250,0.6) 24%, rgba(255,247,250,0) 40%)'}} />
      <Phone
        width={540}
        x={interpolate(enter, [0, 1], [-300, 560]) + interpolate(phoneOut, [0, 1], [0, 900]) + (ringing ? shake('s07', frame, 4) : 0)}
        y={1150}
        rotateY={interpolate(enter, [0, 1], [40, 10]) - phoneOut * 30}
        rotateZ={interpolate(enter, [0, 1], [-8, -2]) + phoneOut * 12}
        dark={offer > 0.5}
        captureKey={offer > 0.5 ? 'driverOffer' : 'driverDashboard'}
      >
        <DriverDashboard online={online} />
        {offer > 0 && (
          <div style={{position: 'absolute', inset: 0, opacity: offer, transform: `scale(${1.06 - offer * 0.06})`}}>
            <DriverOffer ring={ringing ? ((frame - S07_OFFER) % 30) / 30 : 0} pressed={pressed} />
          </div>
        )}
        <Tap x={329} y={392} at={S07_TOGGLE} frame={frame} />
        <Tap x={266} y={755} at={S07_ACCEPT} frame={frame} />
      </Phone>
      <Headline lines={headline} kicker={kicker ?? undefined} delay={6} size={76} highlight={highlight} />
      {phoneOut < 0.5 && <SimTag delay={24} />}
    </AbsoluteFill>
  );
};
