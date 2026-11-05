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
  | 'S11Closing'
  // Video pelanggan
  | 'C01Hook'
  | 'C02Services'
  | 'C03Order'
  | 'C04Tracking'
  | 'C05Complete'
  | 'C06Closing'
  // Video mitra
  | 'M01Hook'
  | 'M02Store'
  | 'M03Driver'
  | 'M04Complete'
  | 'M05Tools'
  | 'M06Closing';

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

// Video pelanggan & mitra: 30 detik (jumlah durasi 32,5 dtk - 5 transisi x 0,5 dtk).
const T2 = 0.5;

export const customerScenes: SceneConfig[] = [
  {id: 'C01Hook', title: 'Hook: lapar tapi malas keluar', durationSec: 4.4, transitionOut: {kind: 'speedWipe', sec: T2}},
  {id: 'C02Services', title: 'Empat layanan', durationSec: 5.0, transitionOut: {kind: 'push', sec: T2}},
  {id: 'C03Order', title: 'Pesan, ongkos & cara bayar', durationSec: 6.8, transitionOut: {kind: 'pinIris', sec: T2, origin: {x: 540, y: 1180}}},
  {id: 'C04Tracking', title: 'Lacak driver', durationSec: 4.8, transitionOut: {kind: 'pushUp', sec: T2}},
  {id: 'C05Complete', title: 'Selesai scan QR', durationSec: 5.6, transitionOut: {kind: 'pinIris', sec: T2, origin: {x: 540, y: 960}}},
  {id: 'C06Closing', title: 'Ajakan unduh', durationSec: 5.9},
];

export const mitraScenes: SceneConfig[] = [
  // Satu alur pesanan: warung menerima -> driver terdekat mengantar -> pelanggan scan QR
  {id: 'M01Hook', title: 'Hook: warung & motor', durationSec: 4.4, transitionOut: {kind: 'speedWipe', sec: T2}},
  {id: 'M02Store', title: 'Warung terima pesanan', durationSec: 5.8, transitionOut: {kind: 'push', sec: T2}},
  {id: 'M03Driver', title: 'Driver terdekat dapat tawaran', durationSec: 6.0, transitionOut: {kind: 'pinIris', sec: T2, origin: {x: 540, y: 1180}}},
  {id: 'M04Complete', title: 'Pelanggan scan QR', durationSec: 5.4, transitionOut: {kind: 'pushUp', sec: T2}},
  {id: 'M05Tools', title: 'Semua dalam satu aplikasi', durationSec: 5.0, transitionOut: {kind: 'speedWipe', sec: T2}},
  {id: 'M06Closing', title: 'Ajakan daftar', durationSec: 5.9},
];

export const fps = 30;
export const frames = (sec: number) => Math.round(sec * fps);

// Frame mulai absolut tiap scene dalam satu video.
export const timeline = (list: SceneConfig[]) => {
  let at = 0;
  const starts = list.map((s) => {
    const start = at;
    at += frames(s.durationSec) - (s.transitionOut ? frames(s.transitionOut.sec) : 0);
    return {id: s.id, start, frames: frames(s.durationSec)};
  });
  const last = starts[starts.length - 1];
  return {starts, total: last.start + last.frames};
};

export const videos = {
  launch: {id: 'MihapeLaunchAd', scenes, ...timeline(scenes)},
  customer: {id: 'MihapeCustomerAd', scenes: customerScenes, ...timeline(customerScenes)},
  mitra: {id: 'MihapeMitraAd', scenes: mitraScenes, ...timeline(mitraScenes)},
} as const;

export type VideoKey = keyof typeof videos;

// Video launching (dipakai komponen lama).
export const sceneStarts = videos.launch.starts;
export const totalFrames = videos.launch.total;

// Frame mulai scene di video mana pun tempat scene itu berada.
export const startOf = (id: SceneId) =>
  Object.values(videos).flatMap((v) => v.starts).find((s) => s.id === id)!.start;
