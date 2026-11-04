// Urutan scene, durasi, dan transisi. Satu-satunya sumber timing video.
// Total = jumlah durasi scene - jumlah durasi transisi (transisi saling tumpang).

export type TransitionKind =
  | 'dissolve' // cinematic fade
  | 'speedWipe' // sapuan pita pink + garis kecepatan (motif logo "M")
  | 'zoomBlur' // zoom + motion blur
  | 'push' // dorong horizontal (alur UI)
  | 'pushUp' // dorong vertikal
  | 'pinIris' // lingkaran terbuka dari titik pin lokasi
  | 'diagonalWipe';

export type SceneId =
  | 'S01Opening'
  | 'S02Needs'
  | 'S03Intro'
  | 'S04Home'
  | 'S05OrderFood'
  | 'S06Merchant'
  | 'S07Driver'
  | 'S08Tracking'
  | 'S09Complete'
  | 'S10Ecosystem'
  | 'S11Closing';

export type SceneConfig = {
  id: SceneId;
  title: string;
  durationSec: number;
  // Transisi MENUJU scene berikutnya.
  transitionOut?: {kind: TransitionKind; sec: number; origin?: {x: number; y: number}};
};

const T = 0.6;

export const scenes: SceneConfig[] = [
  {id: 'S01Opening', title: 'Pembuka: kampung kita', durationSec: 6.0, transitionOut: {kind: 'speedWipe', sec: T}},
  {id: 'S03Intro', title: 'Kenalan dengan Mihape', durationSec: 6.0, transitionOut: {kind: 'zoomBlur', sec: T}},
  {id: 'S04Home', title: 'Beranda aplikasi', durationSec: 5.6, transitionOut: {kind: 'push', sec: T}},
  {id: 'S05OrderFood', title: 'Pesan makanan', durationSec: 6.4, transitionOut: {kind: 'pinIris', sec: T, origin: {x: 540, y: 1180}}},
  {id: 'S06Merchant', title: 'Warung menerima pesanan', durationSec: 6.4, transitionOut: {kind: 'diagonalWipe', sec: T}},
  {id: 'S07Driver', title: 'Driver lokal mengantar', durationSec: 6.4, transitionOut: {kind: 'zoomBlur', sec: T}},
  {id: 'S08Tracking', title: 'Lacak driver', durationSec: 5.6, transitionOut: {kind: 'pushUp', sec: T}},
  {id: 'S09Complete', title: 'Selesai dengan scan QR', durationSec: 6.4, transitionOut: {kind: 'pinIris', sec: T, origin: {x: 540, y: 960}}},
  {id: 'S10Ecosystem', title: 'Ekosistem lokal', durationSec: 5.4, transitionOut: {kind: 'speedWipe', sec: T}},
  {id: 'S11Closing', title: 'Penutup & ajakan', durationSec: 5.4},
];

export const fps = 30;
export const frames = (sec: number) => Math.round(sec * fps);

// Frame mulai absolut tiap scene di video utama.
export const sceneStarts = (() => {
  let at = 0;
  return scenes.map((s) => {
    const start = at;
    at += frames(s.durationSec) - (s.transitionOut ? frames(s.transitionOut.sec) : 0);
    return {id: s.id, start, frames: frames(s.durationSec)};
  });
})();

export const totalFrames = sceneStarts[sceneStarts.length - 1].start + sceneStarts[sceneStarts.length - 1].frames;

export const startOf = (id: SceneId) => sceneStarts.find((s) => s.id === id)!.start;
