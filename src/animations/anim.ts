import {Easing, interpolate, random, spring} from 'remotion';

// Satu keluarga easing untuk seluruh video (ease-out panjang, sama dengan landing:
// cubic-bezier(.22,1,.36,1) di mihp-backend/public/css/landing.css).
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IN = Easing.bezier(0.64, 0, 0.78, 0);
export const EASE_INOUT = Easing.bezier(0.65, 0, 0.35, 1);

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Progres 0..1 dari frame `start` selama `dur` frame.
export const prog = (frame: number, start: number, dur: number, easing = EASE) =>
  interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {...CLAMP, easing});

// 1 di dalam rentang [start, end], memudar di kedua tepi.
export const inRange = (frame: number, start: number, end: number, fadeIn = 10, fadeOut = 8) =>
  Math.min(prog(frame, start, fadeIn), 1 - prog(frame, end - fadeOut, fadeOut, EASE_IN));

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Spring tanpa pantulan untuk elemen UI.
export const pop = (frame: number, fps: number, delay = 0, damping = 18) =>
  spring({frame: frame - delay, fps, config: {damping, stiffness: 140, mass: 0.8}});

// Getaran halus deterministik (mis. HP berdering).
export const shake = (seed: string, frame: number, amp: number) =>
  (random(`${seed}-${frame}`) * 2 - 1) * amp;

// Osilasi pelan (mengambang).
export const float = (frame: number, period: number, amp: number, phase = 0) =>
  Math.sin(((frame + phase) / period) * Math.PI * 2) * amp;
