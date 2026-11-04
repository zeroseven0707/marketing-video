# Alur Aplikasi Mihape Mitra (Driver & Toko)

Repo: `mihape-mitra` (Expo 52 / expo-router 4). Commit `7c2ed40`. Referensi `MI/` = `mihape-mitra/`, `BE/` = `mihp-backend/`.
Label: **TERVERIFIKASI** · **BELUM TERVERIFIKASI** · **TIDAK ADA**. Teks dalam tanda kutip adalah label UI asli.

---

## 1. Jenis mitra dan penentuan pengalaman

- Satu aplikasi untuk dua peran: **`driver`** dan **`merchant`** (Toko) (`MI/types/index.ts:6`; `MI/README.md:3`). Role lain ditolak: "Akun ini bukan akun mitra driver atau toko. Gunakan aplikasi Mihape." (`MI/lib/authStore.ts:19,133-137`).
- Routing di `MI/app/_layout.tsx:88-114`:
  1. Belum login → `/register`.
  2. Driver yang belum `approved` → `/driver/verification`.
  3. Merchant tanpa toko terhubung (403) → `/merchant/not-linked`.
  4. Selain itu → `/driver` atau `/merchant`.
- Tab Driver: **Beranda, Pesanan, Riwayat, Akun** (`MI/app/driver/(tabs)/_layout.tsx:37-80`).
- Tab Toko: **Pesanan, Menu, Promosi, Toko** (`MI/app/merchant/(tabs)/_layout.tsx:24-43`).
- Aplikasi Mitra tidak memakai data mock di runtime: `mocks/` hanya aktif bila `EXPO_PUBLIC_EXPO_GO=1` (`MI/metro.config.js:16-32`).

---

## 2. Login, registrasi, verifikasi (bersama) — TERVERIFIKASI

| Langkah | Detail | Endpoint | Bukti |
|---|---|---|---|
| Masuk | Badge "Aplikasi Mitra Driver & Toko", field "Email atau No. HP" + Password, sidik jari, "Daftar jadi Mitra" | `POST /login` | `MI/app/login.tsx:54-120` |
| Daftar | "Mau jadi mitra apa?" dengan dua kartu: **Driver** "Antar penumpang, paket & makanan" (KTP, SIM, STNK · Penghasilan harian) dan **Toko** "Jual makanan & minuman" (Pesanan masuk di HP · Uang ke Saldo Toko) | `POST /partner/register` (multipart) | `MI/app/register.tsx:143-169`; `MI/lib/authStore.ts:148-163` |
| Data driver | Motor/Mobil, plat nomor, Foto KTP, Foto SIM, Foto STNK, Selfie dengan KTP | | `MI/app/register.tsx:19-26,217-242` |
| Data toko | Nama, alamat, deskripsi (opsional), foto toko (opsional), Foto KTP pemilik | | `MI/app/register.tsx:244-260` |
| Lupa password | Kode 6 angka via email, "Kode berlaku 15 menit" | `/password/forgot`, `/password/reset` | `MI/app/forgot-password.tsx:21-67` |
| Maintenance / update | "Sedang Pemeliharaan", "Perlu Update Aplikasi" | `GET /app-config?app=mitra` | `MI/components/AppGate.tsx:24-81` |

Verifikasi dilakukan admin (`BE/routes/web.php:157`; `BE/app/Services/PartnerService.php:153-175`).

Inkonsistensi copy: README dan subtitle login masih menyebut akun dibuat admin (`MI/README.md:10-12`; `MI/app/login.tsx:64`), padahal pendaftaran mandiri sudah ada. Iklan harus mengikuti kode: **daftar di aplikasi**.

---

## 3. DRIVER

