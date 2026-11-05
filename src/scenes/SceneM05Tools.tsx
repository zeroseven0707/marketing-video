import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Clock, MapPin, Megaphone, ReceiptText, Ticket, Wallet} from 'lucide-react';
import {float, pop, prog} from '../animations/anim';
import {Logo} from '../components/brand/Brand';
import {BrandBackdrop, SoftParticles} from '../components/bg/Backdrops';
import {Headline} from '../components/typography/Headline';
import {copy} from '../config/copy';
import {brandFiles} from '../config/media';
import {brand, font} from '../config/theme';

const ICONS = [ReceiptText, MapPin, Clock, Megaphone, Ticket, Wallet];

// Fitur driver dan warung dalam satu grid (satu aplikasi Mihape Mitra), muncul berurutan.
export const SceneM05Tools: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <BrandBackdrop tint="pink" />
      <SoftParticles count={10} seed="m05" />
      {copy.M05.tools.map((tool, i) => {
        const Icon = ICONS[i];
        const t = pop(frame, fps, 20 + i * 8, 15);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={tool}
            style={{
              position: 'absolute',
              left: 80 + col * 470,
              top: 680 + row * 290 + float(frame, 90, 6, i * 18),
              width: 450,
              height: 260,
              borderRadius: 40,
              background: '#fff',
              boxShadow: '0 24px 50px rgba(42,18,32,0.14)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 34,
              boxSizing: 'border-box',
              opacity: t,
              transform: `translateY(${(1 - t) * 80}px) scale(${0.9 + 0.1 * t})`,
            }}
          >
            <div style={{width: 84, height: 84, borderRadius: 26, background: brand.pinkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon size={46} color={brand.pink} strokeWidth={2} />
            </div>
            <div style={{fontFamily: font.family, fontWeight: 800, fontSize: 38, lineHeight: 1.12, letterSpacing: -0.8, color: brand.ink}}>{tool}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1600, display: 'flex', justifyContent: 'center', opacity: prog(frame, 70, 16)}}>
        <Logo src={brandFiles.mitraWordmark} width={300} />
      </div>
      <Headline lines={copy.M05.headline} delay={4} size={80} highlight={[[1, 1], [1, 2]]} />
    </AbsoluteFill>
  );
};
