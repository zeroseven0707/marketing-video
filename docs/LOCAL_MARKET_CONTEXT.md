# Konteks Pasar Lokal dan Arah Kreatif

Sumber konteks pasar adalah arahan pemilik produk (4 November 2026), bukan source code. Hasil pengecekan kode ada di §2. Referensi: `BE/` = `mihp-backend/`, `CU/` = `mihp-customer/`, `MI/` = `mihape-mitra/`.

---

## 1. Arahan pemilik produk (dicatat apa adanya)

**Target pasar utama:** Puspahiang, Warung Peteuy, Salawu, Kabupaten Tasikmalaya, Jawa Barat. Pendekatan metropolitan tidak dipakai.

**Target audiens:**
1. Masyarakat lokal yang butuh transportasi dan layanan sehari-hari.
2. Customer yang ingin memesan makanan atau memakai layanan Mihape.
3. Pemilik warung dan merchant lokal.
4. Driver lokal yang ingin menjadi mitra.

**Pesan utama:** "Mihape hadir untuk menghubungkan kebutuhan masyarakat dengan layanan dan usaha lokal."

**Nilai yang ditonjolkan:** kedekatan, kemudahan, dan ekosistem ekonomi lokal.

**Gaya:** cinematic commercial, local storytelling, motion graphic teknologi modern, dan suasana pedesaan atau kota kecil Indonesia yang autentik. Hasilnya harus terasa dekat, membumi, modern, dan membangun kepercayaan.

## 2. Hasil pengecekan kode terhadap wilayah

| Pertanyaan | Hasil | Bukti |
|---|---|---|
| Apakah kode menyebut Tasikmalaya, Puspahiang, Warung Peteuy, Salawu, atau Jawa Barat? | **Tidak.** Satu-satunya kecocokan "barat" ada di kata "mengimplementasikan" | `grep -rni "tasik\|puspahiang\|salawu\|peteuy\|jawa barat"` di ketiga repo |
| Apakah ada batas wilayah layanan (geofence)? | **Tidak.** Pembatasnya hanya jarak: rute maksimal 50 km, pencarian driver ±30 km | [API_AND_BUSINESS_LOGIC](API_AND_BUSINESS_LOGIC.md) (§tarif, §matching) |
| Titik awal peta di aplikasi | **Jakarta** (−6,2297; 106,8295) | `CU/components/LeafletMap.tsx:41-42`; `MI/components/driver/LeafletMap.tsx:42`; `CU/app/service/[id].tsx:600` (−6,2) |
| Lokasi data seeder toko dan user | **Jakarta** (−6,15 s.d. −6,29; 106,78 s.d. 106,85) | `BE/database/seeders/StoreSeeder.php:23-204`; `UserSeeder.php:34,44` |
| Geocoder | Dibatasi ke negara `id` (Indonesia), bukan ke kabupaten | `BE/config/services.php:59-66`; `BE/app/Services/GeocodingService.php:25` |

Kesimpulan:
- Wilayah layanan Tasikmalaya **BELUM TERVERIFIKASI** di kode. Statusnya keputusan bisnis yang disampaikan pemilik produk.
- Kode tidak membatasi wilayah. Jangkauan nyata ditentukan oleh lokasi driver dan toko yang aktif di server, dan data itu tidak bisa diakses dari repo.
- Bila layar aplikasi direkam dengan data seeder atau lokasi bawaan, peta akan menampilkan **jalan-jalan Jakarta**. Ini bertentangan dengan arahan. Lihat §5.

## 3. Klaim untuk iklan

**Boleh:**
- "Hadir untuk warga [wilayah]". Nama wilayah ditulis hanya setelah pemilik produk mengonfirmasi teksnya.
- Pesan utama di §1.
- Fitur dengan status "Ya" di [AVAILABLE_FEATURES](AVAILABLE_FEATURES.md).
- "Platform lokal" dan "memberdayakan mitra driver dan UMKM". Sumbernya visi di `BE/resources/views/pages/about.blade.php:26`.

