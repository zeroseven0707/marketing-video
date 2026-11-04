// UI aplikasi Mihape (pelanggan) direkonstruksi dari source code mihp-customer.
// Hanya elemen yang ada di kode yang digambar. Rujukan file:baris ada di tiap komponen.
import React from 'react';
import {
  ArrowLeft,
  Banknote,
  Bell,
  Bike,
  Car,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock,
  CreditCard,
  Home,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Minus,
  Package,
  Phone as PhoneIcon,
  Plus,
  QrCode,
  RefreshCw,
  ScanLine,
  Search,
  ShoppingCart,
  Star,
  UserCircle2,
  Utensils,
  X,
} from 'lucide-react';
import {cartLines, demo, foodTotal, orderTotal, rupiah} from '../../config/demo';
import {brand, serviceColors} from '../../config/theme';
import {MapView, type Pt} from './MapView';
import {Card, FoodArt, PrimaryBtn, radius, Row, Screen, Txt} from './kit';
import {StoreArt} from '../world/StoreArt';

// Tab bar 5 item dengan tombol scan bulat di tengah. mihp-customer/app/(tabs)/_layout.tsx:195-300
export const TabBar: React.FC<{active?: 'home' | 'feed' | 'orders' | 'profile'; scanPressed?: number}> = ({active = 'home', scanPressed = 0}) => {
  const item = (key: string, label: string, Icon: typeof Home) => {
    const on = key === active;
    return (
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3}}>
        <div style={{width: 44, height: 28, borderRadius: 999, background: on ? brand.pinkSoft : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon size={22} color={on ? brand.pink : brand.textMuted} strokeWidth={on ? 2.2 : 1.8} />
        </div>
        <span style={{fontSize: 11, fontWeight: 600, color: on ? brand.pink : brand.textMuted}}>{label}</span>
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 84, background: '#fff', borderTop: `1px solid ${brand.border}`, display: 'flex', paddingTop: 8}}>
      {item('home', 'Beranda', Home)}
      {item('feed', 'Feed', LayoutGrid)}
      <div style={{flex: 1, display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            marginTop: -26,
            background: brand.pink,
            border: '4px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(216,27,96,0.4)',
            transform: `scale(${1 + scanPressed * 0.12})`,
          }}
        >
          <ScanLine size={24} color="#fff" strokeWidth={2.2} />
        </div>
      </div>
      {item('orders', 'Pesanan', ClipboardList)}
      {item('profile', 'Akun', UserCircle2)}
    </div>
  );
};

const SERVICES = [
  {label: 'Pesan Makanan', Icon: Utensils, c: serviceColors.food},
  {label: 'Ojek', Icon: Bike, c: serviceColors.ojek},
  {label: 'Mobil', Icon: Car, c: serviceColors.car},
  {label: 'Kirim Paket', Icon: Package, c: serviceColors.delivery},
];

