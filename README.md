# Mihape Launch Ad (Remotion)

Video iklan Mihape 1080×1920 (9:16), 30 fps, H.264, untuk TikTok, Reels, dan Shorts.

| Video | Komposisi | Durasi | Hasil render |
|---|---|---|---|
| Launching (gabungan) | `MihapeLaunchAd` | ±54 dtk | `renders/mihape-launch-ad.mp4` |
| Pelanggan | `MihapeCustomerAd` | 30 dtk | `renders/mihape-pelanggan-30s.mp4` |
| Mitra (driver + toko) | `MihapeMitraAd` | 30 dtk | `renders/mihape-mitra-30s.mp4` |

Naskah video pelanggan dan mitra: `docs/VIDEO_SCRIPT_SEGMENTED.md`.

Project ini terisolasi. Tidak ada file di `mihp-backend`, `mihp-customer`, atau `mihape-mitra` yang diubah, dan aset merek hanya disalin.

## Menjalankan

```bash
cd marketing-video
npm install
npm run audio     # (opsional) buat ulang musik & SFX orisinal ke assets/audio/
npm run studio    # pratinjau di browser (otomatis menyalin assets/ -> public/)
npm run render              # video launching -> renders/mihape-launch-ad.mp4
npm run render:pelanggan    # video pelanggan -> renders/mihape-pelanggan-30s.mp4
npm run render:mitra        # video mitra     -> renders/mihape-mitra-30s.mp4
npm run render:all          # ketiganya
```

Lainnya:
- `npm run render:preview`: render setengah resolusi untuk cek cepat.
- `npm run typecheck`: cek TypeScript.
- `npm run qa -- S04Home:120 S06Merchant:70`: render still dan lembar kontak ke `renders/qa/sheet.png`.

Di Studio, ketiga komposisi utama ada di atas. Folder **Scenes**, **Scenes-Pelanggan**, dan **Scenes-Mitra** berisi pratinjau tiap scene lengkap dengan SFX dan musik pada posisinya.

## Struktur

```
docs/                 discovery produk + konsep, naskah, storyboard, rincian scene, aset
assets/               aset sumber (brand, audio, footage, backgrounds) — salinan, bukan file asli repo produk
captures/             slot screenshot asli aplikasi
public/               dibuat otomatis oleh `npm run sync` (jangan diedit)
renders/              hasil render
scripts/              buat-audio.mjs, sync-public.mjs, qa-stills.sh, qa-sheet.py
src/
  config/             theme, scenes (timing), copy (teks), demo (data contoh), media (slot), audio
  animations/         easing & helper, transisi custom
  components/
    typography/       WordReveal, CharStagger, MaskReveal, Kicker, Headline
    phone/            Phone (mockup 3D), Tap
    ui/               layar aplikasi Customer & Mitra yang direkonstruksi dari source code, MapView, Qr
    world/            ilustrasi kampung (Sky, Hill, RiceTerraces, House, CoconutTree, Rider, WarungFront)
    bg/               BrandBackdrop, DotGrid, SpeedLines, SoftParticles, LightSweep, CinematicGrade
    brand/            Logo, Pin, FootageSlot, SimTag
    Camera.tsx        kamera virtual + parallax
  scenes/             Scene01Opening … Scene11Closing
  compositions/       MihapeLaunchAd, ScenePreview
  audio/              MusicTrack, SceneAudio, SingleVoiceover
```

## Mengedit

| Ingin mengubah | Edit |
|---|---|
| Teks di layar | `src/config/copy.ts` (`S..` launching, `C..` pelanggan, `M..` mitra) |
| Durasi scene, urutan, jenis transisi | `src/config/scenes.ts`: `scenes`, `customerScenes`, `mitraScenes` (total durasi dihitung otomatis) |
| Warna, font, area aman | `src/config/theme.ts` |
| Nama toko, menu, harga, nama driver contoh | `src/config/demo.ts` |
| Volume musik/SFX/VO, fade, isyarat SFX | `src/config/audio.ts` |
| Baris wilayah di end card | `copy.S11.region` (isi `null` untuk menyembunyikan) |

Jenis transisi yang tersedia: `dissolve`, `speedWipe`, `zoomBlur`, `push`, `pushUp`, `pinIris`, `diagonalWipe` (`src/animations/presentations.tsx`).

### Mengganti UI rekonstruksi dengan screenshot asli
1. Simpan PNG (rasio ±9:19,5) di `captures/`, misalnya `captures/customer-home.png`.
2. Isi kunci yang sesuai di `src/config/media.ts`, misalnya `customerHome: 'captures/customer-home.png'`.
3. Screenshot akan tampil di layar HP menggantikan rekonstruksi. Animasi ketukan jari tetap ada, jadi cek posisinya di Studio.

### Memasang footage lokal
1. Simpan MP4 di `assets/footage/`.
2. Isi slot scene di `src/config/media.ts` → `footage`, misalnya `S01Opening: 'assets/footage/sawah-pagi.mp4'`.
3. Jangan menulis nama lokasi di layar bila asal footage belum terverifikasi.

### Menambahkan voice-over (suara manusia)
1. Rekam naskah di `docs/VIDEO_SCRIPT.md`, lalu simpan misalnya `assets/audio/voiceover/vo-full.wav`.
2. Di `src/config/audio.ts`, set `voiceover.src: 'assets/audio/voiceover/vo-full.wav'`. Untuk mode per scene, set `mode: 'per-scene'` lalu isi `perScene`.
3. Musik otomatis diredam (`duckWithVoiceover`). Jalankan `npm run render`.

## Kejujuran konten
- Layar aplikasi adalah **rekonstruksi dari source code**, karena repo tidak berisi screenshot. Label "Ilustrasi tampilan aplikasi · data contoh" dimatikan atas permintaan pemilik produk (`copy.simTag = null`); isi lagi untuk menampilkannya.
- Data toko, menu, harga, driver, plat, dan PIN adalah contoh (`src/config/demo.ts`). Angka pendapatan driver disamarkan.
- Ilustrasi kampung bersifat generik dan tidak diklaim sebagai lokasi tertentu.
- Musik dan SFX orisinal sintetis. Satu-satunya suara produk adalah nada dering asli Mihape Mitra.
- Tidak ada narasi AI.

Rincian lain: `docs/ASSETS_USED.md`, `docs/ASSET_REQUIREMENTS.md`.

## Lisensi Remotion
Remotion gratis untuk individu dan perusahaan sampai 3 orang. Perusahaan yang lebih besar memerlukan Company License (remotion.dev/license).
