# Alur Aplikasi Mihape (Pelanggan)

Repo: `mihp-customer` (Expo 52 / expo-router 4). Commit `dac58f5`. Referensi `CU/` = `mihp-customer/`.
Label: **TERVERIFIKASI** · **BELUM TERVERIFIKASI** · **TIDAK ADA**. Teks dalam tanda kutip adalah label UI asli.

---

## 1. Peta navigasi

### 1.1 Gating di root (`CU/app/_layout.tsx:85-121`)
1. Belum login → `/(auth)/login`. Semua layar wajib login. Mode tamu (`AuthPlaceholder`) ada di kode tetapi **tidak terjangkau**.
2. Akun `driver`/`merchant` → alert "Ini akun toko/driver. Silakan masuk lewat aplikasi Mihape Mitra." lalu logout.
3. Email belum diverifikasi → `/(auth)/verify-email`.
4. Sudah login → `/(tabs)/home`.
5. `AppGate`: layar "Sedang Pemeliharaan", "Perlu Update Aplikasi", atau alert "Update Tersedia", berdasarkan `GET /app-config` (`CU/components/AppGate.tsx:24-62`).

### 1.2 Tab bawah (`CU/app/(tabs)/_layout.tsx:199-259`)
| # | Tab | Ikon (lucide) | Isi |
|---|---|---|---|
| 1 | Beranda | Home | layanan, banner, toko, makanan |
| 2 | Feed | LayoutGrid | social commerce |
| 3 | (tengah) | ScanLine, tombol bulat pink 56px | **Scan QR** untuk menyelesaikan pesanan |
| 4 | Pesanan | ClipboardList | daftar pesanan |
| 5 | Akun | UserCircle2 | profil & pengaturan |

Notifikasi ada di route tersembunyi dan dibuka dari ikon lonceng.

### 1.3 Daftar layar
`(auth)/login`, `(auth)/register`, `(auth)/upload-photo`, `(auth)/verify-email`, `(auth)/forgot-password`, `(tabs)/home|feed|scan|orders|profile|notifications`, `service/[id]`, `stores`, `foods`, `store/[id]`, `store/reviews/[id]`, `food/[id]`, `checkout/food`, `order/[id]`, `order/tracking/[id]`, `order/chat/[id]`, `orders-list`, `search`, `history-transactions`, `referral`, `tickets`, `ticket/new`, `ticket/[id]`, `addresses`, `addresses/edit`, `security`, `change-password`, `login-history`, `devices`, `delete-account`, `settings`, `edit-profile`, `blocked-users`, `post/[id]`, `user-profile/[id]`.

Catatan: `CU/app/(tabs)/scan.tsx` hanya stub (`return null`). Fungsi scan sebenarnya berupa modal di `CU/app/(tabs)/_layout.tsx:18-165`.

---

## 2. Onboarding dan autentikasi — TERVERIFIKASI

| Langkah | Detail | Endpoint | Bukti |
|---|---|---|---|
| Splash | Logo + "Mudah, Cepat, Nyaman" | — | `CU/components/SplashScreen.tsx:11-12` |
| Masuk | "Selamat datang kembali! Silakan masuk ke akunmu." Field "Email atau No. HP" + Password, "Lupa password?", tombol sidik jari (bila biometrik aktif) | `POST /login` | `CU/app/(auth)/login.tsx:53-112`; `CU/lib/authStore.ts:114-121` |
| Daftar | "Bergabung dengan Mihape sekarang. Hanya butuh satu menit." Nama, Email, No. HP, Password, Konfirmasi, **Kode Referral (opsional)**, centang S&K | `POST /register` | `CU/app/(auth)/register.tsx:69-77` |
| Foto profil | "Langkah Terakhir · Foto Profil", galeri/kamera, bisa dilewati | `POST /profile/update` | `CU/app/(auth)/upload-photo.tsx:28-140` |
| Verifikasi email | **Link via email** (bukan OTP), "Saya Sudah Verifikasi", "Kirim Ulang Link" | `POST /email/resend`, `GET /profile` | `CU/app/(auth)/verify-email.tsx:16-78` |
| Lupa password | Email → kode 6 angka via email + password baru | `POST /password/forgot`, `/password/reset` | `CU/app/(auth)/forgot-password.tsx:29-67` |
| Biometrik | Face ID / sidik jari untuk masuk ulang | — | `CU/lib/authStore.ts:171-249`; `CU/app/security.tsx:33-62` |

**TIDAK ADA**: login Google/Apple/sosial, OTP SMS.

---

## 3. Beranda — TERVERIFIKASI (isi dari server)

