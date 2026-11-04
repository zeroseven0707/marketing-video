// Data contoh untuk UI simulasi. BUKAN data nyata: bukan mitra, harga, atau tarif resmi.
// Ganti dengan data akun demo yang disetujui sebelum tayang bila perlu.

export const demo = {
  store: {name: 'Warung Nasi Sunda', distance: '1,2 km', duration: '6 menit', rating: '4,8'},
  menu: [
    {name: 'Nasi Timbel Komplit', price: 25000},
    {name: 'Sayur Asem', price: 8000},
    {name: 'Es Teh Manis', price: 5000},
    {name: 'Pepes Ikan', price: 15000},
  ],
  // Item di keranjang: indeks menu + jumlah.
  cart: [
    {index: 0, qty: 2},
    {index: 2, qty: 2},
  ],
  deliveryFee: 9000,
  serviceFee: 2000,
  distanceKm: '1,2',
  durationMin: 6,
  orderCode: 'MHP-0427',
  customerName: 'Pembeli',
  address: 'Rumah',
  driver: {name: 'Kang Asep', plate: 'Z 1234 MH', vehicle: 'Motor'},
  pin: '4821',
  qrValue: 'MIHAPE-DEMO-ILUSTRASI',
};

export const rupiah = (n: number) => `Rp${new Intl.NumberFormat('id-ID').format(n)}`;

export const cartLines = demo.cart.map((c) => ({...demo.menu[c.index], qty: c.qty}));
export const foodTotal = cartLines.reduce((n, l) => n + l.price * l.qty, 0);
export const orderTotal = foodTotal + demo.deliveryFee + demo.serviceFee;
