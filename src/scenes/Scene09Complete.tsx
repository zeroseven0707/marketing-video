import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CLAMP, EASE, EASE_INOUT, prog} from '../animations/anim';
import {SimTag} from '../components/brand/Brand';
import {BrandBackdrop} from '../components/bg/Backdrops';
import {Phone} from '../components/phone/Phone';
import {Headline} from '../components/typography/Headline';
import {WordReveal} from '../components/typography/Kinetic';
import {CustomerScan} from '../components/ui/CustomerScreens';
import {DriverQr} from '../components/ui/MitraScreens';
import {Qr} from '../components/ui/Qr';
import {copy} from '../config/copy';
import {demo} from '../config/demo';
import {brand} from '../config/theme';

export const S09_FOUND = 86;
export const S09_SUCCESS = 98;

// Penyelesaian: HP pelanggan memindai QR di HP driver, lalu "Pesanan Selesai".
export const Scene09Complete: React.FC<{headline?: readonly string[]; highlight?: [number, number][]; sub?: string}> = ({
  headline = copy.S09.headline,
  highlight = [[1, 0], [1, 1]],
  sub = copy.S09.sub,
}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, 0, 30, EASE);
  const meet = prog(frame, 30, 40, EASE_INOUT);
  const scanLine = (Math.sin(frame / 7) + 1) / 2;
  const found = prog(frame, S09_FOUND, 6);
  const success = prog(frame, S09_SUCCESS, 14);
  const burst = prog(frame, S09_SUCCESS, 30);
  return (
    <AbsoluteFill>
      <BrandBackdrop />
      {/* HP driver (kiri) */}
      <Phone
        width={470}
        x={interpolate(enter, [0, 1], [-200, 320]) + meet * 30}
        y={1180}
        rotateY={interpolate(meet, [0, 1], [28, 18])}
        rotateZ={-4}
        scale={0.96}
        dark
        captureKey="driverQr"
      >
        <DriverQr qr={<Qr value={demo.qrValue} size={230} reveal={prog(frame, 8, 30)} />} />
      </Phone>
      {/* HP pelanggan (kanan, di depan) */}
      <Phone
        width={500}
        x={interpolate(enter, [0, 1], [1300, 800]) - meet * 60}
        y={1260}
        rotateY={interpolate(meet, [0, 1], [-30, -14])}
        rotateZ={4}
        dark
        captureKey="customerScan"
      >
        <CustomerScan scanLine={scanLine} found={found} success={success} qr={<Qr value={demo.qrValue} size={150} />} />
      </Phone>
      {/* Cincin sukses */}
      <div
        style={{
          position: 'absolute',
          left: 800 - 60 - 400,
          top: 1260 - 400,
          width: 800,
          height: 800,
          borderRadius: '50%',
          border: `8px solid ${brand.success}`,
          transform: `scale(${0.2 + burst * 1.2})`,
          opacity: burst > 0 ? (1 - burst) * 0.6 : 0,
        }}
      />
      <Headline lines={headline} delay={4} size={84} highlight={highlight} />
      <div style={{position: 'absolute', left: 80, right: 80, top: 520, opacity: interpolate(frame, [0, 1], [1, 1], CLAMP)}}>
        <WordReveal text={sub} delay={S09_SUCCESS + 6} size={48} weight={700} color={brand.text2} />
      </div>
      <SimTag delay={20} />
    </AbsoluteFill>
  );
};