- Header "Selamat datang" / **"Halo, {nama depan}"**, lonceng dengan badge, chip lokasi (hanya tampilan, tidak bisa diketuk), pencarian "Cari layanan, toko, makanan..." (`CU/app/(tabs)/home.tsx:327-359`).
- Section diatur server (`GET /home`), diurutkan dan hanya yang aktif (`home.tsx:69-72,373-383`):
  - `banner`: carousel. Bila tidak ada gambar, tampil gradien pink `#D81B60→#FE679F` (`:134-187`)
  - `service_list`: grid ikon layanan (`:189-215`)
  - `store_list` / `food_list`: kartu horizontal dengan "Lihat semua" (`:224-288`)
  - `promo`: kartu bertag "PROMO" (`:290-311`)
  - `custom`: **tidak dirender** (`:381`)
- Kartu mengambang **"Pesanan aktif"** (polling 15 detik): "Mencarikan Driver…", "Driver Menjemput Pesanan", "Pesanan Sedang Diantar", dengan tombol "Lacak" (`:93-97,388-415`).
- Kartu mengambang **Keranjang**: "{n} item dari {toko} · Lanjutkan pesananmu" (`:418-439`).
- Isi banner, toko, dan menu di produksi: **BELUM TERVERIFIKASI**.

---

## 4. Layanan dan alur pemesanan

| Layanan | Slug | Ikon / warna aksen | Alur |
|---|---|---|---|
| Pesan Makanan | `food` | Utensils `#E8590C` | §4.2 |
| Ojek | `ojek` | Bike `#D81B60` | §4.1 |
| Mobil | `car` / `mobil` | Car `#2563EB` | §4.1 |
| Kirim Paket | `delivery` | Package `#7C3AED` | §4.1 (form ride yang sama, tanpa field detail paket) |
| Nitah | `nitah` | HandHelping `#0D9488` | §4.1 dengan tujuan berupa teks "Mau nitah apa?". **BELUM TERVERIFIKASI** di produksi |

Bukti: `CU/app/(tabs)/home.tsx:24-31`; `CU/app/(tabs)/orders.tsx:20-35`.

### 4.1 Ojek / Mobil / Kirim Paket — `service/[id]` — TERVERIFIKASI
1. Layar **"Pesan {Nama}"** dengan banner layanan. Bila deskripsi kosong, tampil "Cepat, aman, dan terpercaya" (`CU/app/service/[id].tsx:347-359`).
2. **Lokasi Jemput**: peta Leaflet + cari alamat + GPS ("Gunakan lokasi saat ini") atau chip alamat tersimpan (`:362-394`).
3. **Tujuan**: picker peta atau alamat (`:397-434`).
4. **Catatan untuk Driver** (opsional) (`:437-455`).
5. **Kupon Promo Ongkir** (`:458-483`, `VoucherPickerModal` mode `platform_only`).
6. **Metode Pembayaran**: "Tunai (COD)" / "Non-Tunai (QRIS / Midtrans)" (`:486-537`).
7. Bar bawah: "Estimasi Ongkir", "Hemat Rp…", "+ Biaya tambahan (…)", "+ Biaya layanan", tombol **"Pesan Sekarang"** (`:542-591`). Ongkir diambil dari `GET /delivery-fee` (`:164-185`).
8. `POST /orders`. Bila non-tunai, browser Midtrans Snap terbuka (`:211-237`).
- Validasi alamat: "Alamat Belum Diatur" (`:202-207`). Sanksi pembatalan bisa menonaktifkan tunai atau memblokir pemesanan (`CU/lib/standing.ts:18-51`).

### 4.2 Pesan Makanan — TERVERIFIKASI
1. **"Pesan Makanan"**: cari resto, "Restoran Populer", badge Buka/Tutup (`CU/app/service/[id].tsx:256-325`). Bisa juga lewat "Semua Restoran" (`stores`) atau "Semua Menu Makanan" (`foods`).
2. **Halaman toko** `store/[id]`: hero, badge Buka/Tutup, "Konfirmasi oleh toko", rating, jarak dan durasi, grid "Menu Tersedia" (badge "Habis", tombol "Tambah" / +/−), 3 ulasan teratas, cart bar (`CU/app/store/[id].tsx:39-256`).
3. **Detail menu** `food/[id]`: "Disediakan oleh", Jumlah, tombol "Pesan Sekarang" / "Menu Habis" / "Toko Tutup" (`CU/app/food/[id].tsx:29-140`).
4. **Keranjang**: satu toko per keranjang, berlaku 24 jam. Bila menambah dari toko lain muncul dialog "Ganti isi keranjang?" (`CU/lib/cartStore.ts:9,86-117`).
5. **Checkout "Konfirmasi Pesanan"** (`CU/app/checkout/food.tsx`):
   - Sinkron harga, dengan banner "Harga/menu diperbarui" bila ada perubahan (`:108-130,300-309`)
   - "Detail Pengiriman" (alamat tersimpan) (`:312-344`)
   - "Catatan (opsional)", "Kupon & Voucher Promo" (kupon ongkir Mihape + voucher toko) (`:347-408`)
   - Pembayaran: "Tunai (Bayar di Tempat)" / "Non-Tunai (Midtrans / QRIS)" (`:419-460`)
   - **Ringkasan Pembayaran**: Harga Makanan, Ongkos Kirim (km, menit), Biaya Layanan, Biaya tambahan, **Biaya Jasa Beli**, Diskon Toko, Diskon Ongkir, Total (`:465-537`)
   - Toko kelolaan Mihape: "Pesanan dari toko ini dibelikan langsung oleh driver, sehingga tidak bisa dibatalkan setelah driver menerima pesanan." (`:507-511`)
