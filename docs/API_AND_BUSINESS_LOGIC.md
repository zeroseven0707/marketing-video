# API dan Business Logic Mihape

Sumber utama: `mihp-backend` (Laravel 12). Referensi `BE/` = `mihp-backend/`, `CU/` = `mihp-customer/`, `MI/` = `mihape-mitra/`.
Nilai default di bawah berasal dari kode. Nilai produksi disimpan di database/AppSetting dan **BELUM TERVERIFIKASI** kecuali disebut lain.

---

## 1. Model domain dan relasi

```
User (role: user | driver | merchant | admin)
 ├─1:1─ DriverProfile   (vehicle_type motor|mobil, license_plate, balance=saldo deposit,
 │                       is_online, current_lat/lng, verification_status, dokumen KTP/SIM/STNK/selfie)
 ├─1:1─ Store           (merchant: is_open, auto_accept, opening_hours, balance=Saldo Toko,
 │        │              is_self_managed, verification_status)
 │        ├─1:N─ FoodItem   (name, price, cost_price, image, is_available)
 │        └─1:N─ Coupon     (voucher toko)
 ├─1:N─ UserAddress (maks 3)
 ├─1:N─ Post ─1:N─ PostComment / PostLike / PostSave   (maks 6 produk tertaut)
 └─1:N─ Order (sebagai pelanggan) / Order (sebagai driver)

Order ─N:1─ Service (food|ojek|car|delivery)
      ─N:1─ Store (pesanan makanan)
      ─1:N─ FoodOrderItem
      ─1:1─ OrderRating (driver_rating, store_rating)
      ─1:N─ OrderTicket (complaint|refund) ─1:N─ messages
      ─1:N─ OrderMessage (thread driver|store)
      ─1:N─ Transaction (topup|payment|refund)
WalletTransaction ─N:1─ DriverProfile | Store   (topup, order_earning, order_deduction, withdrawal, refund)
Withdrawal (pending|approved|rejected)
Referral (pending|rewarded|rejected|expired)
```

Bukti: `BE/app/Models/User.php:21-123`, `DriverProfile.php:14-35`, `Store.php:16-219`, `FoodItem.php:14`, `Order.php:16-226`, `Transaction.php:14`, `WalletTransaction.php:14-27`, `Withdrawal.php:14-27`, `Coupon.php:16-34`, `OrderTicket.php:18-52`, `Referral.php:13-28`, `UserAddress.php:10-24`, `Post.php:18-27`.

Pelanggan **tidak punya dompet**. Saldo hanya ada di `driver_profiles.balance` dan `stores.balance`.

## 2. Jenis layanan dan tarif

| Slug | Nama | Kendaraan | Seeder: dasar / per km / km gratis | Bisa ditumpuk |
|---|---|---|---|---|
| `food` | Pesan Makanan | motor | 5.000 / 2.000 / 2 | Ya |
| `ojek` | Ojek | motor | 8.000 / 2.500 / 2 | Tidak |
| `car` | Mobil | mobil | 15.000 / 5.000 / 3 | Tidak |
| `delivery` | Kirim Paket | motor | 10.000 / 2.500 / 2 | Ya |
| `nitah` | (tujuan berupa teks) | — | — | BELUM TERVERIFIKASI |

Bukti: `BE/database/seeders/ServiceSeeder.php:14-17`; `BE/app/Models/Service.php:38`; `BE/app/Services/OrderService.php:37`. **Angka seeder adalah data demo, bukan tarif produksi.**

### Rumus ongkir (`BE/app/Services/PricingService.php`)
- Jarak dihitung dari rute OSRM. Bila gagal, dipakai haversine × 1,35 (`:95-113`).
- `ongkir = base` bila jarak ≤ km gratis. Selain itu `base + ceil(jarak − km gratis) × per_km`, dibulatkan ke atas ke ribuan (`:120-136`).
- Batas jarak 50 km (`:23-28`).
- Harga dari aplikasi tidak dipercaya; server selalu menghitung ulang (`:9`; `OrderService.php:80`).

### Komponen harga (`BE/app/Services/OrderService.php:136-223`)
| Komponen | Default kode | Aktif secara default? |
|---|---|---|
| Biaya layanan (`platform_fee`) | flat Rp2.000 atau % | Tidak (`AppSetting.php:91-94`) |
| Bagi hasil toko (`merchant_fee`) | 10% subtotal | Tidak (`PricingService.php:54-65`) |
| Biaya jasa beli / talangan | Rp2.000; maks talangan Rp150.000; pelanggan baru tunai maks Rp50.000 | sesuai pengaturan (`PricingService.php:18-20`) |
| Biaya tambahan | jam sibuk +2.000 (11–13, 17–19), malam +3.000 (22–05), hujan +3.000; maks 6.000; **100% untuk driver** | Tidak (`BE/app/Support/OpsRules.php:37-47`; `SurchargeService.php:11-72`) |
| Kupon Mihape / voucher toko | percent/fixed; target ongkir/subtotal/total | — (`Coupon.php`) |