**Jangan, kecuali ada bukti:**
- "Sudah tersedia di seluruh Tasikmalaya" atau klaim cakupan sejenis.
- "Paling murah", "nomor satu", "paling cepat", "terbaik".
- Jumlah driver, toko, pengguna, atau pesanan.
- Waktu tiba spesifik sebagai janji, misalnya "4 menit". Angka di mockup landing (`BE/resources/views/welcome.blade.php:66,151`) adalah contoh.
- Klaim lain di [AVAILABLE_FEATURES §6](AVAILABLE_FEATURES.md).

Catatan: visi di halaman Tentang memuat kata "terbaik" ("Menjadi platform lokal terbaik…"). Itu cita-cita perusahaan, bukan fakta, jadi jangan diangkat sebagai klaim di iklan.

## 4. Arah kreatif yang disesuaikan

Pemisahan dua lapisan menjaga merek tetap terang (lihat [BRAND_GUIDELINES](BRAND_GUIDELINES.md)) tanpa membuat iklan terasa seperti iklan kota besar.

| Lapisan | Isi | Gaya |
|---|---|---|
| **Dunia nyata** (footage) | Jalan desa, permukiman, warung, sawah, perbukitan, driver motor, interaksi warga | Cahaya alami pagi atau sore, warna hangat, kamera stabil, gerak pelan. Tanpa color grade dingin atau bergaya kota |
| **Lapisan teknologi** (motion graphic) | UI aplikasi, pin lokasi, garis rute, kartu status, logo | Putih dan pink merek, Plus Jakarta Sans, gerak bersih. Muncul di atas footage sebagai penghubung |

Prinsip penceritaan:
- **Orang dulu, aplikasi kemudian.** Tiap babak dibuka dengan kebutuhan warga yang nyata, misalnya ibu yang tidak sempat masak, warga yang perlu ke pasar, atau warung yang ingin pembeli baru. Setelah itu baru aplikasi menjawabnya.
- **Ekosistem sebagai lingkaran.** Customer memesan, warung lokal menerima, driver lokal mengantar, dan uang berputar di sekitar mereka. Visualnya pin lokasi yang terhubung garis rute pink antar-titik: rumah, warung, rumah.
- **Wajah lokal.** Gunakan pemeran warga setempat, bukan model bergaya kota. Pakaian sehari-hari dan motor yang lazim dipakai warga.
- **Bahasa.** Bahasa Indonesia santai dengan sapaan "kamu", sesuai nada merek. Sisipan bahasa Sunda ringan bisa memperkuat kedekatan, tetapi **butuh persetujuan pemilik produk**. Kode tidak memuat copy berbahasa Sunda.
- **Kepercayaan.** Tonjolkan fitur yang membangun rasa aman dan ada di kode: driver terlacak dengan plat nomor, rincian harga sebelum pesan, selesai dengan scan QR atau PIN, bisa bayar tunai, chat dengan driver, dan rating.

Hindari:
- Gedung tinggi, kemacetan kota, kafe urban, atau jalan tol.
- Footage stok luar negeri yang terlihat asing, misalnya pemandangan pedesaan non-Indonesia.
- Menyebut footage sebagai Puspahiang, Warung Peteuy, atau Salawu bila asal lokasinya belum terverifikasi.

## 5. Visual peta dan layar aplikasi

Masalah: peta bawaan aplikasi berpusat di Jakarta (§2).

Pilihan:
1. **Rekam layar dengan akun dan data uji yang berlokasi di wilayah target.** Peta akan menampilkan jalan lokal yang nyata dari tile CARTO/OSM. Pemilik produk perlu menyiapkan akun uji, toko uji, dan driver uji di wilayah tersebut. Nama toko yang tampil harus nyata dan sudah memberi izin, atau jelas fiktif dan ditandai simulasi.
2. **Peta motion graphic bergaya abstrak.** Jalan, sawah, dan pin digambar sederhana tanpa nama tempat. Pendekatan ini aman dari kesalahan lokasi.
3. **Jangan** merekam layar dengan data seeder Jakarta.