6. `POST /food-orders`. Untuk toko mandiri muncul alert "Pesanan dikirim ke {toko}, menunggu konfirmasi toko." (`:210-251`).

### 4.3 Kupon dan voucher — TERVERIFIKASI
"Pilih Promo & Voucher", input "Punya kode promo? Masukkan di sini", section "Kupon Ongkir Mihape" dan voucher toko. Endpoint `GET /coupons`, `POST /coupons/validate` (`CU/components/VoucherPickerModal.tsx:62,102,152-207`).

---

## 5. Pembayaran

| Metode | Status | Bukti |
|---|---|---|
| Tunai (COD) | TERVERIFIKASI | `CU/types/index.ts:80` |
| Non-tunai Midtrans Snap (browser) | TERVERIFIKASI di kode. Kanal (QRIS/GoPay/VA) **BELUM TERVERIFIKASI** | `CU/app/checkout/food.tsx:239-240`; `CU/app/order/[id].tsx:158-178` |
| Dompet / saldo / top-up pelanggan | **TIDAK ADA** | grep `wallet|saldo|topup` |
| Kelola metode pembayaran | **TIDAK ADA**, padahal disebut di teks `CU/app/(tabs)/profile.tsx:44` | — |

---

## 6. Detail pesanan, tracking, dan penyelesaian

### 6.1 Status
| Enum | Label pelanggan | Warna |
|---|---|---|
| `waiting_store` | Menunggu Toko | abu |
| `pending` | Mencari Driver | oranye `#B45309` |
| `accepted` | Driver Menuju | biru `#1D4ED8` |
| `on_progress` | Diantar | pink `#AD1457` |
| `completed` | Selesai | hijau `#15803D` |
| `cancelled` | Dibatalkan | merah `#DC2626` |

Sumber: `CU/lib/orderStatus.ts:5-47`.

### 6.2 Detail pesanan `order/[id]` — TERVERIFIKASI
- Timeline: Dikonfirmasi toko → Mencari driver → Driver menuju lokasi → Pesanan diantar → Pesanan selesai (`CU/app/order/[id].tsx:39-70`).
- **Masa tenggang batal**: "Kamu masih bisa membatalkan dalam {n} detik" (10 detik). Setelah itu app memanggil `PUT /orders/{id}/confirm` sampai dapat driver (`CU/lib/useOrderAutoConfirm.ts:6-58`).
- Kartu: Lacak Pesanan, Chat Driver / Chat Toko, Rute, Informasi Driver, Rincian, Ringkasan Pembayaran ("Lunas"/"Belum Lunas", "Bayar Sekarang via Midtrans", "Bayar tunai ke driver saat pesanan sampai.") (`:255-485`).
- Update: event realtime `.order.updated` + polling 10 detik (`:84-115`).

### 6.3 Tracking `order/tracking/[id]` — TERVERIFIKASI (kode)
- Peta Leaflet: marker toko, tujuan, "Lokasi Kamu", **driver berdenyut** dengan ikon motor/mobil, garis rute pink (`CU/app/order/tracking/[id].tsx:236-282`).
- Posisi driver: event Reverb `.driver.location` + polling 5 detik (`:83-140`). Rute dan ETA dari `GET /geo/route` (OSRM).
- Header "Driver menuju ke toko / titik jemput" / "Driver sedang menuju ke tujuan" + jarak/ETA. Langkah Diterima → Dijemput → Tiba (`:22-29,354-356`).
- Kartu driver: nama, **plat nomor**, chat, telepon (`:332-344`).
- Apakah realtime aktif di produksi: **BELUM TERVERIFIKASI**. Polling tetap berjalan.

