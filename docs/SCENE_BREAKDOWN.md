# Rincian Scene (frame-level)

Frame relatif terhadap awal scene (30 fps). Komponen: `src/scenes/SceneNN*.tsx`. Isyarat audio: `src/config/audio.ts` (`sfxCues`).

| Scene | Frame | Masuk | Utama | Keluar | Audio |
|---|---|---|---|---|---|
| S01 (180) | 0–18 fade dari putih · 14 kicker · 26/40 judul per huruf | Langit, 3 bukit, sawah, kelapa, burung | Kamera push sepanjang scene | 150 teks keluar · dissolve 162–180 | Ambience kampung (angin + kicau) 0–6,2 dtk |
| S02 (192) | 4 judul · 26/46/66 panel spring | Ilustrasi panel parallax | Mengambang | Speed-wipe 174–192 | Swipe 0,85/1,5/2,2 dtk |
| S03 (180) | 0/6 garis kecepatan · 8 ikon spring · 10 riak | 40 ikon naik · 46 wordmark · 72 tagline · 96 sub | Kilau 24 | Zoom blur 162–180 | Whoosh −0,3 · pop 0,3 · chime 1,55; hantaman musik di awal scene |
| S04 (168) | 0–34 HP naik + rotasi | 26+ ikon layanan · 48+ chip melayang · 60+ pil | 138 ketukan "Pesan Makanan" | Push 150–168 | Whoosh · pop ×4 · tap 4,6 |
| S05 (192) | 28/42/56/68 tambah menu · 86 Checkout | 94–112 layar bergeser · 112–130 HP ke kiri · 118–168 sorot ringkasan · 122 callout | 170 "Pesan Sekarang" | Pin iris 174–192 | Tap ×6 · swipe · ding 4,1 |
| S06 (192) | 0–30 HP masuk berputar | 10–112 berdering + getar, hitung mundur 4:59→ | 112 "Terima" · 120 centang | Diagonal wipe 174–192 | Dering asli `order_ring.wav` 0,3–3,7 · tap · success |
| S07 (192) | 0–26 HP masuk | 18 saklar Online · 44 tawaran berdering | 88 "Terima & Mulai Perjalanan" · 96 motor masuk · 100–122 HP keluar | Zoom blur 174–192 | Tap · dering 1,5 dtk · tap · whoosh · ambience |
| S08 (168) | 0–30 rute tergambar | 10–168 driver bergerak | 54/66 chip | Push-up 150–168 | Pop ×2 |
| S09 (192) | 0–30 dua HP masuk · 8–38 QR tersusun | 30–70 HP saling mendekat · garis pindai | 86 QR terbaca · 98 "Pesanan Selesai" · 104 sub | Pin iris 174–192 | Whoosh · scan 2,87 · success 3,27 |
| S10 (162) | 6/14/22 simpul spring · 18–70 rute | 60–125 jaringan tumbuh · 70+ titik berputar | Kamera mundur | Speed-wipe 144–162 | Pop ×3 |
| S11 (162) | 0 garis kecepatan · 10 wordmark · 26 tagline | 44 tombol · 58 mitra · 66 domain · 74 wilayah · 70 kilau | Diam | 150–162 fade putih | Whoosh · pop · chime 1,5; akor penutup musik |

## Prinsip yang dijaga
- Semua animasi digerakkan `useCurrentFrame()` + `interpolate()`/`spring()`; tanpa CSS animation, tanpa `Math.random()` (memakai `random(seed)`).
- Satu keluarga easing (`src/animations/anim.ts`).
- Teks penting di antara y=300 dan y=1520 (area aman 9:16). Label simulasi kecil di y≈214.
