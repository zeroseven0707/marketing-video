# Fitur Mihape: Matriks Verifikasi

Tabel ini menjadi pegangan saat menulis naskah iklan.

Kolom **Boleh di iklan?**:
- **Ya**: terbukti di kode.
- **Hati-hati**: ada di kode, tetapi bergantung pada konfigurasi atau data produksi. Klaim jangan dibuat spesifik (angka, kanal pembayaran, dan sejenisnya).
- **Jangan**: tidak ada, belum terverifikasi, atau bertentangan dengan kode.

Referensi: `BE/` = `mihp-backend/`, `CU/` = `mihp-customer/`, `MI/` = `mihape-mitra/`. Rincian ada di [CUSTOMER_APP_FLOW](CUSTOMER_APP_FLOW.md), [MITRA_APP_FLOW](MITRA_APP_FLOW.md), dan [API_AND_BUSINESS_LOGIC](API_AND_BUSINESS_LOGIC.md).

---

## 1. Aplikasi Pelanggan (Mihape)

| Fitur | Status | Boleh di iklan? | Bukti |
|---|---|---|---|
| Pesan Makanan (toko → menu → keranjang → checkout) | TERVERIFIKASI | Ya | `CU/app/store/[id].tsx`; `CU/app/checkout/food.tsx`; `BE/routes/api.php:117` |
| Ojek | TERVERIFIKASI | Ya | `CU/app/service/[id].tsx`; `BE/database/seeders/ServiceSeeder.php:15` |
| Mobil | TERVERIFIKASI | Ya | `ServiceSeeder.php:16` |
| Kirim Paket | TERVERIFIKASI (form jemput/tujuan + catatan, tanpa detail paket) | Ya, tanpa klaim ukuran/berat/asuransi | `CU/app/service/[id].tsx:437-455` |
| Nitah (jasa suruhan) | BELUM TERVERIFIKASI | Jangan | `CU/app/service/[id].tsx:397-434`; tidak ada di seeder |
| Ongkir tampil sebelum pesan (dihitung dari jarak rute) | TERVERIFIKASI | Ya | `CU/app/service/[id].tsx:164-185`; `BE/app/Services/PricingService.php:95-136` |
| Rincian biaya transparan di checkout | TERVERIFIKASI | Ya | `CU/app/checkout/food.tsx:465-537` |
| Pilih lokasi di peta / GPS | TERVERIFIKASI | Ya | `CU/components/LocationPicker.tsx` |
| Alamat tersimpan (maks 3) | TERVERIFIKASI | Ya | `CU/app/addresses/*`; `BE/app/Models/UserAddress.php` |
| Bayar tunai (COD) | TERVERIFIKASI | Ya | `CU/types/index.ts:80` |
| Bayar non-tunai via Midtrans | TERVERIFIKASI di kode; aktif di produksi BELUM | Hati-hati: sebut "non-tunai", jangan sebut kanal | `BE/app/Services/MidtransService.php` |
| QRIS / GoPay / VA spesifik | BELUM TERVERIFIKASI | Jangan sebut spesifik | kanal diatur di dashboard Midtrans |
| Dompet / saldo pelanggan / top-up | TIDAK ADA | Jangan | grep `wallet|saldo|topup` di `CU/` |
| Kupon ongkir Mihape + voucher toko | TERVERIFIKASI | Ya (tanpa nominal) | `CU/components/VoucherPickerModal.tsx` |
| Lacak driver real-time di peta | TERVERIFIKASI (realtime atau polling 5 detik) | Ya | `CU/app/order/tracking/[id].tsx` |
| Nama driver + plat nomor + telepon | TERVERIFIKASI | Ya | `CU/app/order/tracking/[id].tsx:332-344` |
| Chat dengan driver / toko | TERVERIFIKASI | Ya | `CU/app/order/chat/[id].tsx` |
| Selesai dengan scan QR / PIN 4 digit | TERVERIFIKASI | Ya (pembeda utama) | `CU/app/(tabs)/_layout.tsx:18-165`; `BE/app/Services/OrderService.php:785-815` |
| Batal dalam 10 detik pertama | TERVERIFIKASI | Ya | `CU/lib/useOrderAutoConfirm.ts:6-7`; `BE/app/Services/OrderService.php:24` |
| Rating driver & toko | TERVERIFIKASI | Ya | `CU/components/RatingSheet.tsx` |
| Komplain / refund via tiket | TERVERIFIKASI | Ya | `CU/app/ticket/*`; `BE/app/Services/TicketService.php` |
| Notifikasi status pesanan (in-app) | TERVERIFIKASI | Ya | `CU/app/(tabs)/notifications.tsx` |
| Push notification FCM | TERVERIFIKASI di kode, pengiriman end-to-end BELUM | Hati-hati | `CU/lib/notificationService.ts`; `CU/google-services.json` ada |
| Feed: posting foto, suka, simpan, komentar, bagikan | TERVERIFIKASI | Ya | `CU/app/(tabs)/feed.tsx` |
| Feed: pesan langsung dari postingan toko | TERVERIFIKASI | Ya (pembeda) | `CU/components/feed/ProductSheet.tsx` |
| Lapor & blokir pengguna | TERVERIFIKASI | Opsional | `CU/lib/feed.ts` |
| Ajak Teman (referral, kupon kedua pihak) | TERVERIFIKASI di kode; aktif di produksi BELUM | Hati-hati: jangan sebut nominal | `CU/app/referral.tsx`; `BE/app/Services/ReferralService.php:28-40` |
| Masuk dengan sidik jari / Face ID | TERVERIFIKASI | Ya | `CU/lib/authStore.ts:171-249` |
| Perangkat terhubung, riwayat login, unduh data, hapus akun | TERVERIFIKASI | Opsional | `CU/app/security.tsx` |
| Pencarian toko & menu | TERVERIFIKASI | Ya | `CU/app/search.tsx` |
| Riwayat transaksi | TERVERIFIKASI (pembayaran & refund saja) | Hati-hati | `CU/app/history-transactions.tsx` |
| Mode tamu (lihat tanpa login) | TIDAK TERJANGKAU | Jangan | `CU/app/_layout.tsx:92-96` |
| Login Google / OTP SMS | TIDAK ADA | Jangan | `CU/app/(auth)` |
| Kelola metode pembayaran | TIDAK ADA | Jangan | teks di `CU/app/(tabs)/profile.tsx:44` |
| Aplikasi iOS / App Store | BELUM TERVERIFIKASI (tidak ada link) | Jangan tampilkan badge App Store | `BE/resources/views/welcome.blade.php` |