### 3.1 Verifikasi (`MI/app/driver/verification.tsx`) — TERVERIFIKASI
- `pending`: "Pendaftaran sedang diperiksa", "biasanya 1×24 jam pada hari kerja", dan daftar "Selagi menunggu", dengan tombol "Cek Status" (`:76-112`).
- `rejected`: "Pendaftaran perlu diperbaiki" + alasan dari admin, unggah ulang lewat `POST /partner/resubmit` (`:47-103`).
- "1×24 jam" adalah janji operasional, bukan logika kode, jadi **BELUM TERVERIFIKASI**.

### 3.2 Beranda / dashboard (`MI/app/driver/(tabs)/index.tsx`) — TERVERIFIKASI
- "Selamat bekerja, {nama}" + chip "Motor/Mobil · PLAT" (`:322-352`).
- **Hero gradien pink** "Pendapatan hari ini", dengan "Selesai hari ini", "Total selesai", "Total pendapatan" (`GET /driver/stats`) (`:355-391`).
- Kartu **"Saldo Deposit Driver"** + "+ Isi Saldo", "Tarik Saldo", "Riwayat saldo & rincian potongan". Ada banner suspensi dan banner saldo minus (`:394-458`).
- **Online/Offline**: "Kamu Online" / "Kamu Offline", "Siap menerima tawaran pesanan", saklar `POST /driver/toggle-active`. Saat online, aplikasi meminta izin lokasi "sepanjang waktu" (`:153-181,461-493`). Tidak bisa offline bila masih ada pesanan aktif ("Masih Ada Pesanan").
- Kosong saat online: "Mencari pesanan untukmu" (ikon radar) (`:576-585`).

### 3.3 Lokasi latar belakang — TERVERIFIKASI
Foreground service dengan notifikasi "Mihape Mitra aktif — Kamu Online. Lokasi dikirim agar pesanan terdekat bisa masuk." Lokasi dikirim tiap 5 detik saat ada pesanan, tiap 60 detik saat idle, lewat `POST /driver/location` (`MI/lib/driver/backgroundLocation.ts:27-131`).

### 3.4 Penerimaan pesanan — TERVERIFIKASI (kode)
- Pesanan masuk lewat event Reverb `driver.{userId}` (`.offer.created`, `.offer.withdrawn`, `.status.changed`) + polling 8 detik (`MI/components/driver/IncomingOrderWatcher.tsx:19-108`).
- **Modal layar penuh "Pesanan Baru!"** berisi:
  - nama layanan
  - badge pembayaran ("💵 COD · TUNAI", "✓ NON-TUNAI (LUNAS)", "💵 COD TALANGAN")
  - badge biaya tambahan
  - Jemput/Antar, rincian COD
  - **"Ongkos kirim (hak kamu)"**
  - tombol **"Tolak"** / **"Terima & Mulai Perjalanan"** / "Matikan dering"
  - Sumber: `:188-308`
- Dering loop `assets/sounds/order_ring.wav` (`MI/lib/ringtone.ts:7-31`).
- Saat aplikasi tertutup: FCM → Notifee kategori CALL, layar penuh, "Pesanan baru untukmu!" (`MI/lib/notifications.ts:108-198`). **BELUM TERVERIFIKASI**, karena `google-services.json` tidak ada di repo Mitra.
- Batas waktu tawaran: 60 detik dari server untuk pesanan toko, 30 detik (konstanta klien) untuk pesanan lain (`index.tsx:31-33`). Aturan server: tawaran 60 detik, 3 penolakan → batal (`BE/app/Models/Order.php:49-53`).
- Endpoint: `PUT /driver/orders/{id}/accept|reject` (`MI/lib/driver/orderActions.ts:8-17`).
- Matching di server: driver terdekat ±30 km dengan lokasi ≤15 menit, lalu round-robin. Lihat [API_AND_BUSINESS_LOGIC §4](API_AND_BUSINESS_LOGIC.md).

