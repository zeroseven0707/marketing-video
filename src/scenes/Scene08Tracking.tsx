import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bike, MessageCircle} from 'lucide-react';
import {CLAMP, EASE_INOUT, float, pop, prog} from '../animations/anim';
import {SimTag} from '../components/brand/Brand';
import {BrandBackdrop} from '../components/bg/Backdrops';
import {Camera} from '../components/Camera';
import {Phone} from '../components/phone/Phone';
import {Headline} from '../components/typography/Headline';
import {Tracking} from '../components/ui/CustomerScreens';
import {copy} from '../config/copy';
import {brand, font} from '../config/theme';

// Lacak driver: marker berdenyut bergerak di rute pink, kamera mendekat ke peta.
export const Scene08Tracking: React.FC<{headline?: readonly string[]; highlight?: [number, number][]; chips?: readonly string[]}> = ({
  headline = copy.S08.headline,
  highlight = [[1, 0]],
  chips: chipLabels = copy.S08.chips,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = interpolate(frame, [10, 168], [0.08, 0.86], {...CLAMP, easing: EASE_INOUT});
  const showRoute = prog(frame, 0, 30);
  const chips = [pop(frame, fps, 54, 16), pop(frame, fps, 66, 16)];
  const icons = [Bike, MessageCircle];
  const pos = [
    {x: 90, y: 1500},
    {x: 600, y: 1590},
  ];
  return (
    <AbsoluteFill>
      <BrandBackdrop tint="pink" />
      <Camera from={{scale: 1}} to={{scale: 1.08, y: 40}}>
        <Phone width={600} x={540} y={1240} rotateX={interpolate(frame, [0, 168], [10, 4])} rotateY={interpolate(frame, [0, 168], [-8, 8])} captureKey="customerTracking">
          <Tracking frame={frame} progress={progress} showRoute={showRoute} />
        </Phone>
        {chipLabels.map((c, i) => {
          const Icon = icons[i];
          return (
            <div
              key={c}
              style={{
                position: 'absolute',
                left: pos[i].x,
                top: pos[i].y + float(frame, 80, 8, i * 30),
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '18px 26px 18px 18px',
                borderRadius: 999,
                background: '#fff',
                boxShadow: '0 20px 44px rgba(42,18,32,0.18)',
                fontFamily: font.family,
                fontWeight: 700,
                fontSize: 32,
                color: brand.ink,
                opacity: chips[i],
                transform: `scale(${chips[i]})`,
              }}
            >
              <div style={{width: 52, height: 52, borderRadius: 26, background: brand.pinkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Icon size={28} color={brand.pink} />
              </div>
              {c}
            </div>
          );
        })}
      </Camera>
      <Headline lines={headline} delay={4} size={76} highlight={highlight} />
      <SimTag delay={20} />
    </AbsoluteFill>
  );
};
