# Brand Guidelines Mihape (hasil discovery)

Dokumen ini disusun dari aset dan kode yang ada. Tidak ada brand book resmi di repo, sehingga semua nilai di bawah diturunkan dari implementasi. Referensi: `BE/` = `mihp-backend/`, `CU/` = `mihp-customer/`, `MI/` = `mihape-mitra/`.

---

## 1. Nama dan arsitektur merek

| Nama | Dipakai untuk | Bukti |
|---|---|---|
| **Mihape** | merek utama dan aplikasi pelanggan | `CU/app.json:3` |
| **Mihape Mitra** | aplikasi driver dan toko | `MI/app.json:3` |
| Mihape Food / Ride / Car / Delivery | nama layanan di halaman Tentang | `BE/resources/views/pages/about.blade.php:30-33` |
| Pesan Makanan / Ojek / Mobil / Kirim Paket | nama layanan di aplikasi dan landing | `BE/database/seeders/ServiceSeeder.php:14-17`; `BE/resources/views/welcome.blade.php:94-122` |
| "Teman Mihape" | sapaan pengguna | `CU/app/(tabs)/home.tsx:329` |
| ~~SIRI / MIHP (logo hijau)~~ | merek lama | **Jangan dipakai** |

Penulisan selalu **"Mihape"**: kapital di awal, satu kata. Jangan menulis "MIHP" atau "mihp".

## 2. Logo

Logo resmi berupa wordmark **"Mihape"** dengan ciri berikut:
- Huruf **"M" berbentuk pita** bergradasi pink, dengan **tiga garis kecepatan** di kiri. Garis ini melambangkan kecepatan.
- **Titik huruf "i" berupa pin lokasi**, melambangkan layanan berbasis lokasi.
- Huruf bulat tebal bergradasi `#FE679F → #E61A64`.

| Varian | File terbaik | Catatan |
|---|---|---|
| Wordmark Mihape | `CU/assets/images/mihp-logo.png` (1280×367) | Resolusi tertinggi. **Latar tidak 100% transparan** (alpha ≈2/255), jadi di latar gelap bisa muncul kotak samar. Untuk latar gelap, pakai versi backend atau bersihkan alpha di salinan. |
| Wordmark Mihape (transparan bersih) | `BE/public/images/brand/mihp-logo.png` (640×212) | Transparan penuh, resolusi sedang |
| Wordmark Mihape **Mitra** | `MI/assets/images/mitra-logo.png` (1257×507) | Transparan, dengan pil pink "Mitra" |
| Simbol "M" pink di atas putih | `CU/assets/images/mihp-icon.png` (1024²) | Ikon aplikasi pelanggan |
| Simbol "M" pink transparan | `CU/assets/images/mihp-adaptive.png` (1024²) | ±90% piksel transparan; cocok untuk animasi simbol |
| Simbol "M" putih di atas gradien pink | `MI/assets/images/mitra-icon.png` (1024²) | Ikon aplikasi Mitra |
| Simbol "M" putih transparan | `MI/assets/images/mitra-adaptive.png` (1024²) | Untuk overlay di latar pink |
| Pin lokasi (vektor) | `BE/public/images/brand/favicon.svg` | Satu-satunya vektor merek |

Aturan pakai:
- Pertahankan rasio. Jangan mengubah warna logo menjadi selain pink, atau putih di atas pink.
- Beri ruang kosong di sekitar logo minimal setinggi huruf "a".
- Logo pink diletakkan di latar putih atau `#FFF7FA`. Logo/simbol putih diletakkan di gradien pink.
- Format lengkap tiap file ada di [ASSET_INVENTORY](ASSET_INVENTORY.md).

## 3. Warna

Sumber: `CU/lib/theme.ts:4-37`, `MI/lib/theme.ts:4-37` (identik), dan `BE/public/css/landing.css:2-19`. Komentar di theme: "Brand Mihape (diambil dari logo): pink tua #E61A64 & pink muda #FE679F" (`CU/lib/theme.ts:5`).