### 3.5 Alur kerja per pesanan (`MI/app/driver/order/[id].tsx`) — TERVERIFIKASI
| Status | Label | Yang dilakukan driver |
|---|---|---|
| `pending` | Mencari Driver | **Tolak** / **Terima & Mulai Perjalanan** |
| `accepted` | Driver Menuju | **Mulai Perjalanan** (`PUT …/process`). Untuk **talangan**: wajib foto nota (`POST …/process` multipart). Untuk pesanan toko mandiri: menunggu toko menekan "Pesanan Diambil Kurir" |
| `on_progress` | Diantar | Tampilkan **QR Code Penyelesaian** + **PIN 4 digit**, "Buka Maps", modal "Scan untuk Selesaikan Pesanan" |
| `completed` | Selesai | "Kerja bagus! Kamu mendapat Rp …" |
| `cancelled` | Dibatalkan | "Pelanggan membatalkan pesanan ini." |

Bukti: `MI/lib/driver/orderStatus.ts:5-12`; `MI/app/driver/order/[id].tsx:34-52,78-84,149-174,287-310,523-609`.

- Stepper: Diterima → Menjemput → Mengantar → Selesai.
- Kartu tambahan: "Ambil di Toko" + telepon toko, "Pelanggan" + "Hubungi" + "Chat Pelanggan", Rute + "Navigasi" (Google Maps), rincian makanan, Pembayaran + "Ongkos Kirim Bersih (Hak Kamu)" (`:332-518`).

### 3.6 Peta dan navigasi (`MI/app/driver/map/[id].tsx`) — TERVERIFIKASI
Leaflet di WebView, marker driver pink, rute dari `GET /geo/route`, header "Menuju Pickup" / "Menuju Pelanggan" + jarak dan durasi, tombol "Lokasiku" dan "Buka Google Maps" (`:51-383`). Navigasi belokan demi belokan di dalam aplikasi **TIDAK ADA**; navigasi diserahkan ke Google Maps.

### 3.7 Pesanan bertumpuk dan urutan antar — TERVERIFIKASI
- Pesanan `food` dan `delivery` bisa ditumpuk sampai `max_active_orders` (default server 2). Penumpang tidak pernah ditumpuk (`MI/types/driver.ts:130-143`; `BE/app/Services/DriverAssignmentService.php:209-215,339-381`).
- **"Urutan antar"**: daftar stop bernomor dengan ETA + "Navigasi ke titik 1" (`GET /driver/route-plan`) (`MI/components/driver/RoutePlanCard.tsx:19-62`).

### 3.8 Chat — TERVERIFIKASI
Balasan cepat: "Saya sedang menuju lokasi", "Pesanan sedang disiapkan toko", "Saya sudah sampai", "Mohon ditunggu sebentar" (`MI/app/driver/chat/[id].tsx:5`).

### 3.9 Pendapatan, saldo, riwayat — TERVERIFIKASI
- **Isi Saldo Deposit**: "Pembayaran online Midtrans (QRIS / VA)", preset Rp20.000–200.000, minimal Rp10.000 (`POST /driver/wallet/topup`) (`index.tsx:183-212,625-693`).
- **Tarik Saldo**: bank/e-wallet, diverifikasi dan ditransfer manual oleh admin (`POST /driver/wallet/withdraw`) (`:214-245,696-777`). Server: minimal Rp20.000 (`BE/app/Services/WalletService.php:17-19`). Klien menampilkan minimal Rp10.000, jadi ada selisih.
- **Riwayat Saldo**: mutasi per pesanan (Isi Saldo, Penarikan, Pengembalian, Pendapatan Pesanan, Potongan Pesanan) (`MI/app/driver/wallet.tsx:23-147`).
- **Tab Pesanan**: filter Semua / Aktif / Selesai / Dibatalkan (`MI/app/driver/(tabs)/orders.tsx`).
- **Tab Riwayat**: pesanan selesai + "Total pendapatan" (`MI/app/driver/(tabs)/history.tsx`).
- Pendapatan per pesanan = ongkir (+ biaya talangan) (+ surcharge). Untuk tunai, setoran dipotong dari saldo deposit (`MI/app/driver/order/[id].tsx:480-518,615-636`; `BE/app/Services/WalletSettlementService.php:52-135`).