// Beranda. mihp-customer/app/(tabs)/home.tsx:189-215 (layanan), :320-360 (header), :400-439 (kartu mengambang).
export const CustomerHome: React.FC<{pressedService?: number; pressT?: number; servicePop?: number[]}> = ({pressedService = -1, pressT = 0, servicePop = [1, 1, 1, 1]}) => (
  <Screen>
    <div style={{padding: '66px 20px 8px'}}>
      <Row style={{justifyContent: 'space-between'}}>
        <div>
          <Txt size={13} weight={500} color={brand.text2}>
            Selamat datang
          </Txt>
          <Txt size={24} weight={800} style={{letterSpacing: -0.6}}>
            Halo, Teman Mihape
          </Txt>
        </div>
        <div style={{width: 44, height: 44, borderRadius: radius.md, background: '#fff', border: `1px solid ${brand.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
          <Bell size={20} color={brand.ink} strokeWidth={1.9} />
          <div style={{position: 'absolute', top: 6, right: 6, minWidth: 16, height: 16, borderRadius: 8, background: brand.pink, border: '1.5px solid #fff', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>2</div>
        </div>
      </Row>
      <Row style={{gap: 6, marginTop: 10, padding: '5px 10px', background: brand.pinkSoft, borderRadius: 999, alignSelf: 'flex-start', display: 'inline-flex'}}>
        <MapPin size={13} color={brand.pink} />
        <span style={{fontSize: 12, fontWeight: 600}}>{demo.address}</span>
      </Row>
      <Row style={{gap: 10, height: 50, marginTop: 16, padding: '0 16px', background: '#fff', borderRadius: radius.md, border: `1px solid ${brand.border}`, boxShadow: '0 1px 3px rgba(42,18,32,0.05)'}}>
        <Search size={18} color={brand.textMuted} />
        <span style={{color: brand.textMuted, fontSize: 14}}>Cari layanan, toko, makanan...</span>
      </Row>
    </div>
    <div style={{padding: '16px 20px 0'}}>
      <Txt size={16} weight={700} style={{marginBottom: 12}}>
        Layanan Kami
      </Txt>
      <Card style={{display: 'flex', flexWrap: 'wrap', padding: '16px 4px'}}>
        {SERVICES.map((s, i) => {
          const pressed = i === pressedService ? pressT : 0;
          return (
            <div key={s.label} style={{width: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: servicePop[i], transform: `translateY(${(1 - servicePop[i]) * 14}px) scale(${1 - pressed * 0.08})`}}>
              <div style={{width: 54, height: 54, borderRadius: radius.lg, background: s.c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, boxShadow: pressed ? `0 0 0 ${pressed * 4}px ${s.c.color}33` : undefined}}>
                <s.Icon size={24} color={s.c.color} strokeWidth={2} />
              </div>
              <span style={{fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: '16px'}}>{s.label}</span>
            </div>
          );
        })}
      </Card>
    </div>
    <div style={{padding: '28px 20px 0'}}>
      <Row style={{justifyContent: 'space-between', marginBottom: 12}}>
        <Txt size={16} weight={700}>
          Restoran Populer
        </Txt>
        <Row style={{gap: 2}}>
          <span style={{color: brand.pink, fontSize: 13, fontWeight: 600}}>Lihat semua</span>
          <ChevronRight size={14} color={brand.pink} />
        </Row>
      </Row>
      <Row style={{gap: 12}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 156, flexShrink: 0, background: '#fff', borderRadius: radius.lg, overflow: 'hidden', border: `1px solid ${brand.border}`}}>
            <div style={{height: 96, background: brand.pinkSoft, overflow: 'hidden'}}>
              <StoreArt variant={i} w={156} h={96} />
            </div>
            <div style={{padding: 10}}>
              <Txt size={13} weight={700}>
                {i === 0 ? demo.store.name : i === 1 ? 'Warung Kopi' : 'Toko Kue'}
              </Txt>
              <Txt size={11} color={brand.textMuted} style={{marginTop: 2}}>
                Data contoh
              </Txt>
            </div>
          </div>
        ))}
      </Row>
    </div>
    <TabBar />
  </Screen>
);

// Halaman toko. mihp-customer/app/store/[id].tsx:113-280
export const StoreMenu: React.FC<{qty: number[]; addPressed?: number; cartT?: number}> = ({qty, addPressed = -1, cartT = 0}) => {
  const count = qty.reduce((a, b) => a + b, 0);
  const total = qty.reduce((n, q, i) => n + q * demo.menu[i].price, 0);
  return (
    <Screen>
      <div style={{height: 250, position: 'relative', overflow: 'hidden'}}>
        <StoreArt variant={0} w={390} h={250} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.62) 100%)'}} />
        <div style={{position: 'absolute', top: 58, left: 16, width: 40, height: 40, borderRadius: 20, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ArrowLeft size={20} color={brand.ink} />
        </div>
        <div style={{position: 'absolute', left: 20, right: 20, bottom: 16}}>
          <Row style={{gap: 6, padding: '4px 10px', borderRadius: 999, background: brand.successSoft, display: 'inline-flex'}}>
            <div style={{width: 6, height: 6, borderRadius: 3, background: brand.success}} />
            <span style={{color: brand.success, fontSize: 12, fontWeight: 700}}>Buka</span>
          </Row>
          <Txt size={24} weight={800} color="#fff" style={{marginTop: 6, letterSpacing: -0.5}}>
            {demo.store.name}
          </Txt>
          <Row style={{gap: 4, marginTop: 4}}>
            <Star size={13} color={brand.star} fill={brand.star} />
            <span style={{color: '#fff', fontSize: 12, fontWeight: 700}}>{demo.store.rating}</span>
          </Row>
          <Row style={{gap: 5, marginTop: 6, color: 'rgba(255,255,255,0.85)', fontSize: 12}}>
            <Clock size={13} color="rgba(255,255,255,0.8)" />
            <span>{demo.store.duration}</span>
            <span>·</span>
            <MapPin size={13} color="rgba(255,255,255,0.8)" />
            <span>{demo.store.distance}</span>
          </Row>
        </div>
      </div>
      <div style={{padding: '18px 20px'}}>
        <Txt size={18} weight={800} style={{marginBottom: 12}}>
          Menu Tersedia
        </Txt>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12}}>
          {demo.menu.map((m, i) => (
            <div key={m.name} style={{width: 169, background: '#fff', borderRadius: radius.lg, border: `1px solid ${brand.border}`, overflow: 'hidden'}}>
              <div style={{height: 104, background: brand.pinkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <FoodArt kind={i} size={84} />
              </div>
              <div style={{padding: '8px 10px 0'}}>
                <Txt size={13} weight={600} style={{height: 34}}>
                  {m.name}
                </Txt>
                <Txt size={13} weight={700} color={brand.pink}>
                  {rupiah(m.price)}
                </Txt>
              </div>
              <div style={{padding: 10}}>
                {qty[i] > 0 ? (
                  <Row style={{justifyContent: 'space-between'}}>
                    <div style={{width: 30, height: 30, borderRadius: 15, border: `1.5px solid ${brand.pink}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Minus size={14} color={brand.pink} strokeWidth={2.5} />
                    </div>
                    <span style={{fontWeight: 800, fontSize: 15}}>{qty[i]}</span>
                    <div style={{width: 30, height: 30, borderRadius: 15, background: brand.pink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Plus size={14} color="#fff" strokeWidth={2.5} />
                    </div>
                  </Row>
                ) : (
                  <Row style={{justifyContent: 'center', gap: 4, height: 30, borderRadius: radius.sm, border: `1.5px solid ${brand.pinkBorder}`, background: addPressed === i ? brand.pinkMuted : brand.pinkSoft}}>
                    <Plus size={14} color={brand.pink} strokeWidth={2.5} />
                    <span style={{color: brand.pink, fontWeight: 700, fontSize: 13}}>Tambah</span>
                  </Row>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {count > 0 && (
        <div style={{position: 'absolute', left: 16, right: 16, bottom: 26, transform: `translateY(${(1 - cartT) * 120}px)`}}>
          <Row style={{background: brand.ink, borderRadius: radius.lg, padding: '12px 12px 12px 16px', justifyContent: 'space-between', boxShadow: '0 10px 24px rgba(42,18,32,0.3)'}}>
            <Row style={{gap: 10}}>
              <ShoppingCart size={20} color="#fff" />
              <div>
                <Txt size={12} color="rgba(255,255,255,0.7)">
                  {count} item dipilih
                </Txt>
                <Txt size={16} weight={800} color="#fff">
                  {rupiah(total)}
                </Txt>
              </div>
            </Row>
            <div style={{background: brand.pink, color: '#fff', fontWeight: 800, fontSize: 14, padding: '10px 18px', borderRadius: radius.md}}>Checkout</div>
          </Row>
        </div>
      )}
    </Screen>
  );
};

// Konfirmasi pesanan. mihp-customer/app/checkout/food.tsx:410-560
export const Checkout: React.FC<{highlight?: number; confirmPressed?: number; scrollY?: number}> = ({highlight = 0, confirmPressed = 0, scrollY = 0}) => {
  const priceRow = (label: string, val: string, sub?: string) => (
    <Row style={{justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10}}>
      <span style={{fontSize: 14, color: brand.text2}}>{label}</span>
      <div style={{textAlign: 'right'}}>
        <div style={{fontSize: 14, fontWeight: 600}}>{val}</div>
        {sub && <div style={{fontSize: 11, color: brand.textMuted, marginTop: 2}}>{sub}</div>}
      </div>
    </Row>
  );
  const pay = (Icon: typeof Banknote, title: string, sub: string, on: boolean) => (
    <Row style={{justifyContent: 'space-between', padding: 12, borderRadius: radius.md, border: `1.5px solid ${on ? brand.pink : brand.border}`, background: on ? brand.pinkSoft : '#fff', marginTop: 8}}>
      <Row style={{gap: 12, flex: 1}}>
        <Icon size={22} color={on ? brand.pink : brand.text2} />
        <div style={{flex: 1}}>
          <div style={{fontSize: 14, fontWeight: 700, color: on ? brand.pinkDark : brand.ink}}>{title}</div>
          <div style={{fontSize: 12, color: brand.text2, marginTop: 2}}>{sub}</div>
        </div>
      </Row>
      {on ? <CheckCircle2 size={18} color={brand.pink} /> : <Circle size={18} color={brand.borderStrong} />}
    </Row>
  );
  return (
    <Screen>
      <Row style={{padding: '58px 16px 12px', gap: 12, background: '#fff', borderBottom: `1px solid ${brand.border}`, position: 'relative', zIndex: 2}}>
        <ArrowLeft size={22} color={brand.ink} />
        <Txt size={18} weight={800}>
          Konfirmasi Pesanan
        </Txt>
      </Row>
      <div style={{padding: '16px 16px 0', transform: `translateY(${-scrollY}px)`}}>
        <Card style={{padding: 14, marginBottom: 16}}>
          <Row style={{gap: 8, marginBottom: 8}}>
            <MapPin size={18} color={brand.pink} />
            <Txt size={15} weight={700}>
              Detail Pengiriman
            </Txt>
          </Row>
          <Txt size={13} color={brand.text2}>
            {demo.address}
          </Txt>
        </Card>
        <Row style={{gap: 8, marginBottom: 4}}>
          <CreditCard size={18} color={brand.pink} />
          <Txt size={15} weight={700}>
            Metode Pembayaran
          </Txt>
        </Row>
        {pay(Banknote, 'Tunai (Bayar di Tempat)', 'Bayar langsung ke driver saat pesanan sampai', true)}
        {pay(QrCode, 'Non-Tunai (Midtrans / QRIS)', 'Bayar instan via QRIS, GoPay, atau Virtual Account', false)}
        <Txt size={15} weight={700} style={{margin: '18px 0 8px'}}>
          Ringkasan Pembayaran
        </Txt>
        <Card style={{padding: 14, boxShadow: highlight ? `0 0 0 ${highlight * 3}px ${brand.pink}, 0 12px 30px rgba(216,27,96,${0.25 * highlight})` : undefined}}>
          {priceRow('Harga Makanan', rupiah(foodTotal))}
          {priceRow('Ongkos Kirim', rupiah(demo.deliveryFee), `${demo.distanceKm} km · ~${demo.durationMin} menit`)}
          {priceRow('Biaya Layanan', rupiah(demo.serviceFee))}
          <div style={{height: 1, background: brand.border, margin: '4px 0 12px'}} />
          <Row style={{justifyContent: 'space-between'}}>
            <span style={{fontSize: 15, fontWeight: 800}}>Total Pembayaran</span>
            <span style={{fontSize: 17, fontWeight: 800, color: brand.pink}}>{rupiah(orderTotal)}</span>
          </Row>
        </Card>
      </div>
      <Row style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 16px 30px', background: '#fff', borderTop: `1px solid ${brand.border}`, justifyContent: 'space-between'}}>
        <div>
          <Txt size={12} color={brand.text2}>
            Total Pembayaran
          </Txt>
          <Txt size={18} weight={800} color={brand.pink}>
            {rupiah(orderTotal)}
          </Txt>
        </div>
        <PrimaryBtn label="Pesan Sekarang" pressed={confirmPressed} style={{width: 180}} />
      </Row>
    </Screen>
  );
};

// Lacak pesanan. mihp-customer/app/order/tracking/[id].tsx:22-29 (judul status), :284-370 (header & kartu driver)
export const Tracking: React.FC<{frame: number; progress: number; route?: Pt[]; showRoute?: number}> = ({frame, progress, route, showRoute = 1}) => (
  <Screen>
    <MapView frame={frame} progress={progress} route={route} showRoute={showRoute} />
    <Row style={{position: 'absolute', top: 56, left: 14, right: 14, gap: 10, background: '#fff', borderRadius: radius.lg, padding: 10, boxShadow: '0 6px 18px rgba(42,18,32,0.12)'}}>
      <div style={{width: 38, height: 38, borderRadius: 19, background: brand.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <ArrowLeft size={20} color={brand.ink} />
      </div>
      <div style={{flex: 1}}>
        <Txt size={14} weight={800}>
          Driver sedang menuju ke tujuan
        </Txt>
        <Txt size={12} color={brand.text2}>
          {demo.distanceKm} km · {demo.durationMin} menit
        </Txt>
      </div>
      <div style={{width: 34, height: 34, borderRadius: 17, background: brand.pinkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <RefreshCw size={16} color={brand.pink} />
      </div>
    </Row>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '18px 18px 34px', boxShadow: '0 -8px 24px rgba(42,18,32,0.10)'}}>
      <Row style={{gap: 12}}>
        <div style={{width: 48, height: 48, borderRadius: 24, background: brand.pinkMuted, color: brand.pink, fontWeight: 800, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{demo.driver.name.split(' ').pop()![0]}</div>
        <div style={{flex: 1}}>
          <Txt size={15} weight={800}>
            {demo.driver.name}
          </Txt>
          <Row style={{gap: 6, marginTop: 4}}>
            <Bike size={13} color={brand.text2} />
            <div style={{padding: '2px 8px', borderRadius: 6, background: brand.ink, color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: 0.6}}>{demo.driver.plate}</div>
          </Row>
        </div>
        <div style={{width: 42, height: 42, borderRadius: 21, background: brand.pinkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <MessageCircle size={18} color={brand.pink} />
        </div>
        <div style={{width: 42, height: 42, borderRadius: 21, background: brand.pink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <PhoneIcon size={18} color="#fff" />
        </div>
      </Row>
      <Row style={{marginTop: 18, justifyContent: 'space-between'}}>
        {['Diterima', 'Dijemput', 'Tiba'].map((label, i) => {
          const done = i < 2;
          return (
            <React.Fragment key={label}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
                <div style={{width: 20, height: 20, borderRadius: 10, background: done ? brand.pink : brand.border, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {done && <Check size={11} color="#fff" strokeWidth={3} />}
                </div>
                <span style={{fontSize: 11, fontWeight: 600, color: done ? brand.pink : brand.textMuted}}>{label}</span>
              </div>
              {i < 2 && <div style={{flex: 1, height: 2, marginBottom: 18, background: i === 0 ? brand.pink : brand.border}} />}
            </React.Fragment>
          );
        })}
      </Row>
    </div>
  </Screen>
);

// Modal scan QR + dialog "Pesanan Selesai". mihp-customer/app/(tabs)/_layout.tsx:18-165
export const CustomerScan: React.FC<{scanLine: number; found: number; success: number; qr: React.ReactNode}> = ({scanLine, found, success, qr}) => {
  const FRAME = 240;
  return (
    <Screen bg="#000">
      {/* Gambar kamera: QR di HP driver */}
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 42%, #3a3540 0%, #121014 70%)'}} />
      <div style={{position: 'absolute', left: 195 - 120, top: 360 - 120, width: 240, height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.82 + found * 0.04})`}}>
        <div style={{background: '#fff', padding: 14, borderRadius: 14, opacity: 0.92}}>{qr}</div>
      </div>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ${240}px, ${75}px ${240}px, ${75}px ${480}px, ${315}px ${480}px, ${315}px ${240}px, 0 ${240}px)`}} />
      {/* Bingkai pindai */}
      <div style={{position: 'absolute', left: 75, top: 240, width: FRAME, height: FRAME}}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 36,
              height: 36,
              [i < 2 ? 'top' : 'bottom']: 0,
              [i % 2 ? 'right' : 'left']: 0,
              borderColor: found > 0.5 ? brand.success : brand.pinkLight,
              borderStyle: 'solid',
              borderWidth: 0,
              [`border${i < 2 ? 'Top' : 'Bottom'}Width`]: 4,
              [`border${i % 2 ? 'Right' : 'Left'}Width`]: 4,
              borderRadius: 6,
            }}
          />
        ))}
        <div style={{position: 'absolute', left: 12, right: 12, top: 12 + scanLine * (FRAME - 24), height: 3, borderRadius: 2, background: brand.pinkLight, boxShadow: `0 0 14px ${brand.pinkLight}`, opacity: 1 - found}} />
      </div>
      <Row style={{position: 'absolute', top: 58, left: 16, right: 16, justifyContent: 'space-between'}}>
        <div style={{width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <X size={20} color="#fff" strokeWidth={2.2} />
        </div>
        <span style={{color: '#fff', fontSize: 17, fontWeight: 700}}>Scan QR Code</span>
        <div style={{width: 40}} />
      </Row>
      <Row style={{position: 'absolute', left: 16, right: 16, bottom: 40, background: '#fff', borderRadius: radius.lg, padding: 16, gap: 12, alignItems: 'flex-start'}}>
        <div style={{width: 40, height: 40, borderRadius: 12, background: brand.pinkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ScanLine size={20} color={brand.pink} />
        </div>
        <div style={{flex: 1}}>
          <Txt size={15} weight={700}>
            Scan untuk Selesaikan Pesanan
          </Txt>
          <Txt size={12} color={brand.text2} style={{marginTop: 2}}>
            Arahkan kamera ke QR code driver, atau masukkan PIN bila kamera bermasalah.
          </Txt>
          <Txt size={12} weight={700} color={brand.pink} style={{marginTop: 8}}>
            Kendala scan kamera? Masukkan PIN 4-digit →
          </Txt>
        </div>
      </Row>
      {/* Alert sistem "Pesanan Selesai" */}
      {success > 0 && (
        <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.35 * success})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 280, background: 'rgba(250,250,252,0.98)', borderRadius: 16, overflow: 'hidden', opacity: success, transform: `scale(${1.15 - 0.15 * success})`, textAlign: 'center'}}>
            <div style={{padding: '20px 16px 16px'}}>
              <Txt size={17} weight={700}>
                Pesanan Selesai
              </Txt>
              <Txt size={13} style={{marginTop: 4}}>
                Pesanan kamu telah berhasil diselesaikan!
              </Txt>
            </div>
            <Row style={{borderTop: '1px solid #DDD'}}>
              <div style={{flex: 1, padding: 12, color: '#0A64D8', fontSize: 16, borderRight: '1px solid #DDD'}}>Lihat Detail</div>
              <div style={{flex: 1, padding: 12, color: '#0A64D8', fontSize: 16, fontWeight: 700}}>OK</div>
            </Row>
          </div>
        </div>
      )}
    </Screen>
  );
};
