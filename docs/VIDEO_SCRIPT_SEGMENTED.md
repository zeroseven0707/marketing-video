# Naskah Video Tersegmentasi (30 detik)

Dua video pendek turunan video launching: satu untuk **pelanggan** (`MihapeCustomerAd`) dan satu untuk **calon mitra** driver + toko (`MihapeMitraAd`). Format, gaya, dan aturan kejujuran sama dengan [VIDEO_SCRIPT](VIDEO_SCRIPT.md): 1080×1920, 30 fps, tanpa suara AI, UI rekonstruksi dari source code (label "Ilustrasi tampilan aplikasi · data contoh" dimatikan atas permintaan pemilik produk).

Semua klaim diambil dari [AVAILABLE_FEATURES](AVAILABLE_FEATURES.md) berstatus **Ya**. Teks layar ada di `src/config/copy.ts` (blok `C01`–`C06` dan `M01`–`M06`), timing di `src/config/scenes.ts` (`customerScenes`, `mitraScenes`).

## Video Pelanggan: "Pesan aja di Mihape"

Penonton: warga yang belum memakai Mihape. Satu pesan: urusan harian beres dari HP, dengan ongkos dan driver yang jelas.

| # | Waktu | Teks di layar | Sumber klaim | Narasi (opsional) |
|---|---|---|---|---|
| C01 | 0:00–0:04 | "Lapar, tapi malas keluar?" → "Pesan aja di Mihape." | [IKLAN] | "Lapar, tapi malas keluar? Pesan aja di Mihape." |
| C02 | 0:04–0:09 | "Makan, ojek, mobil, kirim paket. Beres." · 4 layanan | `ServiceSeeder.php:14-17` | "Makan, ojek, mobil, kirim paket, beres dari satu aplikasi." |
| C03 | 0:08–0:15 | "Pilih menu warung favoritmu." · ✓ Ongkos terlihat sebelum pesan · ✓ COD, bayar di tempat · ✓ Non-tunai: QRIS, e-wallet, dll. | `CU/app/checkout/food.tsx:465-537`; metode `cash`/`midtrans`; kanal non-tunai dikonfirmasi pemilik produk | "Pilih menu warung favoritmu. Bayar COD atau non-tunai, ongkosnya kelihatan sebelum pesan." |
| C04 | 0:14–0:19 | "Pantau drivernya langsung di peta." · "Nama & plat nomor" · "Chat dengan driver" | `CU/app/order/tracking/[id].tsx:332-344` | "Pantau drivernya langsung di peta." |
| C05 | 0:19–0:24 | "Pesanan sampai? Scan QR driver." · "Bukti pesanan sudah aman di tanganmu." | `CU/app/(tabs)/_layout.tsx:18-165`; `BE/app/Services/OrderService.php:785-815` | "Pesanan sampai? Scan QR di HP driver, bukti pesanan sudah aman di tanganmu." |
| C06 | 0:24–0:30 | Ikon + logo · "Gampil, Gancang, Merenah" · **Unduh Mihape** · mihape.biz.id · wilayah | Slogan resmi pemilik produk | "Mihape. Gampil, gancang, merenah." |

## Video Mitra: "Gabung Mihape Mitra"

Penonton: pemilik warung/UMKM dan pemilik motor. Satu pesan: warung dan driver bekerja dalam **satu alur pesanan** di satu aplikasi. Videonya mengikuti satu pesanan dari warung, ke driver terdekat, sampai ke pelanggan. Tidak ada label terpisah "Mitra Driver"/"Mitra Toko", agar tidak terasa seperti dua video.

| # | Waktu | Teks di layar | Sumber klaim | Narasi (opsional) |
|---|---|---|---|---|
| M01 | 0:00–0:04 | Warung dengan motor datang ke depannya · "Punya warung?" · "Punya motor?" → "Gabung Mihape Mitra." | [IKLAN] | "Punya warung? Punya motor? Gabung Mihape Mitra." |
| M02 | 0:04–0:09 | "Pesanan masuk, warung terima satu ketukan." · layar "Pesanan diterima. Menawarkan ke driver terdekat…" | `MI/lib/merchant/orderActions.ts` | "Pesanan masuk, warung terima satu ketukan." |
| M03 | 0:09–0:15 | "Lalu driver terdekat dapat tawarannya." · Online → tawaran → terima → berangkat | `BE/app/Services/DriverAssignmentService.php:296-319`; `MI/components/driver/IncomingOrderWatcher.tsx` | "Lalu driver terdekat dapat tawarannya." |
| M04 | 0:14–0:20 | "Pesanan sampai, pelanggan scan QR." · "Tanda pesanan sudah diterima pelanggan." | `MI/app/driver/order/[id].tsx:563-609`; `BE/app/Services/OrderService.php:785-815` | "Sampai di pelanggan, scan QR, pesanan beres." |
| M05 | 0:19–0:24 | "Semua diatur dari satu aplikasi." · Ongkos terlihat sebelum terima · Pesanan terdekat diprioritaskan · Atur menu & jadwal buka · Promosi di Feed · Voucher toko · Tarik saldo ke rekening | `IncomingOrderWatcher.tsx:270-273`; `menu/form.tsx`; `store-settings.tsx:88-168`; `promo/create.tsx`; `vouchers/*`; `MI/app/driver/(tabs)/index.tsx:183-245`; `wallet.tsx` | "Semua diatur dari satu aplikasi." |
| M06 | 0:24–0:30 | Logo Mihape Mitra · "Daftar langsung dari aplikasi." · 1 Daftar & unggah dokumen · 2 Verifikasi admin · 3 Mulai terima pesanan · **Daftar di Mihape Mitra** · mihape.biz.id · wilayah | `MI/app/register.tsx:143-169`; `MI/app/driver/verification.tsx` | "Daftar langsung dari aplikasi Mihape Mitra." |

## Klaim yang sengaja tidak dipakai
- Scan QR sebagai pembayaran. QR di HP driver adalah bukti serah terima (pelanggan memindainya saat pesanan sampai), jadi selalu diberi keterangan "bukan untuk bayar" / "tanda pesanan sudah diterima".
- Angka pendapatan, "penghasilan tambahan", atau janji jumlah pesanan. Nominal di kartu tawaran disamarkan (`Rp •••••`).
- "Dering walau HP terkunci" untuk mitra. Push mitra belum terverifikasi (file Firebase mitra belum ada).
- Lama verifikasi ("1×24 jam"), karena ini janji operasional.
- "Tersedia di Play Store / App Store". Status listing belum terverifikasi, jadi CTA mengarah ke mihape.biz.id.

## Sebelum tayang
- Konfirmasi baris wilayah: `copy.S11.region` (pelanggan) dan `copy.M06.region` (mitra). Isi `null` untuk menyembunyikan.
- Bila ada rekaman suara manusia, naskah ada di kolom Narasi. Voice-over `audioConfig.voiceover` saat ini hanya dipasang di video launching.
