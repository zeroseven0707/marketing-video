# Naskah Video (60 detik)

Video tidak memuat voice-over. Teks layar sudah membawa pesan. Kolom **Narasi (opsional)** adalah naskah untuk rekaman **suara manusia** bila nanti ditambahkan; cara memasang ada di README. Tidak ada suara AI yang dibuat.

Label sumber: **[ASLI]** dikutip dari aplikasi/landing; **[IKLAN]** copy iklan yang tidak menambah klaim fitur.

| # | Waktu | Teks di layar | Sumber | Narasi (opsional, ±kata) |
|---|---|---|---|---|
| S01 | 0:00–0:06 | "Karya anak daerah" · "Dari daerah, untuk daerah." · "Puspahiang · Warung Peteuy · Salawu" → pin merek mendarat di kampung · "Kini hadir untuk kampung kita." | [IKLAN], arahan pemilik produk | "Karya anak daerah. Dari daerah, untuk daerah. Kini hadir untuk kampung kita." (13) |
| S02 | 0:05–0:11 | "Tapi urusan tetap banyak." · "Lapar, belum sempat masak." · "Perlu ke pasar, jalan masih jauh." · "Kirim titipan ke saudara." | [IKLAN] | "Tapi urusan sehari-hari tetap banyak." (5) |
| S03 | 0:11–0:17 | "Gampil, Gancang, Merenah" · "Semua kebutuhan harianmu, cukup satu ketukan." | [ASLI] `mihp-customer/components/SplashScreen.tsx:12`; `mihp-backend/resources/views/welcome.blade.php:21` | "Kenalan dengan Mihape. Semua kebutuhan harianmu, cukup satu ketukan." (10) |
| S04 | 0:16–0:22 | "Satu aplikasi, banyak urusan beres." · Pesan Makanan · Ojek · Mobil · Kirim Paket | [ASLI] headline landing; `mihp-backend/database/seeders/ServiceSeeder.php:14-17` | "Pesan makanan, ojek, mobil, atau kirim paket, dari satu aplikasi." (10) |
| S05 | 0:21–0:28 | "Pesan makanan dari warung sekitar." · "Rincian harga terlihat sebelum pesan" | [IKLAN], didukung `mihp-customer/app/checkout/food.tsx:465-537` | "Pilih menu dari warung sekitar, rincian harganya kelihatan sebelum pesan." (10) |
| S06 | 0:27–0:34 | "Mihape Mitra · Toko" · "Warung lokal langsung terima pesanan." | [IKLAN], didukung `mihape-mitra/components/merchant/IncomingOrderWatcher.tsx:154-210` | "Pesanan langsung berdering di HP warung." (6) |
| S07 | 0:33–0:39 | "Mihape Mitra · Driver" · "Driver lokal siap mengantar." | [IKLAN], didukung `mihape-mitra/components/driver/IncomingOrderWatcher.tsx:188-310` | "Driver lokal menerima, lalu berangkat mengantar." (6) |
| S08 | 0:39–0:45 | "Tahu persis di mana driver-mu berada." · "Plat nomor terlihat" · "Chat dengan driver" | [ASLI] headline landing; `mihp-customer/app/order/tracking/[id].tsx:332-344` | "Pantau posisi driver di peta, lengkap dengan plat nomornya." (9) |
| S09 | 0:44–0:50 | "Selesai dengan scan QR." · "Tanda pesanan sudah diterima, bukan untuk bayar." | [ASLI] chip landing; `mihp-customer/app/(tabs)/_layout.tsx:18-165`; metode `cash`/`midtrans` | "Pesanan sampai, scan QR di HP driver. Itu tanda pesanan sudah diterima." (12) |
| S10 | 0:49–0:55 | "Menghubungkan kebutuhan warga dengan usaha lokal." · Warga · Warung & UMKM · Driver lokal | Pesan utama pemilik produk | "Mihape menghubungkan kebutuhan warga dengan usaha lokal." (7) |
| S11 | 0:54–1:00 | Logo · "Gampil, Gancang, Merenah" · "Unduh Mihape" · "Mau jadi mitra? Daftar di Mihape Mitra" · mihape.biz.id · "Untuk warga Puspahiang · Warung Peteuy · Salawu" | [ASLI] tagline; domain `mihp-customer/lib/links.ts`; wilayah dari pemilik produk | "Mihape. Gampil, gancang, merenah. Unduh sekarang." (6) |

Panjang narasi sekitar 83 kata dalam 60 detik, tempo santai sekitar 2 kata per detik dengan jeda antar-scene.

## Catatan klaim
- Slogan resmi dari pemilik produk: **"Gampil, Gancang, Merenah"** (Sunda: mudah, cepat, nyaman). Splash aplikasi (`CU/components/SplashScreen.tsx:12`) masih memakai "Mudah, Cepat, Nyaman".
- Scan QR selalu dijelaskan sebagai **bukti pesanan sudah diterima** pelanggan (`POST /orders/complete-by-token`), bukan pembayaran, agar tidak dikira QRIS. Kalimat "Bayar tunai atau non-tunai" tidak ditaruh di scene QR.
- "Daftar di Mihape Mitra": pendaftaran mandiri ada di kode (`mihape-mitra/app/register.tsx:143-169`). Teks login lama yang menyebut akun dibuat admin tidak dipakai.
- "Bayar tunai atau non-tunai": hanya `cash` dan `midtrans` yang ada di kode. Nama kanal (QRIS/GoPay/VA) tidak disebut di teks iklan, hanya tampil sebagai label asli di layar checkout.
- Sebelum tayang, pemilik produk perlu mengonfirmasi baris wilayah di end card. Lihat [LOCAL_MARKET_CONTEXT §7](LOCAL_MARKET_CONTEXT.md).
