# Inventaris Aset untuk Video

Daftar ini diambil langsung dari disk pada 4 November 2026 (`find` + `sips`), tanpa `node_modules`, `vendor`, dan `.git`. **Aset asli tidak diubah.** Untuk produksi, salin aset ke folder `marketing-video/` dan olah salinannya saja.

Kolom **Pakai?**:
- **Utama**: direkomendasikan.
- **Cadangan**: bisa dipakai, tetapi ada versi yang lebih baik.
- **Jangan**: merek lama atau tidak layak.

---

## 1. Logo dan wordmark

| File asli | Format | Dimensi | Ukuran | Transparan | Isi | Pakai? |
|---|---|---|---|---|---|---|
| `mihp-customer/assets/images/mihp-logo.png` | PNG RGBA | 1280×367 | 448 KB | Hampir (latar alpha ≈2/255, tidak 0) | Wordmark "Mihape": M pita + garis kecepatan, pin lokasi di atas "i" | **Utama** (resolusi tertinggi). Di latar gelap, bersihkan alpha di salinan |
| `mihp-backend/public/images/brand/mihp-logo.png` | PNG RGBA | 640×212 | 139 KB | Ya | Wordmark yang sama | **Utama** untuk latar non-putih (bersih) |
| `mihp-customer/assets/images/mihp-logo-app.webp` | WebP RGBA | 720×207 | 111 KB | Ya | Wordmark yang sama | Cadangan |
| `mihp-backend/public/admin-assets/img/mihp-logo.png` | PNG RGBA | 512×170 | 93 KB | Ya | Wordmark (versi admin) | Cadangan |
| `mihape-mitra/assets/images/mitra-logo.png` | PNG RGBA | 1257×507 | 239 KB | Ya | Wordmark Mihape + pil pink "Mitra" | **Utama** (segmen mitra) |
| `mihp-backend/public/images/brand/mitra-logo.png` | PNG RGBA | 640×258 | 78 KB | Ya | Wordmark + pil "Mitra" | Cadangan |
| `mihape-mitra/assets/images/mitra-logo-app.webp` | WebP RGBA | 720×291 | 28 KB | Ya | Wordmark + "Mitra" | Cadangan |
| `mihp-backend/public/images/brand/mihp-driver.png` | PNG RGBA | 640×268 | 178 KB | Ya | Wordmark + pil "Driver" (aplikasi lama, tidak dirujuk) | Opsional, untuk label segmen driver |
| `mihp-backend/public/images/brand/mihp-merchant.png` | PNG RGBA | 640×267 | 181 KB | Ya | Wordmark + pil "Merchant" (aplikasi lama) | Opsional. Merek saat ini memakai istilah "Toko" |
| `mihp-backend/public/images/brand/mihp-icon.png` | PNG RGBA | 512×512 | 55 KB | Ya | Wordmark kecil di kanvas kosong | Jangan (banyak ruang kosong) |

Dipakai di: splash Customer (`mihp-customer/app.json:12`), splash Mitra (`mihape-mitra/app.json:12`), navbar/footer/OG landing (`mihp-backend/resources/views/layouts/site.blade.php`), dan seksi Mitra landing (`mihp-backend/resources/views/welcome.blade.php`).

## 2. Ikon aplikasi dan simbol

| File asli | Format | Dimensi | Isi | Pakai? |
|---|---|---|---|---|
| `mihp-customer/assets/images/mihp-icon.png` | PNG RGB (tanpa alpha) | 1024×1024 | "M" pita pink + garis kecepatan di atas putih (ikon app Mihape) | **Utama** (app icon, end card) |
| `mihp-customer/assets/images/mihp-adaptive.png` | PNG RGBA | 1024×1024 | Simbol "M" pink, ±90% transparan | **Utama** (animasi simbol) |
| `mihape-mitra/assets/images/mitra-icon.png` | PNG RGB | 1024×1024 | "M" putih + garis kecepatan di atas gradien pink (ikon app Mitra) | **Utama** |
| `mihape-mitra/assets/images/mitra-adaptive.png` | PNG RGBA | 1024×1024 | "M" putih transparan | **Utama** (overlay di latar pink) |
| `mihape-mitra/assets/images/mitra-adaptive-bg.png` | PNG RGB | 1024×1024 | Gradien pink polos diagonal | **Utama** (latar/transisi) |
| `mihp-backend/public/images/brand/mihape-app-icon.png` | PNG RGB | 256×256 | Ikon app Mihape | Cadangan (kecil) |
| `mihp-backend/public/images/brand/mitra-app-icon.png` | PNG RGB | 256×256 | Ikon app Mitra | Cadangan (kecil) |
| `mihp-backend/public/images/brand/favicon.svg` | **SVG** | viewBox 64 | Kotak membulat gradien `#FE679F→#D81B60` + pin lokasi putih + titik `#E61A64` | **Utama** (satu-satunya vektor; bisa di-scale bebas) |
| `mihp-backend/public/images/brand/apple-touch-icon.png` | PNG | 180×180 | Pin lokasi putih di kotak pink | Cadangan |
| `mihp-backend/public/images/brand/favicon.png`, `public/admin-assets/img/favicon.png` | PNG | 64×64 | favicon | Jangan (terlalu kecil) |
| `mihp-backend/public/favicon.ico` | ICO | 0 byte | kosong | Jangan |

## 3. Aset merek lama (JANGAN DIPAKAI)

