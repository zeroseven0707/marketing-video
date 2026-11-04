import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP} from '../animations/anim';

export type Pose = {x?: number; y?: number; scale?: number; rotate?: number};

const CameraCtx = createContext({x: 0, y: 0});

// Kamera virtual: bergerak halus sepanjang scene. <Layer depth> di dalamnya bergeser
// sebanding dengan depth sehingga terbentuk parallax.
export const Camera: React.FC<{from?: Pose; to?: Pose; children: React.ReactNode}> = ({from = {}, to = {}, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const lerp = (a = 0, b = a) => a + (b - a) * t;
  const x = lerp(from.x, to.x ?? from.x);
  const y = lerp(from.y, to.y ?? from.y);
  const scale = lerp(from.scale ?? 1, to.scale ?? from.scale ?? 1);
  const rotate = lerp(from.rotate, to.rotate ?? from.rotate);
  return (
    <CameraCtx.Provider value={{x, y}}>
      <AbsoluteFill style={{transform: `scale(${scale}) rotate(${rotate}deg)`}}>{children}</AbsoluteFill>
    </CameraCtx.Provider>
  );
};

export const Layer: React.FC<{depth?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  depth = 1,
  children,
  style,
}) => {
  const cam = useContext(CameraCtx);
  return <AbsoluteFill style={{transform: `translate(${-cam.x * depth}px, ${-cam.y * depth}px)`, ...style}}>{children}</AbsoluteFill>;
};