`total = subtotal + ongkir + biaya layanan + biaya talangan + biaya tambahan − diskon` (`OrderService.php:217-223`).

## 3. Siklus pesanan

### Status
`waiting_store` → `pending` → `accepted` → `on_progress` → `completed` | `cancelled`. Kolom `cancelled_by` berisi `user | store | driver | system | admin` (`BE/database/migrations/2026_10_08_000001_add_self_managed_store_flow.php:27,33`).

| Status | Pelanggan | Driver | Toko |
|---|---|---|---|
| `waiting_store` | Menunggu Toko | Menunggu Toko | Menunggu Konfirmasi |
| `pending` | Mencari Driver | Mencari Driver (tawaran) | Menawarkan ke Driver |
| `accepted` | Driver Menuju | Driver Menuju | Driver Menuju Toko |
| `on_progress` | Diantar | Diantar | Diantar Kurir |
| `completed` | Selesai | Selesai | Selesai |
| `cancelled` | Dibatalkan | Dibatalkan | Dibatalkan |

Label: `CU/lib/orderStatus.ts:5-12`; `MI/lib/driver/orderStatus.ts:5-12`; `MI/lib/merchant/orderActions.ts:61-68`.

### Alur A: Ojek / Mobil / Kirim Paket / Makanan dari toko kelolaan
1. Pelanggan memesan (`POST /orders` atau `/food-orders`). Status menjadi `pending` dan sistem memilih kandidat driver.
2. Ada **masa tenggang 10 detik** untuk membatalkan. Setelah itu `PUT /orders/{id}/confirm` menetapkan driver dan status menjadi `accepted`. Bila aplikasi tertutup, scheduler `orders:auto-confirm-grace` yang melakukannya (`OrderService.php:24,402-434,821-840`; `BE/routes/console.php:54-57`).
3. Driver menekan "Mulai Perjalanan" (`process`/`pickup`). Status menjadi `on_progress`, lalu dibuat token QR dan PIN 4 digit. Untuk talangan, foto nota wajib (`OrderService.php:739-776`).
4. Pelanggan scan QR atau mengetik PIN (`POST /orders/complete-by-token`). Status menjadi `completed` (`:785-815`).
5. Bila tidak ada driver dalam 5 menit, pesanan dibatalkan sistem (`:846-883`).

### Alur B: Toko mandiri
1. Pesanan masuk sebagai `waiting_store` (kecuali auto-accept + tunai). Toko di-dering lewat FCM dan realtime (`OrderService.php:165-167`; `BE/app/Observers/OrderObserver.php:18-19`).
2. Toko punya **5 menit** untuk merespons. Bila lewat, pesanan dibatalkan sistem dan toko kena sanksi (`Order.php:46`; `OrderService.php:692-725`).
3. Toko menerima, status menjadi `pending`, lalu pesanan ditawarkan ke driver terdekat **satu per satu, 60 detik per tawaran**. Setelah 3 penolakan, atau 5 menit tanpa driver, pesanan dibatalkan (`Order.php:49-53`; `DriverAssignmentService.php:102-138`).
4. Driver menerima → `accepted`. Toko menekan "Makanan siap", lalu "Serahkan ke kurir" → `on_progress` (`OrderService.php:626-659`).
5. Pelanggan scan → `completed`.

### Matching driver (`BE/app/Services/DriverAssignmentService.php:241-381`)
- Syarat: kendaraan cocok, online, terverifikasi, aktif, saldo cukup untuk setoran tunai, tidak memegang tawaran lain, tidak disuspensi.
- Urutan: **terdekat** dari titik jemput (±30 km, lokasi segar ≤15 menit), lalu round-robin. Rating <3,5 dengan ≥20 ulasan diletakkan paling akhir.
- **Stacking**: khusus makanan/paket, titik jemput ≤3 km, maks 2 pesanan aktif (default). Penumpang tidak pernah ditumpuk.
- Bukan broadcast massal: hanya satu kandidat per tawaran.