### 3.10 Akun driver — TERVERIFIKASI
- Profil dengan rating, "Mitra Driver Motor/Mobil · PLAT", **keandalan 7 hari** ("Tawaran diterima %", "Dibatalkan %") (`MI/app/driver/(tabs)/profile.tsx:91-163`).
- "Penilaian Saya": rata-rata dan distribusi bintang (`MI/components/ReviewsScreen.tsx`).
- Keamanan: biometrik, perangkat, riwayat login, unduh data, hapus akun (`MI/app/driver/security.tsx:115-140`).

---

## 4. TOKO (Merchant)

### 4.1 Verifikasi toko — TERVERIFIKASI
Tidak dipaksa oleh routing. Banner dasbor membuka checklist "Yang perlu dilengkapi": titik lokasi, minimal 1 menu, foto toko. Statusnya "Toko sudah tayang" / "Menunggu verifikasi admin" / "Pendaftaran perlu diperbaiki" (`MI/app/merchant/verification.tsx:26-120`). Toko belum terhubung → "Toko belum terhubung" (`MI/app/merchant/not-linked.tsx`).

### 4.2 Dasbor (`MI/app/merchant/(tabs)/index.tsx`) — TERVERIFIKASI
- "Dasbor toko", hero pink "Ringkasan hari ini": **"Omzet hari ini"**, Pesanan baru / Diproses / Selesai (`:169-199`).
- Kartu "Saldo Pendapatan Toko" + "Tarik Saldo" (`:210-236`).
- **Saklar buka/tutup**: "Toko buka — siap menerima pesanan" / "Toko tutup — pembeli tidak bisa memesan" (`:109-125,239-263`).
- Banner "ditutup otomatis sistem" bila pesanan tidak direspons (`:202-207`).
- Daftar pesanan: tab **Masuk / Diproses / Riwayat** (`:307-332`).

### 4.3 Pesanan masuk dan alur kerja toko — TERVERIFIKASI
- Watcher: event `store.{storeId}` (`.order.incoming`, `.order.updated`, `.store.status`) + polling 8 detik (`MI/components/merchant/IncomingOrderWatcher.tsx`).
- **Modal "Pesanan Baru!"** dengan hitung mundur besar "sebelum dibatalkan otomatis", kode, pembeli, item, catatan, "Total makanan", tombol **Tolak / Terima**, "Nanti (dering tetap berbunyi)" (`:154-210`).
- Tolak: alasan cepat "Bahan habis", "Toko terlalu ramai", "Toko akan tutup", "Alasan lain…" (`MI/components/merchant/RejectSheet.tsx`).

| Status | Label toko | Aksi |
|---|---|---|
| `waiting_store` | Menunggu Konfirmasi | **Terima Pesanan** / Tolak → "Pesanan diterima. Menawarkan ke driver terdekat…" |
| `pending` | Menawarkan ke Driver | **Tandai Makanan Siap** |
| `accepted` | Driver Menuju Toko | **Pesanan Diambil Kurir** ("Serahkan ke kurir?") |
| `on_progress` | Diantar Kurir | — |
| `completed` / `cancelled` | Selesai / Dibatalkan | — |

Bukti: `MI/lib/merchant/orderActions.ts:44-68`; `MI/app/merchant/orders/[id].tsx:101-275`.

- Detail pesanan: "Kode ambil (cocokkan dengan driver)", Subtotal, Diskon voucher toko, **Bagi hasil platform**, **Pendapatan bersih toko**, info bayar, kartu driver (nama, plat), timeline perjalanan pesanan.
- Batas respons diambil dari server (`store_deadline`; default 5 menit di `BE/app/Models/Order.php:46`).

### 4.4 Menu — TERVERIFIKASI
"Menu — Atur menu, harga, dan ketersediaan", dengan ringkasan Total / Tersedia / Habis dan saklar Tersedia/Habis. Form berisi foto (1:1), nama, harga, deskripsi (`MI/app/merchant/(tabs)/menu.tsx`; `MI/app/merchant/menu/form.tsx`). Kategori, varian/topping, dan stok angka **TIDAK ADA**.

