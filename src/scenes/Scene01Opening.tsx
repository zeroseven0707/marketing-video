import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, EASE, EASE_IN, EASE_INOUT, pop, prog} from '../animations/anim';
import {FootageSlot, Pin} from '../components/brand/Brand';
import {SpeedLines} from '../components/bg/Backdrops';
import {Camera, Layer} from '../components/Camera';
import {WordReveal} from '../components/typography/Kinetic';
import {CoconutTree, Hill, House, Mist, RiceTerraces, Sky} from '../components/world/World';
import {copy} from '../config/copy';
import {brand, font, world as W} from '../config/theme';

const TEXT_OUT = 104; // "Dari daerah, untuk daerah." keluar
const DROP = 100; // pin merek mulai jatuh
const LAND = 120; // pin mendarat di kampung
const PIN = {x: 540, y: 1180};

// Pembuka launching: fajar di kampung ("karya anak daerah"), lalu pin lokasi merek jatuh ke kampung
// dan "Kini hadir untuk kampung kita." Diakhiri cahaya terang agar menyambung ke reveal logo (S03).
export const Scene01Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Malam -> fajar: matahari naik dari balik bukit, lapisan gelap memudar
  const dawn = prog(frame, 0, 110, EASE_INOUT);
  const sunY = interpolate(dawn, [0, 1], [1320, 820]);
  const night = interpolate(dawn, [0, 1], [0.86, 0.12]);
  // Pin jatuh dengan pegas, lalu riak cahaya dari titik mendarat
  const fall = prog(frame, DROP, LAND - DROP, EASE_IN);
  const settle = pop(frame, fps, LAND, 9);
  const pinY = frame < LAND ? interpolate(fall, [0, 1], [-260, PIN.y]) : PIN.y - (1 - settle) * 40;
  const rings = [0, 1, 2].map((i) => prog(frame, LAND + i * 8, 34, EASE));
  const bloom = prog(frame, 150, 30, EASE_INOUT);
  return (
    <AbsoluteFill style={{background: '#0B0710'}}>
      <FootageSlot sceneId="S01Opening">
        <Camera from={{scale: 1.12, y: 40}} to={{scale: 1.02, y: 0}}>
          <Layer depth={0.2}>
            <Sky sunY={sunY} sunX={540} warm={0.4 + dawn * 0.6} />
          </Layer>
          <Layer depth={0.35}>
            <Hill y={1010} amp={170} color={W.hillFar} seed={11} />
          </Layer>
          <Layer depth={0.5}>
            <Hill y={1120} amp={130} color={W.hillMid} seed={12} trees />
          </Layer>
          <Layer depth={0.6}>
            <Mist y={1080} opacity={0.5} speed={0.3} />
          </Layer>
          <Layer depth={0.75}>
            <RiceTerraces top={1240} rows={8} sway={frame / 30} />
            <House x={90} y={1300} w={190} lit={1 - dawn} />
            <House x={760} y={1320} w={170} flip lit={1 - dawn} />
            <CoconutTree x={330} y={1300} h={380} lean={-24} frame={frame} />
            <CoconutTree x={980} y={1310} h={440} lean={28} frame={frame} seed={3} />
          </Layer>
        </Camera>
      </FootageSlot>
      {/* Malam memudar menjadi pagi; atas tetap gelap agar teks putih terbaca */}
      <AbsoluteFill style={{background: `rgba(11,7,16,${night})`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,7,16,0.72) 0%, rgba(11,7,16,0.35) 34%, rgba(11,7,16,0) 52%)'}} />

      {/* Babak 1: karya anak daerah */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', opacity: prog(frame, 10, 18) * (1 - prog(frame, TEXT_OUT, 10, EASE_IN))}}>
        <div style={{fontFamily: font.family, fontWeight: 700, fontSize: 34, letterSpacing: interpolate(prog(frame, 10, 30), [0, 1], [14, 7]), textTransform: 'uppercase', color: '#fff', padding: '14px 34px', borderRadius: 999, border: '2px solid rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.08)'}}>
          {copy.S01.kicker}
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 420, display: 'flex', flexDirection: 'column', gap: 4}}>
        <WordReveal text={copy.S01.lines[0]} delay={26} exitAt={TEXT_OUT} size={118} color="#fff" align="center" />
        <WordReveal text={copy.S01.lines[1]} delay={34} exitAt={TEXT_OUT} size={118} color="#fff" align="center" highlight={[1]} />
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 720, textAlign: 'center', fontFamily: font.family, fontWeight: 600, fontSize: 38, color: 'rgba(255,255,255,0.88)', letterSpacing: 0.5, opacity: prog(frame, 56, 18) * (1 - prog(frame, TEXT_OUT, 10, EASE_IN))}}>
        {copy.S01.region}
      </div>

      {/* Babak 2: merek mendarat di kampung */}
      {frame >= DROP && (
        <>
          {frame < LAND && <SpeedLines y={PIN.y - 300} start={DROP} length={420} thickness={12} color="#FFFFFF" />}
          {rings.map((r, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: PIN.x - 360,
                top: PIN.y + 70 - 360,
                width: 720,
                height: 720,
                borderRadius: '50%',
                border: `6px solid ${i === 1 ? brand.pinkLight : '#fff'}`,
                transform: `scaleY(0.35) scale(${0.1 + r * 1.3})`,
                opacity: r > 0 ? (1 - r) * 0.8 : 0,
              }}
            />
          ))}
          <div style={{position: 'absolute', left: PIN.x - 90, top: pinY - 200, filter: 'drop-shadow(0 20px 30px rgba(216,27,96,0.55))'}}>
            <Pin size={180} />
          </div>
          <div style={{position: 'absolute', left: 60, right: 60, top: 420, display: 'flex', flexDirection: 'column', gap: 4}}>
            <WordReveal text={copy.S01.launch[0]} delay={LAND - 6} size={110} color="#fff" align="center" />
            <WordReveal text={copy.S01.launch[1]} delay={LAND} size={96} color="#fff" align="center" highlight={[1, 2]} />
          </div>
        </>
      )}
      {/* Cahaya terang dari pin: menyambung ke latar terang S03 */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${PIN.x}px ${PIN.y}px, #FFFFFF 0%, ${brand.bgHero} ${bloom * 60}%, rgba(255,247,250,0) ${bloom * 120}%)`,
          opacity: bloom,
        }}
      />
    </AbsoluteFill>
  );
};
