import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, EASE, EASE_INOUT, pop, prog} from '../animations/anim';
import {SimTag} from '../components/brand/Brand';
import {BrandBackdrop} from '../components/bg/Backdrops';
import {Camera} from '../components/Camera';
import {Phone, Tap} from '../components/phone/Phone';
import {Headline} from '../components/typography/Headline';
import {Checkout, StoreMenu} from '../components/ui/CustomerScreens';
import {copy} from '../config/copy';
import {brand, font} from '../config/theme';

// Ketukan di layar toko (koordinat layar aplikasi 390x844).
const TAPS = {add0: {x: 104, y: 492, at: 28}, plus0: {x: 164, y: 492, at: 42}, add2: {x: 104, y: 717, at: 56}, plus2: {x: 164, y: 717, at: 68}, checkout: {x: 318, y: 786, at: 86}, confirm: {x: 284, y: 788, at: 170}};

// Pesan makanan: tambah menu ke keranjang, lanjut ke ringkasan pembayaran yang transparan.
export const Scene05OrderFood: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const qty = [frame >= TAPS.plus0.at ? 2 : frame >= TAPS.add0.at ? 1 : 0, 0, frame >= TAPS.plus2.at ? 2 : frame >= TAPS.add2.at ? 1 : 0, 0];
  const cartT = prog(frame, TAPS.add0.at, 14);
  // Pindah layar di dalam HP: toko -> checkout (dorong dari kanan).
  const swap = prog(frame, 94, 18, EASE_INOUT);
  const highlight = interpolate(frame, [118, 130, 160, 168], [0, 1, 1, 0], CLAMP);
  const scrollY = interpolate(frame, [104, 126], [0, 50], {...CLAMP, easing: EASE});
  // HP bergeser ke kiri memberi ruang untuk callout.
  const shiftX = interpolate(frame, [112, 130, 168, 180], [0, -150, -150, 0], {...CLAMP, easing: EASE});
  const confirmPressed = interpolate(frame, [168, 171, 178], [0, 1, 0], CLAMP);
  const callout = pop(frame, fps, 122, 18);
  return (
    <AbsoluteFill>
      <BrandBackdrop />
      <Camera from={{scale: 1}} to={{scale: 1.05, y: 30}}>
        <Phone width={580} x={540 + shiftX} y={1250} rotateY={interpolate(frame, [0, 192], [6, -6])} rotateX={4} captureKey={swap < 0.5 ? 'customerStore' : 'customerCheckout'}>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${-swap * 390}px)`}}>
            <StoreMenu qty={qty} cartT={cartT} addPressed={frame >= TAPS.add0.at - 3 && frame < TAPS.add0.at ? 0 : -1} />
          </div>
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - swap) * 390}px)`, boxShadow: '-12px 0 30px rgba(0,0,0,0.12)'}}>
            <Checkout highlight={highlight} confirmPressed={confirmPressed} scrollY={scrollY} />
          </div>
          {Object.values(TAPS).map((t, i) => (
            <Tap key={i} x={t.x} y={t.y} at={t.at} frame={frame} />
          ))}
        </Phone>
        {/* Callout di luar HP menunjuk ringkasan pembayaran */}
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: 1180,
            transform: `scale(${callout}) translateY(${(1 - callout) * 20}px)`,
            transformOrigin: 'left center',
            opacity: callout * (1 - prog(frame, 176, 10)),
            background: brand.ink,
            color: '#fff',
            fontFamily: font.family,
            fontWeight: 700,
            fontSize: 32,
            lineHeight: 1.2,
            padding: '22px 28px',
            borderRadius: 28,
            maxWidth: 380,
            boxShadow: '0 24px 50px rgba(42,18,32,0.3)',
          }}
        >
          <span style={{color: brand.pinkLight}}>✓ </span>
          {copy.S05.callout}
        </div>
      </Camera>
      <Headline lines={copy.S05.headline} delay={4} size={80} highlight={[[1, 1]]} />
      <SimTag delay={20} />
    </AbsoluteFill>
  );
};