### 4.5 Pengaturan toko — TERVERIFIKASI
- Profil toko: foto, nama, deskripsi, telepon, alamat, titik peta (`MI/app/merchant/store-edit.tsx`).
- **"Terima pesanan otomatis"** dan **"Buka & tutup otomatis"** dengan jadwal Senin–Minggu per 15 menit, termasuk "Salin jam Senin ke Selasa–Jumat" (`MI/app/merchant/store-settings.tsx:88-168`).
- Notifikasi pesanan: "Tes nada dering", izin layar penuh, penghemat baterai (`MI/app/merchant/(tabs)/store.tsx:146-220`).

### 4.6 Promosi di Feed — TERVERIFIKASI
- "Promosi — Posting di Feed Mihape dan tautkan menu tokomu. Pelanggan bisa langsung memesan dari postingan." (`MI/app/merchant/(tabs)/promo.tsx:114-115`)
- Buat postingan: Foto (maks 10) **atau** Video (1, maks 60 detik / 50 MB, pilih sampul), caption, "Tautkan Produk" (maks 6). Gratis sampai kuota habis, sesudahnya bayar per postingan via Midtrans (`MI/app/merchant/promo/create.tsx:19-263`; `MI/components/merchant/PromoCostNotice.tsx`).
- Hanya bisa dipakai bila toko sudah disetujui (`promo.tsx:21,119-123`).

### 4.7 Voucher toko — TERVERIFIKASI
Kode, judul, Persentase/Nominal, maks potongan, min belanja, kuota, limit per pelanggan, saklar aktif (`MI/app/merchant/vouchers/*`). Periode berlaku **tidak bisa diatur** dari aplikasi.

### 4.8 Pendapatan dan riwayat toko — TERVERIFIKASI
- Pendapatan bersih = subtotal − diskon voucher − bagi hasil platform. Masuk ke Saldo Toko saat pesanan selesai (`MI/types/merchant.ts:70-74`; `BE/app/Models/Order.php:275-282`).
- "Riwayat Saldo Toko", "Penarikan sedang diproses", tarik saldo (`MI/app/merchant/wallet.tsx`). Top-up toko **TIDAK ADA**.
- Ulasan Pembeli (`MI/app/merchant/reviews.tsx`). Chat pembeli dengan balasan cepat "Pesanan sedang disiapkan", "Maaf, menu ini sedang habis" (`MI/app/merchant/chat/[id].tsx:5-9`).

---

## 5. Perbedaan alur Driver vs Toko (ringkas)

| Aspek | Driver | Toko |
|---|---|---|
| Masuk kerja | Saklar Online | Saklar Buka/Tutup atau jadwal otomatis |
| Pesanan masuk | Tawaran berdering, 1 driver per giliran | Pesanan berdering dengan hitung mundur, atau terima otomatis |
| Aksi utama | Terima → Mulai Perjalanan → QR/PIN | Terima → Makanan Siap → Diambil Kurir |
| Uang | Saldo deposit (top-up + tarik); setoran tunai dipotong | Saldo Toko (tarik saja) |
| Pemasaran | — | Voucher toko, Promosi Feed |
| Reputasi | Rating driver, keandalan 7 hari | Ulasan pembeli, ranking toko |

## 6. Momen visual terkuat untuk video
1. Saklar **Online**, lalu radar "Mencari pesanan untukmu".
2. Modal layar penuh **"Pesanan Baru!"** dengan dering, lalu "Terima & Mulai Perjalanan".
3. Driver menampilkan **QR + PIN** dan pelanggan scan.
4. Hero gradien "Pendapatan hari ini".
5. Toko: modal "Pesanan Baru!" dengan hitung mundur → Terima → "Tandai Makanan Siap" → "Pesanan Diambil Kurir".
6. Toko membuat postingan video dengan produk tertaut di Feed.