## 2. Aplikasi Mitra: Driver

| Fitur | Status | Boleh di iklan? | Bukti |
|---|---|---|---|
| Daftar mandiri + unggah KTP/SIM/STNK/selfie | TERVERIFIKASI | Ya | `MI/app/register.tsx:19-26,217-242` |
| Verifikasi admin | TERVERIFIKASI | Ya. "1×24 jam" adalah janji operasional (Hati-hati) | `MI/app/driver/verification.tsx` |
| Motor dan Mobil | TERVERIFIKASI | Ya | `MI/app/register.tsx` |
| Saklar Online/Offline | TERVERIFIKASI | Ya | `MI/app/driver/(tabs)/index.tsx:461-493` |
| Tawaran pesanan berdering layar penuh (app terbuka) | TERVERIFIKASI | Ya | `MI/components/driver/IncomingOrderWatcher.tsx` |
| Dering saat HP terkunci / app tertutup | BELUM TERVERIFIKASI (file Firebase Mitra tidak ada di repo) | Jangan | `MI/app.config.js:6-22` |
| Ongkir "hak kamu" terlihat sebelum terima | TERVERIFIKASI | Ya | `IncomingOrderWatcher.tsx:270-273` |
| Driver terdekat diprioritaskan | TERVERIFIKASI (server) | Ya | `BE/app/Services/DriverAssignmentService.php:296-319` |
| Peta rute + buka Google Maps | TERVERIFIKASI | Ya | `MI/app/driver/map/[id].tsx` |
| Navigasi belokan demi belokan di dalam aplikasi | TIDAK ADA | Jangan | `MI/app/driver/map/[id].tsx:219-223` |
| Pesanan bertumpuk (makanan & paket) + urutan antar | TERVERIFIKASI | Ya | `MI/components/driver/RoutePlanCard.tsx`; `BE/app/Services/RoutePlanService.php` |
| QR + PIN penyelesaian | TERVERIFIKASI | Ya | `MI/app/driver/order/[id].tsx:563-609` |
| Talangan (beli dulu + foto nota) | TERVERIFIKASI | Ya | `MI/app/driver/order/[id].tsx:149-174` |
| Pendapatan hari ini / total | TERVERIFIKASI | Ya (tanpa angka contoh yang tampak nyata) | `MI/app/driver/(tabs)/index.tsx:355-391` |
| Biaya tambahan jam sibuk/malam/hujan 100% untuk driver | Kode ada; default nonaktif | Hati-hati | `BE/app/Services/SurchargeService.php:11`; `BE/app/Support/OpsRules.php:37-47` |
| Saldo deposit: isi via Midtrans, tarik ke bank/e-wallet | TERVERIFIKASI | Ya | `MI/app/driver/(tabs)/index.tsx:183-245` |
| Chat pelanggan, rating, keandalan 7 hari | TERVERIFIKASI | Ya | `MI/app/driver/*` |

