// Konfigurasi audio. Path relatif terhadap public/ (sumber: assets/audio/, disalin oleh `npm run sync`).
// Set src ke null untuk mematikan track. Semua volume 0..1.
import type {SceneId} from './scenes';

export const audioConfig = {
  masterVolume: 1,

  music: {
    // Musik orisinal sintetis buatan scripts/buat-audio.mjs (bebas hak cipta pihak lain).
    // Ganti dengan musik berlisensi Anda, mis. 'assets/audio/music/musik-saya.mp3'.
    // Dimatikan atas permintaan pemilik produk (semua video tanpa musik latar, SFX tetap).
    // Isi lagi dengan 'assets/audio/music/mihape-bgm.wav' untuk menyalakan.
    src: null as string | null,
    volume: 0.66,
    fadeInSec: 1.0,
    fadeOutSec: 2.5,
    // Pengali volume musik saat voice-over aktif (ducking).
    duckWithVoiceover: 0.45,
  },

  voiceover: {
    // Rekaman suara manusia. Naskah: docs/VIDEO_SCRIPT.md. Tidak ada suara AI yang dibuat.
    // 'single' = satu file untuk seluruh video; 'per-scene' = isi `perScene` di bawah.
    mode: 'single' as 'single' | 'per-scene',
    src: null as string | null, // mis. 'assets/audio/voiceover/vo-full.wav'
    perScene: {} as Partial<Record<SceneId, string>>, // mis. {S01Opening: 'assets/audio/voiceover/s01.wav'}
    volume: 1,
    offsetSec: 0.2,
    fadeInSec: 0.1,
    fadeOutSec: 0.3,
  },

  sfx: {
    enabled: true,
    volume: 0.6,
    fadeOutSec: 0.15,
    files: {
      whoosh: 'assets/audio/sfx/whoosh.wav',
      swipe: 'assets/audio/sfx/swipe.wav',
      pop: 'assets/audio/sfx/pop.wav',
      tap: 'assets/audio/sfx/tap.wav',
      ding: 'assets/audio/sfx/ding.wav',
      chime: 'assets/audio/sfx/chime.wav',
      scan: 'assets/audio/sfx/scan.wav',
      success: 'assets/audio/sfx/success.wav',
      // Nada dering asli aplikasi Mitra (mihape-mitra/assets/sounds/order_ring.wav).
      ring: 'assets/audio/sfx/order_ring.wav',
      ambience: 'assets/audio/sfx/ambience-kampung.wav',
      studioReveal: 'assets/audio/sfx/studio-reveal.wav',
    },
  },
};

export type SfxName = keyof typeof audioConfig.sfx.files;

// Isyarat SFX per scene: detik relatif terhadap awal scene. `dur` membatasi panjang (detik).
export type SfxCue = {name: SfxName; at: number; volume?: number; dur?: number};

