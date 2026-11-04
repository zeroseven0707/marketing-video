// Slot aset yang bisa diganti tanpa menyentuh kode scene.
// Path relatif terhadap public/ (diisi otomatis dari assets/ dan captures/ oleh `npm run sync`).

// Footage asli per scene. null = pakai ilustrasi bawaan.
// Contoh: S01Opening: 'assets/footage/sawah-pagi.mp4'. Jangan menulis nama lokasi di layar
// bila asal footage belum terverifikasi.
export const footage: Record<string, string | null> = {
  S01Opening: null,
  S02Needs: null,
  S06Merchant: null,
  S07Driver: null,
  S10Ecosystem: null,
};

// Screenshot asli aplikasi (PNG, 1290x2796 atau rasio 9:19,5 lainnya). null = UI rekonstruksi dari source code.
// Contoh: customerHome: 'captures/customer-home.png'
export const captures: Record<string, string | null> = {
  customerHome: null,
  customerStore: null,
  customerCheckout: null,
  merchantIncoming: null,
  driverDashboard: null,
  driverOffer: null,
  customerTracking: null,
  driverQr: null,
  customerScan: null,
};

export const brandFiles = {
  wordmark: 'assets/brand/mihape-wordmark-640-clean.png', // transparan bersih
  wordmarkLarge: 'assets/brand/mihape-wordmark-1280.png',
  mitraWordmark: 'assets/brand/mihape-mitra-wordmark.png',
  appIcon: 'assets/brand/mihape-app-icon.png',
  mitraIcon: 'assets/brand/mitra-app-icon.png',
  symbolWhite: 'assets/brand/mihape-symbol-white.png',
} as const;