### Pembatalan dan sanksi (`BE/app/Support/OpsRules.php:15-26`; `BE/app/Services/SanctionService.php`)
- Pelanggan: 3 kali batal setelah driver menerima dalam 7 hari → tunai dinonaktifkan 7 hari. 5 kali → blokir pemesanan 24 jam.
- Driver: 3 tawaran terlewat beruntun → otomatis offline. Batal 2 kali dalam 24 jam → suspensi 2 jam. 5 kali dalam 7 hari → suspensi 24 jam.
- Toko: 3 pesanan tidak direspons dalam sehari → toko ditutup otomatis.

## 4. Pembayaran dan uang

- Metode: **`cash`** dan **`midtrans`** saja (`BE/app/Http/Requests/CreateOrderRequest.php:25`). `payment_status` berisi `pending | paid | failed | refunded`.
- Midtrans Snap dipanggil lewat HTTP langsung (`BE/app/Services/MidtransService.php:54-59`). Prefix order ID: `ORDER-`, `TOPUP-DRV-`, `PROMO-`.
- Webhook `POST /api/webhooks/midtrans` dengan signature SHA512 (`BE/app/Http/Controllers/Api/MidtransWebhookController.php:25-80`).
- Kanal (VA/e-wallet/QRIS) mengikuti dashboard Midtrans, jadi **BELUM TERVERIFIKASI**.

### Pembagian uang (`BE/app/Services/WalletSettlementService.php`; `BE/app/Models/Order.php:254-333`)
| Kasus | Toko | Driver | Platform |
|---|---|---|---|
| Tunai | Hak toko (subtotal − diskon toko − bagi hasil) dikredit ke Saldo Toko | Memegang uang tunai; ongkir + surcharge miliknya; sisanya **dipotong dari saldo deposit** | biaya layanan + bagi hasil + margin talangan − subsidi kupon |
| Non-tunai | sama | Dikredit ongkir + surcharge (+ talangan) | sama; diskon ongkir ditanggung platform |

- Top-up driver Rp10.000–Rp5.000.000 via Midtrans (`BE/app/Http/Controllers/Api/WalletController.php:62-65`).
- Penarikan driver/toko: minimal Rp20.000 di server, disetujui admin dengan bukti transfer (`BE/app/Services/WalletService.php:17-19,193-340`). Klien Mitra menampilkan minimal Rp10.000 (`MI/app/driver/(tabs)/index.tsx:214-245`), jadi ada selisih.
- Refund pelanggan dilakukan manual lewat tiket (diajukan → diverifikasi → disetujui → ditransfer) (`BE/app/Models/OrderTicket.php:22-33`).

## 5. Fitur pendukung (logika server)
- **Referral**: kode 6 karakter. Teman mendapat kupon Rp10.000 (min order 25.000, berlaku 14 hari). Pengajak mendapat Rp10.000 setelah pesanan pertama teman ≥Rp20.000 dalam 30 hari. Maks 10 hadiah per bulan, dengan deteksi akun ganda (`BE/app/Services/ReferralService.php:28-40,164-249`).
- **Tiket**: 10 kategori (pesanan salah, makanan rusak, driver tidak datang, tarif tidak sesuai, dll.). Penyelesaian berupa refund, kupon kompensasi (maks Rp50.000), atau teguran mitra (`BE/app/Services/TicketService.php:34-50`).
- **Feed**: pelanggan maks 10 foto. Toko boleh foto atau 1 video (≤60 detik, ≤50 MB) dengan ≤6 produk tertaut, maks 5 posting toko per hari. Pelanggan dibatasi 5 posting per jam dan 15 per hari. Postingan dengan 3 laporan disembunyikan otomatis. Promosi toko gratis selama kuota, lalu berbayar (`BE/app/Services/FeedGuard.php:27-40`; `BE/app/Services/PromoBillingService.php:31-40`).
- **Chat pesanan** ditutup 30 menit setelah pesanan selesai atau batal (`BE/app/Services/OrderChatService.php:24`). Rating bisa diberikan sampai 7 hari (`Order.php:33`).
- **Ranking toko**: toko buka didahulukan, lalu diurutkan dengan rating bayesian (`BE/app/Models/Store.php:219`).

## 6. Realtime dan push
| Channel (privat) | Pihak | Event |
|---|---|---|
| `order.{id}` | pelanggan, driver, toko | `.order.updated`, `.driver.location` |
| `order.{id}.chat.{driver\|store}` | pihak chat | `.chat.message`, `.chat.read` |
| `driver.{userId}` | driver | `.offer.created`, `.offer.withdrawn`, `.status.changed` |
| `store.{storeId}` | toko | `.order.incoming`, `.order.updated`, `.store.status` |

Bukti: `BE/routes/channels.php:16-55`; `BE/app/Services/RealtimeService.php:62-205`. Bila Reverb tidak aktif, semua aplikasi memakai polling. FCM dikirim untuk setiap perubahan status (`BE/app/Services/FcmService.php:42-132`).