Rekomendasi: pilihan 2 untuk adegan peta di iklan, dan pilihan 1 hanya bila data uji lokal sudah siap.

## 6. Daftar kebutuhan footage lokal

Belum ada footage di repo ([ASSET_INVENTORY §8](ASSET_INVENTORY.md)). Daftar ini perlu direkam. Setiap file diberi label lokasi asli saat direkam supaya klaim lokasi bisa dibuktikan.

| # | Shot | Isi | Catatan |
|---|---|---|---|
| F1 | Establishing | Jalan desa pagi hari, sawah atau perbukitan di latar | Drone bila diizinkan. Bila tidak, gunakan tripod di tempat tinggi |
| F2 | Permukiman | Deretan rumah, teras, anak sekolah, aktivitas warga | Minta izin warga yang terlihat jelas |
| F3 | Kebutuhan customer | Warga di teras membuka HP, misalnya ibu rumah tangga atau pekerja pulang | Close-up tangan dan HP untuk ditimpa UI |
| F4 | Warung lokal | Pemilik warung memasak dan menyajikan makanan, suasana dapur | Butuh izin pemilik warung dan izin pemakaian nama warung |
| F5 | Pesanan masuk di warung | Pemilik warung melihat HP, tersenyum, lalu mengemas pesanan | Untuk momen "Pesanan Baru!" dengan suara `order_ring.wav` |
| F6 | Driver bersiap | Driver memakai helm dan menyalakan motor di depan rumah | Helm wajib terlihat. Atribut bermerek Mihape **BELUM TERVERIFIKASI** ada atau tidaknya |
| F7 | Perjalanan | Motor melaju di jalan desa, menikung, melewati sawah | Kamera follow dari motor lain atau samping jalan. Patuhi keselamatan dan aturan lalu lintas |
| F8 | Serah terima | Driver tiba, customer menerima, lalu scan QR di HP driver | Momen kunci "Selesai dengan scan QR" |
| F9 | Ojek | Warga dibonceng menuju pasar, sekolah, atau tempat kerja | Penumpang juga memakai helm |
| F10 | Kirim paket | Warga menyerahkan paket kecil ke driver | |
| F11 | Interaksi | Customer, pemilik warung, dan driver saling menyapa dan tertawa | Penutup bertema "ekosistem lokal" |
| F12 | Driver menghitung hasil | Driver melihat HP di warung kopi atau rumah, raut puas | Untuk segmen mitra. Angka pendapatan di layar harus kosong atau ditandai simulasi |
| F13 | Detail tekstur | Uap makanan, tangan mengemas, roda motor, jalan basah, daun padi | B-roll untuk transisi |

Kebutuhan pendukung:
- Formulir izin tampil (model release) untuk setiap orang yang wajahnya jelas.
- Izin lokasi untuk warung dan rumah.
- Rekaman suara ambien lokal (jalan desa, dapur warung, motor) untuk lapisan audio.
- Bila footage asli belum ada, pakai footage stok generik pedesaan Indonesia yang berlisensi, tanpa menyebut nama lokasi.

## 7. Perlu dikonfirmasi pemilik produk

1. Apakah Mihape sudah beroperasi di Puspahiang, Warung Peteuy, dan Salawu? Sejak kapan, dan apakah nama wilayah boleh disebut di iklan?
2. Apakah ada mitra driver dan warung nyata yang bersedia tampil, beserta izin nama dan wajah?
3. Apakah sisipan bahasa Sunda diizinkan?
4. Apakah ada atribut driver bermerek, seperti jaket atau helm?
5. Apakah footage asli akan direkam, atau iklan versi pertama memakai motion graphic dan footage stok generik?
6. Kanal tayang dan durasi (misalnya Reels/TikTok 30 detik, YouTube, atau layar di acara desa).
