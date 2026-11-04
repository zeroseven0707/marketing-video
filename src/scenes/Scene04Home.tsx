import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bike, Car, Package, Utensils} from 'lucide-react';
import {CLAMP, EASE, float, pop, prog} from '../animations/anim';
import {SimTag} from '../components/brand/Brand';
import {BrandBackdrop} from '../components/bg/Backdrops';
import {Phone, Tap} from '../components/phone/Phone';
import {Headline} from '../components/typography/Headline';
import {CustomerHome} from '../components/ui/CustomerScreens';
import {copy} from '../config/copy';
import {brand, font, serviceColors} from '../config/theme';

const CHIP = [
  {Icon: Utensils, c: serviceColors.food, x: 120, y: 860},
  {Icon: Bike, c: serviceColors.ojek, x: 960, y: 980},
  {Icon: Car, c: serviceColors.car, x: 110, y: 1330},
  {Icon: Package, c: serviceColors.delivery, x: 965, y: 1450},
];

// Beranda aplikasi: HP berputar masuk (3D), ikon layanan muncul, empat chip layanan melayang keluar.
export const Scene04Home: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = prog(frame, 0, 34, EASE);
  const drift = interpolate(frame, [30, 168], [0, 1], CLAMP);
  const servicePop = [0, 1, 2, 3].map((i) => pop(frame, fps, 26 + i * 5));
  const pressT = interpolate(frame, [136, 140, 150], [0, 1, 0], CLAMP);
  return (
    <AbsoluteFill>
      <BrandBackdrop />
      <Phone
        width={600}
        x={540}
        y={interpolate(enter, [0, 1], [2300, 1260])}
        rotateX={interpolate(enter, [0, 1], [32, 6])}
        rotateY={interpolate(enter, [0, 1], [-34, -12]) + drift * 20}
        rotateZ={interpolate(enter, [0, 1], [8, 0])}
        glare={interpolate(frame, [20, 70], [0, 1], CLAMP)}
        captureKey="customerHome"
      >
        <CustomerHome servicePop={servicePop} pressedService={0} pressT={pressT} />
        <Tap x={67} y={312} at={138} frame={frame} />
      </Phone>
      {CHIP.map((ch, i) => {
        const t = pop(frame, fps, 48 + i * 7, 16);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: interpolate(t, [0, 1], [540, ch.x]) - 130 / 2,
              top: interpolate(t, [0, 1], [1260, ch.y]) - 130 / 2 + float(frame, 70, 10, i * 25),
              width: 130,
              height: 130,
              borderRadius: 36,
              background: '#fff',
              boxShadow: '0 24px 48px rgba(42,18,32,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: t,
              transform: `scale(${t})`,
            }}
          >
            <div style={{width: 94, height: 94, borderRadius: 28, background: ch.c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ch.Icon size={50} color={ch.c.color} strokeWidth={2} />
            </div>
          </div>
        );
      })}
      {/* Label layanan berjajar di bawah judul */}
      <div style={{position: 'absolute', left: 80, right: 80, top: 560, display: 'flex', flexWrap: 'wrap', gap: 14}}>
        {copy.S04.services.map((s, i) => {
          const t = prog(frame, 60 + i * 5, 14);
          return (
            <div key={s} style={{fontFamily: font.family, fontSize: 30, fontWeight: 700, color: brand.pinkDark, background: brand.pinkSoft, border: `2px solid ${brand.pinkBorder}`, padding: '8px 20px', borderRadius: 999, opacity: t, transform: `translateY(${(1 - t) * 16}px)`}}>
              {s}
            </div>
          );
        })}
      </div>
      <Headline lines={copy.S04.headline} delay={8} size={80} highlight={[[1, 2]]} />
      <SimTag delay={30} />
    </AbsoluteFill>
  );
};
