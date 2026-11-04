import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import type {TransitionKind} from '../config/scenes';
import {brand} from '../config/theme';
import {CLAMP, EASE, EASE_INOUT} from './anim';

type P = Record<string, unknown>;

const make = <T extends P>(
  component: React.FC<TransitionPresentationComponentProps<T>>,
  props: T,
): TransitionPresentation<T> => ({component, props});

// Zoom + motion blur: scene lama mendekat dan kabur, scene baru masuk dari sedikit membesar.
const ZoomBlur: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress: p}) => {
  const t = EASE_INOUT(p);
  const style: React.CSSProperties =
    presentationDirection === 'exiting'
      ? {transform: `scale(${1 + t * 0.35})`, filter: `blur(${t * 26}px)`, opacity: 1 - interpolate(t, [0.4, 1], [0, 1], CLAMP)}
      : {transform: `scale(${1.25 - t * 0.25})`, filter: `blur(${(1 - t) * 26}px)`, opacity: interpolate(t, [0, 0.55], [0, 1], CLAMP)};
  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

// Sapuan pita pink diagonal dengan garis kecepatan (motif "M" pada logo).
const SpeedWipe: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress: p}) => {
  const t = EASE_INOUT(p);
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill style={{transform: `translateX(${-t * 180}px)`}}>{children}</AbsoluteFill>;
  }
  // Tepi sapuan bergerak dari kanan ke kiri, miring 18 derajat.
  const edge = interpolate(t, [0, 1], [125, -40]);
  const skew = 22;
  const clip = `polygon(${edge}% 0%, 140% 0%, 140% 100%, ${edge - skew}% 100%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: clip}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {[0, 1, 2].map((i) => {
          const e = edge + i * 5.5;
          const w = [9, 4, 2][i];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                clipPath: `polygon(${e}% 0%, ${e + w}% 0%, ${e + w - skew}% 100%, ${e - skew}% 100%)`,
                background: i === 0 ? `linear-gradient(180deg, ${brand.pinkLight}, ${brand.pink})` : brand.pinkLight,
                opacity: [1, 0.75, 0.5][i] * interpolate(t, [0, 0.08, 0.92, 1], [0, 1, 1, 0], CLAMP),
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Lingkaran terbuka dari titik pin lokasi, dengan cincin pink di tepinya.
const PinIris: React.FC<TransitionPresentationComponentProps<{x: number; y: number}>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
  passedProps,
}) => {
  const t = EASE(p);
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill style={{transform: `scale(${1 + t * 0.08})`, filter: `brightness(${1 - t * 0.15})`}}>{children}</AbsoluteFill>;
  }
  const {x, y} = passedProps;
  const r = t * 2300;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${r}px at ${x}px ${y}px)`}}>{children}</AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          border: `${10 * (1 - t) + 2}px solid ${brand.pinkLight}`,
          opacity: 1 - t,
        }}
      />
    </AbsoluteFill>
  );
};

// Wipe diagonal dengan tepi lembut.
const DiagonalWipe: React.FC<TransitionPresentationComponentProps<P>> = ({children, presentationDirection, presentationProgress: p}) => {
  const t = EASE_INOUT(p);
  if (presentationDirection === 'exiting') {
    return <AbsoluteFill style={{transform: `translate(${t * 60}px, ${-t * 60}px)`}}>{children}</AbsoluteFill>;
  }
  const a = interpolate(t, [0, 1], [-30, 130]);
  return (
    <AbsoluteFill
      style={{
        WebkitMaskImage: `linear-gradient(225deg, black ${a - 12}%, transparent ${a}%)`,
        maskImage: `linear-gradient(225deg, black ${a - 12}%, transparent ${a}%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const presentationFor = (kind: TransitionKind, origin?: {x: number; y: number}): TransitionPresentation<any> => {
  switch (kind) {
    case 'dissolve':
      return fade();
    case 'push':
      return slide({direction: 'from-right'});
    case 'pushUp':
      return slide({direction: 'from-bottom'});
    case 'zoomBlur':
      return make(ZoomBlur, {});
    case 'speedWipe':
      return make(SpeedWipe, {});
    case 'pinIris':
      return make(PinIris, origin ?? {x: 540, y: 960});
    case 'diagonalWipe':
      return make(DiagonalWipe, {});
  }
};