## 7. Job terjadwal (`BE/routes/console.php`)
`orders:expire-store-pending`, `orders:auto-confirm-grace`, `orders:cancel-unassigned` (tiap menit), `orders:report-stuck` (per jam), `finance:daily-snapshot` (00:05 WIB), `push:send-scheduled`, `privacy:retention-prune` (03:00), `sanctum:prune-expired`.

## 8. Endpoint API (prefix `/api`)

### Publik
`POST /register`, `POST /login`, `POST /password/forgot|reset`, `POST /partner/register`, `GET /email/verify/{id}/{hash}`, `GET /app-config`, `GET /home`, `GET /stores`, `/stores/{id}`, `/stores/{id}/foods`, `/stores/{id}/reviews`, `GET /foods`, `/foods/{id}`, `GET /services`, `GET /search`, `POST /webhooks/midtrans` (`BE/routes/api.php:34-65`).

### Semua pengguna login
`/logout`, `/email/resend`, `/partner/resubmit`, `/referral` (+`/apply`), `/profile` (+`/update`, `/fcm-token`), `/account/*` (change-password, login-history, devices, delete-request, data-export, standing), `/transactions`, `/notifications` (+read, read-all), `/delivery-fee`, `/geo/route|search|reverse`, `/posts/*` (list, saved, my, show, create, delete, pay, payment/refresh, like, save, report, comments), `/users/{id}`, `/users/{id}/posts`, `/users/{id}/block`, `/users/blocked`, `/broadcasting/auth` (`BE/routes/api.php:69-256`).

### Pelanggan
`/addresses` (CRUD + default), `POST /orders`, `POST /food-orders`, `GET /orders` (+counts, `{id}`, `{id}/driver-location`), `PUT /orders/{id}/cancel|confirm`, `POST /orders/complete-by-token`, `POST /orders/{id}/rating`, tiket (`/orders/{id}/ticket-options`, `/orders/{id}/tickets`, `/tickets/*`), chat `/orders/{id}/chat/{thread}` (+read), `GET /coupons`, `POST /coupons/validate` (`BE/routes/api.php:106-148`).

### Driver (`/driver`)
`GET /orders`, `GET /stats`, `POST /toggle-active`, `GET /route-plan`, `POST /location`, `PUT /orders/{id}/accept|reject|pickup|process`, `POST /orders/{id}/process` (nota), `GET /wallet`, `GET /ratings`, `POST /wallet/topup`, `POST /wallet/withdraw` (`BE/routes/api.php:151-168`).

### Merchant (`/merchant`)
`GET /stats`, `GET|POST /store`, `POST /store/toggle-open`, `PUT /store/settings`, `GET /promo`, `GET /wallet`, `GET /reviews`, `POST /wallet/withdraw`, `/foods` (CRUD + toggle), `GET /orders`, `/orders/{id}`, `PUT /orders/{id}/accept|reject|ready|handover`, `/vouchers` (CRUD + toggle) (`BE/routes/api.php:171-201`).

### Admin via API
Toko kelolaan, home sections, withdrawals approve/reject (`BE/routes/api.php:213-277`).

### Web
`/`, `/tentang`, `/bantuan`, `/syarat-ketentuan`, `/kebijakan-privasi`, `/hapus-akun`, `/pembayaran/selesai/{pesanan|topup|promosi}/{id?}`, `/post/{id}`, `/admin/*`, `/up` (`BE/routes/web.php`).

Pemakaian endpoint per layar aplikasi tercatat di [CUSTOMER_APP_FLOW](CUSTOMER_APP_FLOW.md) dan [MITRA_APP_FLOW](MITRA_APP_FLOW.md).

## 9. Integrasi pihak ketiga
| Integrasi | Fungsi | Status konfigurasi lokal |
|---|---|---|
| Midtrans Snap | pembayaran, top-up, promosi | kunci kosong di `.env` lokal; bisa diisi lewat admin. BELUM TERVERIFIKASI |
| Firebase Cloud Messaging (HTTP v1) | push | kunci terisi (nama saja yang dibaca) |
| Laravel Reverb | realtime | `REVERB_APP_KEY` kosong secara lokal. BELUM TERVERIFIKASI |
| OSRM + Nominatim (self-host) | rute, jarak, geocoding | URL terisi |
| CARTO tiles | peta di aplikasi | default di `CU/lib/geo.ts:23-25` |

Nilai `.env` tidak dibaca dan tidak disalin. Yang dicatat hanya nama kunci dan status terisi/kosong.
