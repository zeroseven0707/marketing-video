// Semua teks di layar. Teks bertanda [ASLI] dikutip dari aplikasi/landing (lihat docs/VIDEO_SCRIPT.md
// untuk referensi file:baris). Teks lain adalah copy iklan yang tidak mengklaim fitur baru.

export const copy = {
  S01: {
    kicker: 'Super App Lokal',
    line1: 'Super App',
    line2: 'Puspahiang · Warung Peteuy · Salawu',
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
    tagline: 'Mudah, Cepat, Nyaman', // [ASLI] SplashScreen.tsx:12
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
    sub: 'Bayar tunai atau non-tunai.',
  },
  S10: {
    headline: ['Menghubungkan', 'kebutuhan warga', 'dengan usaha lokal.'],
    nodes: {customer: 'Warga', merchant: 'Warung & UMKM', driver: 'Driver lokal'},
  },
  S11: {
    tagline: 'Mudah, Cepat, Nyaman',
    ctaCustomer: 'Unduh Mihape',
    ctaMitra: 'Mau jadi mitra? Daftar di Mihape Mitra',
    url: 'mihape.biz.id', // domain di mihp-customer/lib/links.ts
    // Wilayah sasaran dari pemilik produk (docs/LOCAL_MARKET_CONTEXT.md). Set null untuk menyembunyikan.
    region: 'Untuk warga Puspahiang · Warung Peteuy · Salawu' as string | null,
  },
  // Label jujur di atas UI yang direkonstruksi dari source code.
  simTag: 'Ilustrasi tampilan aplikasi · data contoh',
} as const;