export const sfxCues: Partial<Record<SceneId, SfxCue[]>> = {
  S01Opening: [
    {name: 'ambience', at: 0, volume: 0.45, dur: 3.6},
    {name: 'studioReveal', at: 0.4, volume: 0.45, dur: 5.6},
    {name: 'whoosh', at: 3.3, volume: 0.9},
    {name: 'pop', at: 3.97, volume: 0.7},
    {name: 'chime', at: 4.0, volume: 0.9},
  ],
  S02Needs: [
    {name: 'swipe', at: 0.85, volume: 0.6},
    {name: 'swipe', at: 1.5, volume: 0.6},
    {name: 'swipe', at: 2.2, volume: 0.6},
  ],
  S03Intro: [
    {name: 'whoosh', at: -0.3, volume: 0.9},
    {name: 'pop', at: 0.3, volume: 0.8},
    {name: 'chime', at: 1.55, volume: 0.8},
  ],
  S04Home: [
    {name: 'whoosh', at: 0.05, volume: 0.6},
    {name: 'pop', at: 1.6, volume: 0.5},
    {name: 'pop', at: 1.85, volume: 0.45},
    {name: 'pop', at: 2.1, volume: 0.45},
    {name: 'pop', at: 2.35, volume: 0.45},
    {name: 'tap', at: 4.6, volume: 0.8},
  ],
  S05OrderFood: [
    {name: 'tap', at: 0.93, volume: 0.7},
    {name: 'tap', at: 1.4, volume: 0.6},
    {name: 'tap', at: 1.87, volume: 0.7},
    {name: 'tap', at: 2.27, volume: 0.6},
    {name: 'tap', at: 2.87, volume: 0.7},
    {name: 'swipe', at: 3.15, volume: 0.5},
    {name: 'ding', at: 4.1, volume: 0.55},
    {name: 'tap', at: 5.67, volume: 0.8},
  ],
  S06Merchant: [
    {name: 'ring', at: 0.3, volume: 0.55, dur: 3.4},
    {name: 'tap', at: 3.73, volume: 0.9},
    {name: 'success', at: 4.05, volume: 0.6},
  ],
  S07Driver: [
    {name: 'tap', at: 0.6, volume: 0.7},
    {name: 'ring', at: 1.47, volume: 0.5, dur: 1.5},
    {name: 'tap', at: 2.93, volume: 0.9},
    {name: 'whoosh', at: 3.3, volume: 0.7},
    {name: 'ambience', at: 3.2, volume: 0.35, dur: 3.2},
  ],
  S08Tracking: [
    {name: 'pop', at: 1.8, volume: 0.5},
    {name: 'pop', at: 2.2, volume: 0.5},
  ],
  S09Complete: [
    {name: 'whoosh', at: 0.1, volume: 0.5},
    {name: 'scan', at: 2.87, volume: 0.8},
    {name: 'success', at: 3.27, volume: 0.8},
  ],
  S10Ecosystem: [
    {name: 'pop', at: 0.2, volume: 0.5},
    {name: 'pop', at: 0.47, volume: 0.5},
    {name: 'pop', at: 0.73, volume: 0.5},
  ],
  S11Closing: [
    {name: 'whoosh', at: -0.3, volume: 0.8},
    {name: 'pop', at: 1.47, volume: 0.6},
    {name: 'chime', at: 1.5, volume: 0.9},
  ],
};

// Video pelanggan & mitra: scene yang memakai ulang scene launching memakai isyarat yang sama.
Object.assign(sfxCues, {
  C01Hook: [
    {name: 'pop', at: 0.2, volume: 0.5},
    {name: 'pop', at: 0.37, volume: 0.45},
    {name: 'pop', at: 0.53, volume: 0.45},
    {name: 'pop', at: 0.7, volume: 0.45},
    {name: 'whoosh', at: 2.1, volume: 0.9},
    {name: 'chime', at: 2.55, volume: 0.8},
  ],
  C02Services: sfxCues.S04Home,
  // Ketukan "Pesan Sekarang" mundur 0,8 dtk (hold di C03Order)
  C03Order: sfxCues.S05OrderFood!.map((c) => (c.at === 5.67 ? {...c, at: 6.47} : c)),
  C04Tracking: sfxCues.S08Tracking,
  C05Complete: sfxCues.S09Complete,
  C06Closing: [
    {name: 'whoosh', at: -0.3, volume: 0.8},
    {name: 'pop', at: 1.6, volume: 0.6},
    {name: 'chime', at: 1.65, volume: 0.9},
  ],
  M01Hook: [
    {name: 'ambience', at: 0, volume: 0.3, dur: 2.4},
    {name: 'pop', at: 0.2, volume: 0.6},
    {name: 'pop', at: 0.8, volume: 0.6},
    {name: 'whoosh', at: 2.25, volume: 0.9},
    {name: 'chime', at: 2.7, volume: 0.8},
  ],
  M02Store: sfxCues.S06Merchant,
  M03Driver: sfxCues.S07Driver,
  M04Complete: sfxCues.S09Complete,
  M05Tools: [
    {name: 'pop', at: 0.73, volume: 0.5},
    {name: 'pop', at: 1.0, volume: 0.5},
    {name: 'pop', at: 1.27, volume: 0.5},
    {name: 'pop', at: 1.53, volume: 0.5},
    {name: 'pop', at: 1.8, volume: 0.5},
    {name: 'pop', at: 2.07, volume: 0.5},
  ],
  M06Closing: [
    {name: 'whoosh', at: -0.3, volume: 0.8},
    {name: 'pop', at: 1.2, volume: 0.5},
    {name: 'pop', at: 1.67, volume: 0.5},
    {name: 'pop', at: 2.13, volume: 0.5},
    {name: 'chime', at: 2.8, volume: 0.9},
  ],
} satisfies Partial<Record<SceneId, SfxCue[]>>);
