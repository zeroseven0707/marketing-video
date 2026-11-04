# Konsep Kreatif: Mihape Launch Ad

## Ringkas
| Isian | Keputusan |
|---|---|
| Tujuan | Memperkenalkan Mihape kepada warga di wilayah sasaran sebagai aplikasi yang menghubungkan kebutuhan sehari-hari dengan warung dan driver lokal |
| Penonton | Warga, pemilik warung/UMKM, dan calon driver di Puspahiang, Warung Peteuy, Salawu (Kab. Tasikmalaya). Lihat [LOCAL_MARKET_CONTEXT](LOCAL_MARKET_CONTEXT.md) |
| Platform | TikTok, Instagram Reels, YouTube Shorts. 1080×1920, 30 fps, H.264 |
| Durasi | 60 detik, 11 scene |
| Pesan utama | "Mihape hadir untuk menghubungkan kebutuhan masyarakat dengan layanan dan usaha lokal." |
| Ajakan | "Unduh Mihape" dan "Mau jadi mitra? Daftar di Mihape Mitra" · mihape.biz.id |
| Nada | Dekat, membumi, modern. Bahasa Indonesia santai dengan sapaan "kamu" |

## Gagasan besar: "Semuanya dekat."
Di kampung, rumah, warung, dan jalan sebenarnya dekat, tetapi urusan sehari-hari tetap menyita waktu. Mihape menyambungkan ketiganya: warga memesan, warung lokal menerima, driver lokal mengantar. Uang dan layanan berputar di sekitar warga sendiri.

## Struktur tiga babak
1. **Dunia warga** (S01–S02): pagi di kampung, lalu tiga kebutuhan sehari-hari.
2. **Mihape bekerja** (S03–S09): merek, beranda, pesan makanan, warung menerima, driver mengantar, lacak, selesai dengan scan QR. Alurnya mengikuti alur Flow B di kode, yaitu pesanan dari toko mandiri ([API_AND_BUSINESS_LOGIC](API_AND_BUSINESS_LOGIC.md)).
3. **Ekosistem & ajakan** (S10–S11): lingkaran warga, warung, dan driver, lalu logo dan CTA.

## Bahasa visual
- **Dua lapisan.** Lapisan dunia nyata berupa ilustrasi kampung yang hangat: sawah terasering, bukit berlapis, rumah genteng, pohon kelapa, dan jalan desa. Lapisan ini bisa diganti footage asli. Lapisan teknologi memakai putih dan pink merek.
- **Motif dari logo.** Tiga garis kecepatan huruf "M" dipakai untuk transisi speed-wipe, dan pin lokasi dari titik huruf "i" dipakai untuk transisi pin-iris.
- **Tipografi.** Plus Jakarta Sans 600–800, kinetik kata demi kata dan huruf demi huruf, dengan gradien merek untuk kata kunci.
- **UI.** Layar aplikasi direkonstruksi dari source code, termasuk label, warna, dan tata letak. Setiap scene UI diberi label "Ilustrasi tampilan aplikasi · data contoh".
- **Gerak.** Satu keluarga easing `cubic-bezier(.22,1,.36,1)`, sama dengan landing. Kamera virtual dengan parallax, HP berotasi 3D, dan ketukan jari dengan riak.

## Yang sengaja dihindari
- Visual kota besar, klaim "termurah/tercepat/nomor satu/seluruh Tasikmalaya", angka pengguna, angka tarif sebagai janji, badge App Store/Play Store (status listing belum terverifikasi), logo pihak ketiga, suara AI.
- Nama lokasi pada visual: ilustrasi bersifat generik. Nama wilayah hanya muncul sebagai sasaran di end card dan bisa dimatikan (`copy.S11.region = null`).
- Angka pendapatan driver disamarkan (`Rp ••••••`) agar tidak menjadi klaim penghasilan.
