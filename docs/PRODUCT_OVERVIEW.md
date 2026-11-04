# Mihape: Product Overview

Dokumen discovery untuk produksi video iklan. Sumber kebenaran: tiga repo di `/Users/sihabudin/Documents/sihab/sihab/`. Audit dilakukan 4 November 2026, read-only: tidak ada file proyek yang diubah, tidak ada build, tidak ada akses database.

Semua referensi memakai format `repo/path:baris`:
- `BE/...` = `mihp-backend/...`
- `CU/...` = `mihp-customer/...`
- `MI/...` = `mihape-mitra/...`

Label status:
- **TERVERIFIKASI**: ada UI dan logika/API yang benar-benar berjalan di kode.
- **BELUM TERVERIFIKASI**: tidak bisa dipastikan dari kode saja (data produksi, konfigurasi server, atau perilaku runtime).
- **TIDAK ADA**: dicari dan tidak ditemukan.

Dokumen terkait: [CUSTOMER_APP_FLOW](CUSTOMER_APP_FLOW.md) · [MITRA_APP_FLOW](MITRA_APP_FLOW.md) · [AVAILABLE_FEATURES](AVAILABLE_FEATURES.md) · [BRAND_GUIDELINES](BRAND_GUIDELINES.md) · [ASSET_INVENTORY](ASSET_INVENTORY.md) · [API_AND_BUSINESS_LOGIC](API_AND_BUSINESS_LOGIC.md)

---

## 1. Apa itu Mihape

Mihape adalah aplikasi layanan harian lokal. Dalam satu aplikasi pelanggan bisa pesan makanan, ojek, mobil, dan kirim paket. Ada juga Feed sosial yang terhubung dengan pemesanan.

- README backend: "Backend dan panel admin untuk platform **Mihape**: pesan makanan, ojek, mobil, dan kirim paket." (`BE/README.md:3`)
- Halaman Tentang: "Mihape adalah platform yang menghubungkan kamu dengan berbagai layanan sehari-hari dalam satu aplikasi. Dari pesan makanan, transportasi, hingga kirim paket — semua ada di Mihape." (`BE/resources/views/pages/about.blade.php:11`)
- Visi: "Menjadi platform lokal terbaik yang memberdayakan mitra driver dan UMKM, sekaligus memberikan kemudahan akses layanan berkualitas bagi setiap pengguna." (`BE/resources/views/pages/about.blade.php:26`)
- Pengelola: "Mihape dikelola oleh Dunia Karya." (`BE/resources/views/pages/about.blade.php:53`). Nama badan hukum (PT/CV) dan alamatnya **BELUM TERVERIFIKASI**.
- Domain: `https://mihape.biz.id` (API `https://mihape.biz.id/api`, `CU/lib/api.ts:6`, `MI/lib/api.ts:6`).
- Riwayat: proyek dulu bernama **SIRI**, dengan logo hijau "MIHP" (`BE/docs/archive/*`, `BE/public/admin-assets/img/mihp.png`). Aset lama ini tidak boleh dipakai di iklan.

## 2. Ekosistem: tiga aplikasi, satu backend

```
            ┌──────────────────────────┐
 Pelanggan ─┤  Mihape (mihp-customer)  ├─┐
            └──────────────────────────┘ │  REST /api (Sanctum token)
            ┌──────────────────────────┐ │  Realtime Reverb (WebSocket)
 Driver  ───┤ Mihape Mitra             ├─┼──►  mihp-backend (Laravel 12)
 Toko    ───┤ (mihape-mitra)           │ │      + landing page + panel admin
            └──────────────────────────┘ │  Push FCM, Midtrans, OSRM/Nominatim
 Admin  ────── /admin (web) ─────────────┘
```

| Project | Peran | Nama tampil | ID aplikasi | Bukti |
|---|---|---|---|---|
| `mihp-backend` | API, landing page, panel admin, scheduler | "Mihape" (`APP_NAME`) | — | `BE/README.md:3-18` |
| `mihp-customer` | Aplikasi pelanggan | **Mihape** | `id.mihape.app`, scheme `mihp://` | `CU/app.json:3,8,22,33` |
| `mihape-mitra` | Satu aplikasi untuk **Driver** dan **Toko** | **Mihape Mitra** | `id.mihape.mitra`, scheme `mihpmitra://` | `MI/app.json:3-9,21-32`; `MI/README.md:3` |

