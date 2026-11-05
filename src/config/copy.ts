// Semua teks di layar. Teks bertanda [ASLI] dikutip dari aplikasi/landing (lihat docs/VIDEO_SCRIPT.md
// untuk referensi file:baris). Teks lain adalah copy iklan yang tidak mengklaim fitur baru.

export const copy = {
  // Pembuka launching: karya anak daerah (arahan pemilik produk)
  S01: {
    kicker: 'Karya anak daerah',
    lines: ['Dari daerah,', 'untuk daerah.'],
    region: 'Puspahiang · Warung Peteuy · Salawu',
    launch: ['Kini hadir', 'untuk kampung kita.'],
  },
  S02: {
    headline: 'Tapi urusan tetap banyak.',
    needs: [
      {title: 'Lapar,', sub: 'belum sempat masak.'},
      {title: 'Perlu ke pasar,', sub: 'jalan masih jauh.'},
      {title: 'Kirim titipan', sub: 'ke saudara.'},
    ],
  },
  S03: {
    tagline: 'Gampil, Gancang, Merenah', // slogan resmi dari pemilik produk (Sunda: mudah, cepat, nyaman)
    sub: 'Semua kebutuhan harianmu, cukup satu ketukan.', // [ASLI] welcome.blade.php:21
  },
  S04: {
    headline: ['Satu aplikasi,', 'banyak urusan beres.'], // [ASLI] welcome.blade.php (Layanan)
    services: ['Pesan Makanan', 'Ojek', 'Mobil', 'Kirim Paket'], // [ASLI] ServiceSeeder.php:14-17
  },
  S05: {
    headline: ['Pesan makanan', 'dari warung sekitar.'],
    callout: 'Rincian harga terlihat sebelum pesan',
  },
  S06: {
    kicker: 'Mihape Mitra · Toko',
    headline: ['Warung lokal', 'langsung terima pesanan.'],
  },
  S07: {
    kicker: 'Mihape Mitra · Driver',
    headline: ['Driver lokal', 'siap mengantar.'],
  },
  S08: {
    headline: ['Tahu persis di mana', 'driver-mu berada.'], // [ASLI] welcome.blade.php (Lacak)
    chips: ['Plat nomor terlihat', 'Chat dengan driver'],
  },
  S09: {
    headline: ['Selesai dengan', 'scan QR.'], // [ASLI] chip landing "Selesai dengan scan QR"
    // QR di HP driver = bukti serah terima (POST /orders/complete-by-token), bukan pembayaran/QRIS
    sub: 'Tanda pesanan sudah diterima, bukan untuk bayar.',
  },
  S10: {
    headline: ['Menghubungkan', 'kebutuhan warga', 'dengan usaha lokal.'],
    nodes: {customer: 'Warga', merchant: 'Warung & UMKM', driver: 'Driver lokal'},
  },
  S11: {
    tagline: 'Gampil, Gancang, Merenah',
    ctaCustomer: 'Unduh Mihape',
    ctaMitra: 'Mau jadi mitra? Daftar di Mihape Mitra',
    url: 'mihape.biz.id', // domain di mihp-customer/lib/links.ts
    // Wilayah sasaran dari pemilik produk (docs/LOCAL_MARKET_CONTEXT.md). Set null untuk menyembunyikan.
    region: 'Untuk warga Puspahiang · Warung Peteuy · Salawu' as string | null,
  },
  // ─── Video Pelanggan (30 dtk) ─── klaim dari docs/AVAILABLE_FEATURES.md §1 & §5
  C01: {
    lines: ['Lapar, tapi', 'malas keluar?'],
    punch: 'Pesan aja di Mihape.',
  },
  C02: {
    headline: ['Makan, ojek, mobil,', 'kirim paket. Beres.'],
    services: ['Pesan Makanan', 'Ojek', 'Mobil', 'Kirim Paket'], // [ASLI] ServiceSeeder.php:14-17
  },
  C03: {
    headline: ['Pilih menu', 'warung favoritmu.'],
    // CU/app/checkout/food.tsx:465-537 (rincian) & metode bayar cash / midtrans.
    // Kanal non-tunai (QRIS, e-wallet) dikonfirmasi pemilik produk.
    callout: ['Ongkos terlihat sebelum pesan', 'COD, bayar di tempat', 'Non-tunai: QRIS, e-wallet, dll.'],
  },
  C04: {
    headline: ['Pantau drivernya', 'langsung di peta.'],
    chips: ['Nama & plat nomor', 'Chat dengan driver'], // CU/app/order/tracking/[id].tsx:332-344
  },
  C05: {
    headline: ['Pesanan sampai?', 'Scan QR driver.'],
    // Bukti serah terima, bukan pembayaran: jangan sampai dikira QRIS
    sub: 'Bukti pesanan sudah aman di tanganmu.',
  },
  C06: {
    tagline: 'Gampil, Gancang, Merenah',
    cta: 'Unduh Mihape',
    url: 'mihape.biz.id',
  },

  // ─── Video Mitra (30 dtk) ─── satu alur: pesanan masuk ke warung -> driver terdekat -> pelanggan.
  // Klaim dari docs/AVAILABLE_FEATURES.md §2, §3 & §5
  M01: {
    storeQ: 'Punya warung?',
    driverQ: 'Punya motor?',
    punch: 'Gabung Mihape Mitra.',
  },
  M02: {
    headline: ['Pesanan masuk,', 'warung terima', 'satu ketukan.'], // MI/lib/merchant/orderActions.ts
  },
  M03: {
    headline: ['Lalu driver terdekat', 'dapat tawarannya.'], // BE/app/Services/DriverAssignmentService.php:296-319
  },
  M04: {
    headline: ['Pesanan sampai,', 'pelanggan scan QR.'], // MI/app/driver/order/[id].tsx:563-609
    sub: 'Tanda pesanan sudah diterima pelanggan.',
  },
  M05: {
    headline: ['Semua diatur', 'dari satu aplikasi.'],
    tools: [
      'Ongkos terlihat sebelum terima', // MI/components/driver/IncomingOrderWatcher.tsx:270-273
      'Pesanan terdekat diprioritaskan', // BE/app/Services/DriverAssignmentService.php:296-319
      'Atur menu & jadwal buka', // MI/app/merchant/menu/form.tsx; store-settings.tsx:88-168
      'Promosi di Feed', // MI/app/merchant/promo/create.tsx
      'Voucher toko', // MI/app/merchant/vouchers/*
      'Tarik saldo ke rekening', // MI/app/driver/(tabs)/index.tsx:183-245; MI/app/merchant/wallet.tsx
    ],
  },
  M06: {
    headline: 'Daftar langsung dari aplikasi.', // MI/app/register.tsx:143-169
    steps: ['Daftar & unggah dokumen', 'Verifikasi admin', 'Mulai terima pesanan'], // MI/app/driver/verification.tsx
    cta: 'Daftar di Mihape Mitra',
    url: 'mihape.biz.id',
    // Sama seperti S11.region: konfirmasi pemilik produk sebelum tayang, null untuk menyembunyikan.
    region: 'Puspahiang · Warung Peteuy · Salawu' as string | null,
  },

  // Label di atas UI yang direkonstruksi dari source code. Dimatikan atas permintaan pemilik produk;
  // isi lagi dengan 'Ilustrasi tampilan aplikasi · data contoh' untuk menampilkannya di semua video.
  simTag: null as string | null,
} as const;