### 3.1 Warna merek
| Nama | Hex | Peran |
|---|---|---|
| Mihape Pink (primary) | `#D81B60` | tombol, aksen utama, `theme-color` web |
| Brand Pink (pink tua logo) | `#E61A64` | gradien, highlight |
| Brand Pink Light (pink muda logo) | `#FE679F` | gradien, aksen lembut |
| Pink Dark | `#AD1457` | gradien gelap, teks status "Diantar" |
| Pink Pressed | `#C2185B` | |
| Pink Soft | `#FFF0F5` | latar chip/kartu |
| Pink Muted | `#FCE4EC` | |
| Pink Border | `#F8BBD0` | |
| Mitra icon pink | `#E6336F` | latar adaptive icon Mitra |

### 3.2 Netral
| Nama | Hex |
|---|---|
| Ink (teks utama) | `#1C1B22` |
| Ink Deep / Brand Ink | `#2A1220` |
| Teks sekunder | `#6B6874` (app) / `#5F5B68` (web) |
| Teks redup | `#A29FAA` / `#8E8A97` |
| Latar | `#FFFFFF`, `#FAF8F9` |
| Garis | `#F0ECEF`, `#E4DEE2` |

### 3.3 Warna aksen layanan (ikon beranda, `CU/app/(tabs)/home.tsx:24-31`)
| Layanan | Ikon | Latar |
|---|---|---|
| Makanan | `#E8590C` | `#FFF4EC` |
| Ojek | `#D81B60` | `#FFF0F5` |
| Mobil | `#2563EB` | `#EFF4FF` |
| Kirim Paket | `#7C3AED` | `#F5F1FF` |

### 3.4 Warna status
Sukses `#15803D`/`#ECFDF3`, bahaya `#DC2626`/`#FEF2F2`, peringatan `#B45309`/`#FFF7E6`, info `#1D4ED8`/`#EEF4FF`, bintang rating `#F59E0B`.

### 3.5 Gradien khas
- **Gradien merek**: `#D81B60 → #E61A64 → #FE679F` (stop 0 / 0,6 / 1, diagonal). Dipakai di hero driver (`MI/app/driver/(tabs)/index.tsx:355-360`).
- Banner fallback: `#D81B60 → #FE679F` (`CU/app/(tabs)/home.tsx:134-187`).
- Hero landing: `#FFF7FA → #FFFFFF` dengan orb blur `#FFC1D6`, `#FFE0EB`, `#FE679F55` dan grid titik pink (`BE/public/css/landing.css:89-94`).
- Admin: `#D81B60 → #AD1457`.

## 4. Tipografi

| Konteks | Font | Bukti |
|---|---|---|
| Landing page (merek publik) | **Plus Jakarta Sans** 400–800 (Google Fonts) | `BE/resources/views/layouts/site.blade.php:23`; `landing.css:25` |
| Aplikasi mobile | Font sistem (SF Pro / Roboto). Tidak ada font kustom | `CU/app/_layout.tsx:46-51`; `MI/lib/theme.ts:42-49` |
| Panel admin | Jost | `BE/resources/views/admin/layout.blade.php:11` |

Rekomendasi untuk video: **Plus Jakarta Sans** (ExtraBold 800 untuk judul, Bold 700 untuk subjudul, Medium/Regular untuk isi). Font ini merupakan satu-satunya tipografi merek yang dipakai di kanal publik. File font tidak ada di repo dan perlu diambil dari Google Fonts.

Skala tipografi aplikasi (`CU/lib/theme.ts:42-49`): h1 26/800 (letter-spacing −0,6), h2 20/700, h3 16/700, body 14/400, caption 12/500, overline 11/700 uppercase.

## 5. Bentuk dan gaya UI
- Sudut membulat besar: kartu 16–20 px, tombol 14 px, pill 999 (`CU/lib/theme.ts:39`; `landing.css:19-24`).
- Bayangan lembut, termasuk bayangan pink `rgba(216,27,96,.55)` pada tombol utama.
- Ikon garis **Lucide** (`lucide-react-native`).
- Easing landing: `cubic-bezier(.22,1,.36,1)`. Gerak bawaan landing: orb melayang, kilau teks gradien, HP melayang, kartu melayang, rute peta putus-putus (`landing.css:102-217`).
- Gaya umum: terang, bersih, ramah, didominasi putih dengan aksen pink. Tidak ada mode gelap (`userInterfaceStyle: light`).