Aplikasi Mitra merupakan gabungan aplikasi lama "Mihape Driver" dan "Mihape Merchant" (`MI/README.md:3`). Aplikasi pelanggan menolak akun driver/toko dengan pesan "Ini akun toko/driver. Silakan masuk lewat aplikasi Mihape Mitra." (`CU/app/_layout.tsx:100-105`). Aplikasi Mitra menolak akun pelanggan (`MI/lib/authStore.ts:19,133-137`).

## 3. Struktur folder

### 3.1 `mihp-backend` (Laravel 12)
```
app/Http/Controllers/{Api,Admin}   controller API & panel admin
app/Models                         User, DriverProfile, Store, FoodItem, Service, Order, ...
app/Services                       OrderService, PricingService, DriverAssignmentService,
                                   WalletSettlementService, MidtransService, FcmService, ...
app/Events/Realtime                event Reverb (OrderUpdated, DriverLocationUpdated, ...)
routes/api.php (279 baris)         REST API untuk kedua aplikasi
routes/web.php                     landing, halaman legal, /admin, /post/{id}, /pembayaran/selesai
routes/channels.php                channel realtime privat
routes/console.php                 job terjadwal (auto-cancel, auto-confirm, snapshot keuangan)
resources/views/welcome.blade.php  landing page
resources/views/pages|legal        Tentang, Bantuan, S&K, Privasi, Hapus Akun
public/css/landing.css, js/        gaya & animasi landing
public/images/brand/               logo & ikon resmi
database/migrations, seeders       skema & data demo
```

### 3.2 `mihp-customer` dan `mihape-mitra` (Expo Router)
```
app/          route berbasis file (layar)
components/   komponen UI buatan sendiri (tanpa UI kit)
lib/          api.ts (axios), authStore (zustand), realtime.ts (Reverb), theme.ts, geo.ts, ...
assets/       logo, ikon, (Mitra: order_ring.wav)
types/        tipe TypeScript domain
plugins/      config plugin Expo
```
Mitra juga punya `mocks/`, berisi stub Firebase/Notifee yang hanya aktif bila `EXPO_PUBLIC_EXPO_GO=1` (`MI/metro.config.js:16-32`). Stub ini tidak dipakai di build EAS.

## 4. Teknologi

| Area | Backend | Customer | Mitra |
|---|---|---|---|
| Framework | Laravel 12, PHP 8.2 (`BE/composer.json:8-16`) | Expo 52, RN 0.76.9, expo-router 4 (`CU/package.json:24,47,39`) | sama (`MI/package.json:19,45,34`) |
| Auth | Sanctum (token 30 hari, `BE/DEPLOY-SECURITY.md:4-12`) | Bearer token di SecureStore (`CU/lib/api.ts:32-34`) | sama (`MI/lib/tokenStorage.ts:3-24`) |
| Realtime | Laravel Reverb (`BE/composer.json`; `BE/routes/channels.php`) | laravel-echo + pusher-js, fallback polling (`CU/lib/realtime.ts:45-62`) | sama (`MI/lib/realtime.ts:51-90`) |
| Push | FCM HTTP v1 tanpa SDK (`BE/app/Services/FcmService.php:334,416`) | Firebase Messaging + Notifee (`CU/lib/notificationService.ts:140`) | sama + dering layar penuh (`MI/lib/notifications.ts:108-148`) |
| Peta | OSRM (rute) + Nominatim self-host (`BE/app/Services/OsrmService.php`, `GeocodingService.php`) | Leaflet 1.9.4 di WebView, tile CARTO (`CU/lib/geo.ts:23-25`) | sama (`MI/lib/leafletSource.ts:1-6`) |
| Pembayaran | Midtrans Snap via HTTP (`BE/app/Services/MidtransService.php:54-59`) | buka `snap_redirect_url` di browser (`CU/app/service/[id].tsx:229-237`) | top-up & promosi via `redirect_url` |
| Admin | Blade + Livewire 4, tema HexaDash pink | — | — |
| Landing | Blade + CSS statis, font Plus Jakarta Sans (`BE/resources/views/layouts/site.blade.php:23`) | — | — |