| File | Isi | Alasan |
|---|---|---|
| `mihp-backend/public/admin-assets/img/mihp.png` (1254×1254) | Logo hijau "MIHP" dengan siluet pengendara | Merek lama (proyek "SIRI"), tidak dirujuk |
| `mihp-backend/public/admin-assets/img/logo-dark.png` (1004×995) | Huruf "P" hijau dengan garis kecepatan | Merek lama / tidak terkait |
| `mihp-backend/public/css/styles.css`, `public/js/script.js` | Gaya landing lama hijau `#16a34a` | Tidak dirujuk |

## 4. Audio

| File asli | Format | Durasi | Isi | Pakai? |
|---|---|---|---|---|
| `mihape-mitra/assets/sounds/order_ring.wav` | WAV PCM mono 22,05 kHz 16-bit, 850 KB | 19,64 detik | Nada dering pesanan masuk (driver & toko) | **Utama** untuk momen "Pesanan Baru!" (suara asli produk). Audio **belum didengar**, jadi cek dulu |

Tidak ada musik, jingle, atau voice-over di repo.

## 5. Font

| Font | Lokasi | Catatan |
|---|---|---|
| **Plus Jakarta Sans** 400–800 | Tidak ada di repo. Dimuat dari Google Fonts (`mihp-backend/resources/views/layouts/site.blade.php:23`) | **Utama** untuk video; unduh dari Google Fonts (lisensi OFL) |
| Jost Regular/Medium/SemiBold/Bold | `mihp-backend/public/admin-assets/vendor_assets/fonts/Jost-*.ttf` | Font admin; tidak disarankan untuk iklan |
| Font sistem (SF/Roboto) | — | Dipakai di aplikasi mobile |
| Font Awesome / Line Awesome | `mihp-backend/public/admin-assets/vendor_assets/fonts/` | Ikon admin. Jangan dipakai; gunakan gaya Lucide |

## 6. Ilustrasi, animasi, dan visual bawaan kode

Tidak ada file ilustrasi raster, Lottie, video, GIF, atau screenshot di ketiga repo. Visual yang ada dibangun dengan kode dan bisa direkam layar atau direproduksi:

| Visual | Lokasi | Isi |
|---|---|---|
| Mockup HP di hero landing (HTML/CSS) | `mihp-backend/resources/views/welcome.blade.php:43-71` | Beranda tiruan: "Halo, Rina 👋", ikon Makanan/Ojek/Mobil/Kirim, banner "Makan siang tanpa antre", kartu "Driver menuju lokasimu · 4 menit lagi" |
| Kartu melayang hero | `welcome.blade.php:76-85` | "Driver dalam perjalanan", "Pesanan selesai — QR terverifikasi", "Bayar tunai — Tanpa biaya tersembunyi" |
| Peta SVG animasi (rute + marker bergerak) | `welcome.blade.php:132-182` | Rute putus-putus, `animateMotion`, chip "Tiba ± 4 menit", kartu driver fiktif "Budi Santoso · B 3721 XYZ" |
| Animasi CSS landing | `mihp-backend/public/css/landing.css:102-217` | `drift` orb, `ping`, `shine` gradien teks, `float` HP, `dash` rute |
| Interaksi JS landing | `mihp-backend/public/js/landing.js:25-60` | reveal on scroll, spotlight, tilt 3D mockup |
| Peta Leaflet di aplikasi | `mihp-customer/components/LeafletMap.tsx`; `mihape-mitra/components/driver/LeafletMap.tsx` | Marker driver berdenyut, garis rute pink |
| QR penyelesaian | `mihape-mitra/app/driver/order/[id].tsx:563-609` (`react-native-qrcode-svg`) | QR + PIN 4 digit |

Nama dan plat pada mockup landing ("Rina", "Budi Santoso", "B 3721 XYZ") adalah **data fiktif contoh**. Bila dipakai di video, beri tanda sebagai simulasi.

## 7. Konten dari server (tidak ada di repo)

Banner, foto toko/menu, postingan Feed, dan foto profil dimuat dari `https://mihape.biz.id/storage/...` (`mihp-customer/lib/storage.ts:1`). `mihp-backend/storage/app/public` kosong. Isi produksi **BELUM TERVERIFIKASI**, dan izin pemakaian foto toko mitra dalam iklan perlu dikonfirmasi.

Seeder demo memuat nama toko dan menu contoh ("Warung Siri", "Bakso Pak Kumis", "Ayam Geprek Bu Sri", "Nasi Goreng Spesial", dll., di `mihp-backend/database/seeders/HomeSectionSeeder.php:56-86`). Ini data demo, bukan mitra nyata, jadi jangan ditampilkan sebagai mitra sungguhan.

## 8. Aset yang perlu disiapkan untuk produksi

| Kebutuhan | Status | Saran |
|---|---|---|
| Screenshot / rekaman layar aplikasi nyata | **TIDAK ADA** | Rekam dari build produksi atau staging dengan akun demo. Atau buat ulang UI sebagai motion graphic berdasarkan token di [BRAND_GUIDELINES](BRAND_GUIDELINES.md) |
| Logo vektor (SVG) wordmark Mihape | **TIDAK ADA** (hanya favicon SVG) | Minta file sumber ke desainer, atau pakai PNG 1280 px |
| Foto lifestyle (driver, toko, pelanggan) | **TIDAK ADA** | Foto/rekaman orisinal, atau ilustrasi |
| Musik dan SFX | Hanya `order_ring.wav` | Musik bebas lisensi atau sintetis |
| Badge Google Play resmi | Tidak ada file (tombol landing berupa HTML) | Ambil dari Google Play Badge resmi bila listing sudah live |