## 3. Aplikasi Mitra: Toko

| Fitur | Status | Boleh di iklan? | Bukti |
|---|---|---|---|
| Daftar mandiri + KTP pemilik | TERVERIFIKASI | Ya | `MI/app/register.tsx:244-260` |
| Dasbor "Omzet hari ini" | TERVERIFIKASI | Ya | `MI/app/merchant/(tabs)/index.tsx:180-199` |
| Saklar Buka/Tutup | TERVERIFIKASI | Ya | `:239-263` |
| Pesanan masuk berdering + hitung mundur | TERVERIFIKASI (app terbuka) | Ya | `MI/components/merchant/IncomingOrderWatcher.tsx` |
| Terima / Tolak satu ketukan | TERVERIFIKASI | Ya | `MI/lib/merchant/orderActions.ts` |
| Tandai Makanan Siap → Diambil Kurir | TERVERIFIKASI | Ya | `MI/app/merchant/orders/[id].tsx:244-275` |
| Terima pesanan otomatis | TERVERIFIKASI | Ya | `MI/app/merchant/store-settings.tsx:89-108` |
| Jadwal buka-tutup otomatis 7 hari | TERVERIFIKASI | Ya | `store-settings.tsx:88-168` |
| Kelola menu (foto, harga, deskripsi, tersedia/habis) | TERVERIFIKASI | Ya | `MI/app/merchant/menu/form.tsx` |
| Kategori menu / varian / stok angka | TIDAK ADA | Jangan | `MI/types/merchant.ts:41-49` |
| Voucher toko | TERVERIFIKASI | Ya | `MI/app/merchant/vouchers/*` |
| Promosi di Feed (foto/video + tautan produk) | TERVERIFIKASI | Ya (pembeda) | `MI/app/merchant/promo/create.tsx` |
| Saldo Toko + tarik saldo | TERVERIFIKASI | Ya | `MI/app/merchant/wallet.tsx` |
| Ulasan pembeli, chat pembeli | TERVERIFIKASI | Ya | `MI/app/merchant/reviews.tsx`; `chat/[id].tsx` |

## 4. Platform dan admin (latar, bukan fokus iklan)

| Fitur | Status | Bukti |
|---|---|---|
| Panel admin: dashboard GMV, keuangan, verifikasi mitra, aturan operasional, mode hujan | TERVERIFIKASI | `BE/resources/views/admin/layout.blade.php:313-523` |
| Sanksi otomatis pelanggan/driver/toko | TERVERIFIKASI | `BE/app/Services/SanctionService.php` |
| Kepatuhan UU PDP (ekspor data, retensi, hapus akun) | TERVERIFIKASI | `BE/routes/console.php:42-45` |
| Moderasi Feed di admin | Route ada, tautan sidebar tidak ada | `BE/routes/web.php:165-174` |

## 5. Klaim yang aman dipakai (ringkas)
- "Pesan makanan, ojek, mobil, dan kirim paket dalam satu aplikasi."
- "Ongkos terlihat sebelum memesan."
- "Pantau driver langsung di peta, lengkap dengan nama dan plat nomor."
- "Pesanan selesai cukup dengan scan QR."
- "Bayar tunai atau non-tunai."
- "Pesan langsung dari postingan toko di Feed."
- "Satu aplikasi untuk driver dan pemilik toko: Mihape Mitra."
- "Daftar jadi mitra langsung dari aplikasi."

## 6. Klaim yang harus dihindari
- Angka tarif, diskon, atau nominal referral tertentu. Tarif produksi belum terverifikasi.
- "Hanya tunai" (bertentangan dengan kode) dan "QRIS/GoPay" (kanal belum terverifikasi).
- "Dompet/saldo Mihape" untuk pelanggan (fitur tidak ada).
- "Tersedia di App Store".
- "Dering walau HP terkunci" untuk mitra.
- Jumlah pengguna, mitra, kota, atau rating rata-rata. Tidak ada data.
- Layanan Nitah.