## 5. Entry point

| Project | Entry | Bukti |
|---|---|---|
| Backend web | `/` → `welcome.blade.php` | `BE/routes/web.php:22-24` |
| Backend API | `routes/api.php`, prefix `/api` | `BE/routes/api.php` |
| Customer | `"main": "expo-router/entry"` → `app/_layout.tsx` (auth gating) → `/(tabs)/home` | `CU/package.json:4`; `CU/app/_layout.tsx:85-121`; `CU/app/index.tsx:4` |
| Mitra | `index.js` (daftar handler FCM background + task lokasi) → `expo-router/entry` → `app/_layout.tsx` (routing per peran) | `MI/index.js:3,26-45`; `MI/app/_layout.tsx:88-114` |

## 6. Layanan

| Layanan | Slug | Nama pemasaran (halaman Tentang) | Kendaraan (seeder) | Status |
|---|---|---|---|---|
| Pesan Makanan | `food` | Mihape Food | motor | TERVERIFIKASI |
| Ojek | `ojek` | Mihape Ride | motor | TERVERIFIKASI |
| Mobil | `car` | Mihape Car | mobil | TERVERIFIKASI |
| Kirim Paket | `delivery` | Mihape Delivery | motor | TERVERIFIKASI (form generik, tanpa detail paket) |
| Nitah (jasa suruhan) | `nitah` | — | — | **BELUM TERVERIFIKASI**: ada UI di app pelanggan (`CU/app/service/[id].tsx:397-434`) dan konstanta di backend (`BE/app/Services/OrderService.php:37`), tetapi tidak ada di seeder atau landing |

Layanan disimpan sebagai baris tabel `services` yang dikelola admin (`BE/database/seeders/ServiceSeeder.php:14-17`; `BE/routes/web.php:128`). Nama pemasaran ada di `BE/resources/views/pages/about.blade.php:30-33`. Layanan yang aktif di produksi diambil dari server lewat `GET /services`, jadi **BELUM TERVERIFIKASI**.

## 7. Pengguna dan nilai utama

| Pengguna | Nilai yang terbukti di kode |
|---|---|
| Pelanggan | Satu aplikasi untuk 4 layanan. Ongkir terlihat sebelum pesan, dihitung server dari jarak rute. Bayar tunai atau non-tunai (Midtrans). Lacak driver di peta live. Selesaikan pesanan dengan scan QR atau PIN driver. Ada chat dengan driver/toko, rating, tiket komplain/refund, kupon dan voucher, referral, serta Feed untuk pesan langsung dari postingan toko. |
| Driver | Daftar mandiri dengan dokumen. Ada saklar Online/Offline, tawaran pesanan berdering layar penuh, peta rute, pesanan bertumpuk (makanan/paket), urutan antar, QR/PIN penyelesaian, saldo deposit, ringkasan pendapatan, dan rating. |
| Toko (UMKM) | Daftar mandiri dengan KTP. Ada pesanan masuk berdering, Terima/Tolak, Tandai Siap, dan Diambil Kurir. Kelola menu (foto, harga, tersedia/habis), jadwal buka 7 hari, terima otomatis, voucher toko, promosi di Feed (foto/video dengan tautan produk), Saldo Toko, dan ulasan. |
| Warung tanpa akun | Model **"jasa beli / talangan"**: driver membelikan dulu, dengan foto nota wajib (`BE/app/Services/OrderService.php:756-764`; `MI/app/driver/order/[id].tsx:149-174`). |

## 8. Pembeda yang terbukti di kode (bahan iklan)

