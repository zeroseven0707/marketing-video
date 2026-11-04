# Kebutuhan Aset

Status per 4 November 2026. Versi video saat ini **sudah lengkap tanpa aset tambahan**: dunia lokal berupa ilustrasi, UI direkonstruksi dari kode, dan audio dibuat sintetis. Tabel di bawah adalah aset yang akan menaikkan kualitas dan keaslian bila disediakan, serta slot tempat aset itu dipasang.

| Aset | Status | Slot / cara pasang | Catatan |
|---|---|---|---|
| Screenshot asli aplikasi (9 layar) | Belum ada | Taruh PNG di `captures/`, isi `src/config/media.ts` → `captures` | Kunci: `customerHome`, `customerStore`, `customerCheckout`, `merchantIncoming`, `driverDashboard`, `driverOffer`, `customerTracking`, `driverQr`, `customerScan`. Rasio ±9:19,5. Pakai akun demo dan lokasi di wilayah sasaran, bukan data seeder Jakarta |
| Footage lokal | Belum ada | Taruh MP4 di `assets/footage/`, isi `src/config/media.ts` → `footage` | Slot: S01 (pembuka), S02, S06 (warung), S07 (driver), S10. Daftar shot F1–F13 di [LOCAL_MARKET_CONTEXT §6](LOCAL_MARKET_CONTEXT.md). Wajib izin tampil & izin lokasi |
| Voice-over (suara manusia) | Belum ada | `assets/audio/voiceover/`, isi `src/config/audio.ts` → `voiceover` | Naskah di [VIDEO_SCRIPT](VIDEO_SCRIPT.md). Musik otomatis diredam (ducking) saat VO aktif |
| Musik berlisensi | Opsional | `assets/audio/music/`, ganti `audioConfig.music.src` | Musik bawaan orisinal sintetis, aman dipakai |
| Logo SVG wordmark | Tidak ada | — | PNG 1280 px cukup untuk 1080×1920 |
| Badge Google Play | Ditunda | — | Tunggu konfirmasi listing live |
| Konfirmasi wilayah | Menunggu pemilik produk | `copy.S11.region` (null = sembunyikan) | Lihat [LOCAL_MARKET_CONTEXT §7](LOCAL_MARKET_CONTEXT.md) |
