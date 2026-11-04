# Aset yang Dipakai di Video

Semua aset asli **disalin**, tidak dipindah atau diubah. Salinan berada di `marketing-video/assets/` dan otomatis disinkronkan ke `public/` oleh `npm run sync`.

## Merek (disalin dari repo produk)
| File di video | Sumber asli | Dipakai di |
|---|---|---|
| `assets/brand/mihape-wordmark-1280.png` | `mihp-customer/assets/images/mihp-logo.png` | S03, S11 (latar terang) |
| `assets/brand/mihape-wordmark-640-clean.png` | `mihp-backend/public/images/brand/mihp-logo.png` | cadangan (transparan bersih) |
| `assets/brand/mihape-mitra-wordmark.png` | `mihape-mitra/assets/images/mitra-logo.png` | S06 |
| `assets/brand/mihape-app-icon.png` | `mihp-customer/assets/images/mihp-icon.png` | S03 |
| `assets/brand/mitra-app-icon.png` | `mihape-mitra/assets/images/mitra-icon.png` | S11 |
| `assets/brand/mihape-symbol-pink.png`, `mihape-symbol-white.png` | `mihp-customer/assets/images/mihp-adaptive.png`, `mihape-mitra/assets/images/mitra-adaptive.png` | cadangan |
| `assets/brand/pin-favicon.svg` | `mihp-backend/public/images/brand/favicon.svg` | path pin dipakai ulang di `src/components/brand/Brand.tsx` (S02, transisi) |

## Audio
| File | Asal | Dipakai di |
|---|---|---|
| `assets/audio/sfx/order_ring.wav` | Salinan asli `mihape-mitra/assets/sounds/order_ring.wav` | S06, S07 (dipotong 3,4 dtk dan 1,5 dtk) |
| `assets/audio/music/mihape-bgm.wav` | Dibuat `scripts/buat-audio.mjs` (orisinal sintetis, 99,54 BPM, petikan gaya kecapi) | Seluruh video |
| `assets/audio/sfx/{whoosh,swipe,pop,tap,ding,chime,scan,success,ambience-kampung}.wav` | Dibuat `scripts/buat-audio.mjs` | Lihat `sfxCues` di `src/config/audio.ts` |

## Font
Plus Jakarta Sans (OFL), dimuat lewat `@remotion/google-fonts`. UI aplikasi memakai font sistem, sama seperti aplikasi aslinya.

## Ikon
`lucide-react` 0.469.0 (ISC). Nama ikon sama dengan `lucide-react-native` yang dipakai aplikasi.

## Dibuat dengan kode (bukan file)
- Ilustrasi kampung (`src/components/world/`): langit, bukit, sawah terasering, rumah genteng, pohon kelapa, warung, pengendara motor, peta kampung. Generik, tidak mewakili lokasi tertentu.
- Rekonstruksi UI (`src/components/ui/`) dari source code; rujukan `file:baris` ada di komentar tiap komponen.
- QR code asli (paket `qrcode`) berisi teks `MIHAPE-DEMO-ILUSTRASI`, bukan token pesanan.

## Data contoh (bukan data nyata)
`src/config/demo.ts`: "Warung Nasi Sunda", menu, harga, "Kang Asep", plat "Z 1234 MH", PIN, dan kode pesanan. Semuanya fiktif, dan scene UI diberi label "Ilustrasi tampilan aplikasi · data contoh". Angka pendapatan driver disamarkan.