1. **Selesai dengan scan QR / PIN 4 digit**: bukti serah terima. Lihat `CU/app/(tabs)/_layout.tsx:18-165`; `MI/app/driver/order/[id].tsx:287-310,563-609`; `BE/app/Services/OrderService.php:785-815`.
2. **Lacak driver real-time di peta**, lengkap dengan nama dan plat nomor: `CU/app/order/tracking/[id].tsx:125-140,236-282,332-344`.
3. **Harga transparan sebelum pesan**: ongkir, biaya layanan, biaya tambahan, dan diskon ditampilkan; harga dihitung ulang server. Lihat `CU/app/checkout/food.tsx:465-537`; `BE/app/Services/PricingService.php:9`.
4. **Satu aplikasi mitra untuk driver dan toko**: `MI/README.md:3`; `MI/app/_layout.tsx:88-114`.
5. **Feed = social commerce**: postingan toko bisa langsung dipesan. Lihat `CU/components/feed/ProductSheet.tsx:75-76,148-171`; `MI/app/merchant/(tabs)/promo.tsx:114-115`.
6. **Toko dibantu sistem**: dering pesanan, terima otomatis, buka/tutup terjadwal. Lihat `MI/app/merchant/store-settings.tsx:88-168`.
7. **Biaya tambahan jam sibuk/malam/hujan seluruhnya untuk driver**: `BE/app/Services/SurchargeService.php:11`. Fitur ini nonaktif secara bawaan, sehingga status aktifnya di produksi **BELUM TERVERIFIKASI**.

## 9. Inkonsistensi yang harus dihindari dalam iklan

| Topik | Fakta di kode | Copy yang bertentangan |
|---|---|---|
| Metode bayar | Tunai **dan** non-tunai Midtrans (`BE/app/Http/Requests/CreateOrderRequest.php:25`; `CU/types/index.ts:80`) | FAQ landing: "Saat ini pembayaran dilakukan secara tunai…" (`BE/resources/views/welcome.blade.php:331`) |
| Daftar mitra | Daftar mandiri di aplikasi (`BE/routes/api.php:40`; `MI/app/register.tsx`) | FAQ landing "Hubungi kami melalui email" (`BE/resources/views/welcome.blade.php:343`); README Mitra "akun dibuat oleh admin" (`MI/README.md:10-12`); subtitle login Mitra (`MI/app/login.tsx:64`) |
| Kelola metode pembayaran | Fitur ini TIDAK ADA | Teks placeholder tab Akun (`CU/app/(tabs)/profile.tsx:44`) |
| Mode tamu | Tidak terjangkau: semua layar wajib login (`CU/app/_layout.tsx:92-96`) | Komponen `AuthPlaceholder` ada di beberapa layar |
| App Store (iOS) | Tidak ada tautan | Hanya Google Play di landing |

## 10. BELUM TERVERIFIKASI (gabungan)

1. Layanan aktif dan tarif produksi (base, per km, km gratis). Hanya seeder demo yang terbaca (`BE/database/seeders/ServiceSeeder.php:14-17`).
2. Status aktif biaya layanan, bagi hasil toko, dan surcharge. Bawaan kode: nonaktif (`BE/app/Models/AppSetting.php:91-94`; `BE/app/Support/OpsRules.php:37-47`).
3. Midtrans aktif di produksi, beserta kanalnya (QRIS/VA/e-wallet). Kunci kosong di `.env` lokal; kunci juga bisa diisi dari admin.
4. Reverb realtime aktif di produksi. Tanpa Reverb, aplikasi memakai polling.
5. Push/dering saat aplikasi Mitra tertutup. `google-services.json` tidak ada di repo Mitra (ada di repo Customer).
6. Listing Google Play `id.mihape.app` dan `id.mihape.mitra` sudah live. Tidak ada App Store.
7. Layanan `nitah`.
8. Program referral aktif di produksi. Nominal di kode: Rp10.000 (`BE/app/Services/ReferralService.php:28-40`).
9. Isi banner, promo, toko, dan menu di produksi (konten server).
10. Nama badan hukum "Dunia Karya", alamat, dan email kontak resmi.
11. Angka pengguna, mitra, dan transaksi. Tidak ada akses DB.
12. Tampilan layar nyata. Tidak ada screenshot di repo dan aplikasi tidak dijalankan.
13. Isi audio `MI/assets/sounds/order_ring.wav` belum didengar.
14. Wilayah layanan Tasikmalaya (Puspahiang, Warung Peteuy, Salawu). Kode tidak menyebut wilayah ini, dan titik awal peta memakai Jakarta. Lihat [LOCAL_MARKET_CONTEXT](LOCAL_MARKET_CONTEXT.md).