## 6. Tagline dan copy resmi (kutipan asli)

### Tagline
- **"Gampil, Gancang, Merenah"**: slogan resmi dari pemilik produk (Sunda: mudah, cepat, nyaman). Dipakai di semua video.
- **"Mudah, Cepat, Nyaman"** (versi lama di aplikasi): splash dan login aplikasi (`CU/components/SplashScreen.tsx:12`; `CU/app/(auth)/login.tsx:54`), footer web (`BE/resources/views/layouts/site.blade.php:55`).
- **"Semua kebutuhan harianmu, cukup satu ketukan."**: H1 landing (`BE/resources/views/welcome.blade.php:21`).

### Headline landing (`BE/resources/views/welcome.blade.php`)
- "Satu aplikasi, banyak urusan beres" (Layanan)
- "Tahu persis di mana driver-mu berada" (Lacak)
- "Empat langkah, langsung beres": Pilih layanan → Atur lokasi → Driver datang → Bayar & scan
- "Dibuat nyaman, dijaga tetap aman" (Fitur)
- "Tumbuh bersama Mihape" (Mitra), dengan "Satu aplikasi untuk driver dan pemilik toko - sederhana dipakai, fokus pada pesanan."
- "Siap pesan pertama?" (CTA)
- Chip kepercayaan: "Driver terlacak real-time" · "Selesai dengan scan QR" · ("Bayar tunai di tempat")

### Copy aplikasi
- "Halo, Teman Mihape" · "Cari layanan, toko, makanan..." · "Cepat, aman, dan terpercaya" · "Ajak teman, sama-sama dapat kupon" · "Bergabung dengan Mihape sekarang. Hanya butuh satu menit."
- Mitra: "Mau jadi mitra apa?" · "Antar penumpang, paket & makanan" · "Jual makanan & minuman" · "Selamat bekerja," · "Pesanan Baru!" · "Terima & Mulai Perjalanan" · "Kerja bagus!" · "Omzet hari ini" · "Posting di Feed Mihape dan tautkan menu tokomu. Pelanggan bisa langsung memesan dari postingan."

### Visi
"Menjadi platform lokal terbaik yang memberdayakan mitra driver dan UMKM, sekaligus memberikan kemudahan akses layanan berkualitas bagi setiap pengguna." (`BE/resources/views/pages/about.blade.php:26`)

## 7. Suara dan nada
- Bahasa Indonesia santai dan akrab, memakai sapaan **"kamu"** (bukan "Anda"). Contoh: "Halo, Rina", "Pantau status pesanan kamu", "Kerja bagus!".
- Kalimat pendek dan positif, berorientasi manfaat ("langsung beres", "cukup satu ketukan").
- Ada sentuhan jenaka lokal di copy Nitah ("Bantuin push rank, apa aja bisaa...") dan placeholder promo ("pesan sekarang 🔥"). Emoji muncul di beberapa copy UI, tetapi bukan elemen merek utama.
- Positioning lokal: "platform lokal", "UMKM", "warung".

## 8. Do & Don't untuk video
**Do**
- Dominasi putih dengan aksen pink. Gunakan gradien merek untuk momen penting (pesanan masuk, selesai).
- Tampilkan simbol "M" dengan garis kecepatan sebagai motif gerak (garis kecepatan menyapu masuk).
- Jadikan pin lokasi (titik "i") motif transisi dan peta.
- Pakai Plus Jakarta Sans dan ikon garis bergaya Lucide.

**Don't**
- Jangan memakai logo hijau lama (`BE/public/admin-assets/img/mihp.png`, `logo-dark.png`) atau CSS lama hijau `#16a34a`.
- Jangan mengubah gradien logo, memberi efek neon, atau memakai latar gelap sebagai identitas utama. Merek ini terang.
- Jangan menulis klaim di [AVAILABLE_FEATURES §6](AVAILABLE_FEATURES.md).
- Jangan menampilkan logo Midtrans, Google Maps, atau merek pihak ketiga lain tanpa izin.