### 6.4 Chat `order/chat/[id]` — TERVERIFIKASI
Thread driver/toko, dengan balasan cepat "Saya sudah di lokasi", "Tolong hubungi saya", "Ditunggu ya", "Tidak pedas ya", "Mohon dibungkus terpisah". Ada status dibaca, dan chat ditutup otomatis (`CU/app/order/chat/[id].tsx:6-13`; `CU/components/OrderChat.tsx`).

### 6.5 Scan QR / PIN — TERVERIFIKASI
Tombol tengah tab bar membuka modal "Scan QR Code". Pelanggan memindai QR di HP driver, atau mengetik "4-Digit PIN Driver". Request `POST /orders/complete-by-token`, lalu muncul "Pesanan Selesai" (`CU/app/(tabs)/_layout.tsx:18-165`).

### 6.6 Rating dan komplain — TERVERIFIKASI
- "Bagaimana pesananmu?": bintang + komentar untuk Driver dan Toko, terbuka otomatis sekali (`CU/components/RatingSheet.tsx:38-106`).
- "Ajukan pengembalian dana" / "Laporkan masalah" → tiket (`CU/components/OrderTicketActions.tsx:42-60`).

### 6.7 Daftar pesanan
Tab "Pesanan Saya — Pantau status pesanan kamu" (`CU/app/(tabs)/orders.tsx:18-208`). Layar `orders-list` punya filter per status (`CU/app/orders-list.tsx`).

---

## 7. Riwayat transaksi — TERVERIFIKASI (terbatas)
"Riwayat Transaksi" (`GET /transactions`) dengan item **Pembayaran** (−Rp, merah) dan **Refund** (+Rp, hijau) (`CU/app/history-transactions.tsx:22-66`). Status dan tanggal tidak ditampilkan.

---

## 8. Feed (social commerce) — TERVERIFIKASI
- Feed postingan toko (foto/video) dan pelanggan (foto). Ada suka (double-tap), simpan, komentar bertingkat, dan bagikan tautan `/post/{id}` (`CU/app/(tabs)/feed.tsx`).
- Produk tertaut: label "{menu} · Rp…" / "{n} produk · Pesan" membuka **ProductSheet** dengan tombol "Tambah", "Kunjungi Toko", "Lihat Keranjang" → checkout (`CU/components/feed/FeedItem.tsx:58-78`; `ProductSheet.tsx:75-171`).
- Buat postingan: caption maks 2.200 karakter, maks 10 foto (`feed.tsx:145-363`).
- Moderasi: laporkan (7 alasan), blokir pengguna, daftar "Pengguna Diblokir" (`CU/lib/feed.ts:6-43`).
- Copy: "Jadilah yang pertama berbagi momen!" (`feed.tsx:264`).

---

## 9. Profil dan pengaturan — TERVERIFIKASI

| Menu | Isi | Bukti |
|---|---|---|
| Akun Saya | kartu profil + "Edit", shortcut Menunggu / Diproses / Dikirim / Diterima | `CU/app/(tabs)/profile.tsx:31-119` |
| Ajak Teman | "Ajak teman, sama-sama dapat kupon", salin/bagikan kode, statistik | `CU/app/referral.tsx:24-183` |
| Riwayat Transaksi | §7 | |
| Laporan Saya | tiket complaint/refund, chat dengan "Tim Mihape", rekening refund | `CU/app/ticket/*`; `CU/lib/tickets.ts` |
| Alamat Saya | Rumah/Kantor/Kos/Apartemen/Lainnya, titik peta, alamat utama | `CU/app/addresses/*` |
| Keamanan Akun | biometrik, Ganti Password, Perangkat Terhubung, Riwayat Login, **Unduh Data Saya**, Hapus Akun | `CU/app/security.tsx:97-139` |
| Notifikasi | "Update terbaru untuk kamu", tipe promo / status pesanan / sistem, "Tandai semua dibaca" | `CU/app/(tabs)/notifications.tsx` |
| Pusat Bantuan, Tentang, Privasi, S&K | membuka web `mihape.biz.id` | `CU/lib/links.ts:5-16` |
| Pengaturan | grup Akun / Aktivitas / Lainnya | `CU/app/settings.tsx:18-41` |

---

## 10. Momen visual terkuat untuk video (berdasarkan kode)
1. Beranda "Halo, {nama}" dengan grid 4 layanan.
2. Pilih titik jemput di peta, lalu ongkir langsung muncul.
3. Ringkasan pembayaran transparan, lalu "Pesan Sekarang".
4. Marker driver berdenyut bergerak di peta, dengan kartu driver dan plat nomor.
5. Tombol scan pink di tengah tab bar, scan QR di HP driver, lalu "Pesanan Selesai".
6. Feed: video toko dengan produk tertaut, lalu "Tambah", lalu keranjang.
7. Rating bintang "Bagaimana pesananmu?".
