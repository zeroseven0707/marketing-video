// UI Mihape Mitra direkonstruksi dari source code mihape-mitra. Rujukan file:baris di tiap komponen.
import React from 'react';
import {Bell, BellRing, Bike, ChevronRight, Power, Wallet, X} from 'lucide-react';
import {cartLines, demo, foodTotal, rupiah} from '../../config/demo';
import {brand} from '../../config/theme';
import {radius, Row, Screen, Txt} from './kit';

const DARK = brand.inkDeep;

const RingIcon: React.FC<{ring: number}> = ({ring}) => (
  <div
    style={{
      width: 88,
      height: 88,
      borderRadius: 44,
      background: 'rgba(254,103,159,0.18)',
      border: '1px solid rgba(254,103,159,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      position: 'relative',
    }}
  >
    <div style={{position: 'absolute', inset: -8, borderRadius: 60, border: `2px solid ${brand.pinkLight}`, opacity: 0.6 * (1 - ring), transform: `scale(${1 + ring * 0.5})`}} />
    <div style={{width: 64, height: 64, borderRadius: 32, background: brand.pink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 18px rgba(216,27,96,0.45)'}}>
      <div style={{transform: `rotate(${Math.sin(ring * Math.PI * 6) * 14}deg)`}}>
        <BellRing size={30} color="#fff" strokeWidth={2.2} />
      </div>
    </div>
  </div>
);

const ActionBtns: React.FC<{accept: string; pressed: number; later: string}> = ({accept, pressed, later}) => (
  <div>
    <Row style={{gap: 12}}>
      <div style={{flex: 1, height: 64, borderRadius: radius.md, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff', fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Tolak</div>
      <div
        style={{
          flex: 1.6,
          height: 64,
          borderRadius: radius.md,
          background: pressed > 0.5 ? brand.pinkPressed : brand.pink,
          color: '#fff',
          fontSize: accept.length > 12 ? 16 : 19,
          fontWeight: 800,
          textAlign: 'center',
          padding: '0 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 18px rgba(216,27,96,0.45)',
          transform: `scale(${1 - pressed * 0.04})`,
        }}
      >
        {accept}
      </div>
    </Row>
    <div style={{textAlign: 'center', marginTop: 14, color: 'rgba(255,255,255,0.55)', fontSize: 13}}>{later}</div>
  </div>
);

// Modal pesanan masuk untuk TOKO. mihape-mitra/components/merchant/IncomingOrderWatcher.tsx:154-265
export const MerchantIncoming: React.FC<{ring: number; secondsLeft: number; pressed: number}> = ({ring, secondsLeft, pressed}) => {
  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, '0');
  return (
    <Screen bg={DARK}>
      <div style={{position: 'absolute', inset: 0, padding: '64px 20px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8}}>
          <RingIcon ring={ring} />
          <span style={{color: brand.pinkLight, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase'}}>Pesanan masuk</span>
          <span style={{color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: -0.6, marginTop: 4}}>Pesanan Baru!</span>
          <span style={{color: '#fff', fontSize: 48, fontWeight: 800, marginTop: 14, letterSpacing: -1, fontVariantNumeric: 'tabular-nums'}}>
            {mm}:{ss}
          </span>
          <span style={{color: 'rgba(255,255,255,0.6)', fontSize: 13}}>sebelum dibatalkan otomatis</span>
        </div>
        <div style={{background: '#fff', borderRadius: radius.xl, padding: '22px 18px 18px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: brand.pink}} />
          <Row style={{justifyContent: 'space-between'}}>
            <span style={{fontSize: 18, fontWeight: 800, letterSpacing: 0.5}}>#{demo.orderCode}</span>
            <span style={{fontSize: 13, color: brand.text2, fontWeight: 500}}>{demo.customerName}</span>
          </Row>
          <div style={{fontSize: 15, lineHeight: '22px'}}>{cartLines.map((l) => `${l.qty}x ${l.name}`).join(', ')}</div>
          <Row style={{justifyContent: 'space-between', borderTop: `1px solid ${brand.border}`, paddingTop: 12}}>
            <span style={{fontSize: 13, color: brand.text2}}>Total makanan</span>
            <span style={{fontSize: 20, fontWeight: 800, letterSpacing: -0.4}}>{rupiah(foodTotal)}</span>
          </Row>
          <Row style={{justifyContent: 'flex-end', gap: 2}}>
            <span style={{fontSize: 13, color: brand.pink, fontWeight: 600}}>Lihat detail</span>
            <ChevronRight size={16} color={brand.pink} />
          </Row>
        </div>
        <ActionBtns accept="Terima" pressed={pressed} later="Nanti (dering tetap berbunyi)" />
      </div>
    </Screen>
  );
};

// Toast setelah toko menerima. Teks dari mihape-mitra/lib/merchant/orderActions.ts:44-68
export const MerchantAccepted: React.FC<{t: number}> = ({t}) => (
  <Screen bg={DARK}>
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, gap: 18}}>
      <div style={{width: 92, height: 92, borderRadius: 46, background: brand.success, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.6 + 0.4 * t})`}}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" strokeDasharray="24" strokeDashoffset={24 * (1 - t)} />
        </svg>
      </div>
      <div style={{color: '#fff', fontSize: 20, fontWeight: 800, textAlign: 'center', opacity: t}}>Pesanan diterima.</div>
      <div style={{color: 'rgba(255,255,255,0.7)', fontSize: 15, textAlign: 'center', opacity: t}}>Menawarkan ke driver terdekat…</div>
    </div>
  </Screen>
);

// Dasbor driver. mihape-mitra/app/driver/(tabs)/index.tsx:320-495
export const DriverDashboard: React.FC<{online: number}> = ({online}) => {
  const on = online > 0.5;
  return (
    <Screen>
      <div style={{padding: '64px 20px 0'}}>
        <Row style={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <Txt size={13} weight={500} color={brand.text2}>
              Selamat bekerja,
            </Txt>
            <Txt size={24} weight={800} style={{letterSpacing: -0.6}}>
              {demo.driver.name.split(' ').pop()}
            </Txt>
            <Row style={{gap: 6, marginTop: 8, padding: '4px 10px', borderRadius: 999, background: brand.pinkSoft, display: 'inline-flex'}}>
              <Bike size={13} color={brand.pink} strokeWidth={2} />
              <span style={{fontSize: 12, fontWeight: 600}}>
                {demo.driver.vehicle} · {demo.driver.plate}
              </span>
            </Row>
          </div>
          <div style={{width: 44, height: 44, borderRadius: radius.md, background: '#fff', border: `1px solid ${brand.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Bell size={20} color={brand.ink} strokeWidth={1.8} />
          </div>
        </Row>
        {/* Hero gradien: colors.primary → brandPink → brandPinkLight, locations [0, .6, 1] */}
        <div style={{marginTop: 18, borderRadius: radius.xl, padding: 20, color: '#fff', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, ${brand.pink} 0%, ${brand.pinkLogo} 60%, ${brand.pinkLight} 100%)`}}>
          <div style={{position: 'absolute', right: -40, top: -50, width: 170, height: 170, borderRadius: 85, background: 'rgba(255,255,255,0.12)'}} />
          <div style={{position: 'absolute', right: 40, bottom: -40, width: 90, height: 90, borderRadius: 45, background: 'rgba(255,255,255,0.10)'}} />
          <Row style={{gap: 8}}>
            <div style={{width: 28, height: 28, borderRadius: 14, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Wallet size={16} color="#fff" strokeWidth={2} />
            </div>
            <span style={{fontSize: 13, fontWeight: 600, opacity: 0.95}}>Pendapatan hari ini</span>
          </Row>
          {/* Angka sengaja disamarkan: data contoh, bukan klaim pendapatan. */}
          <div style={{fontSize: 30, fontWeight: 800, marginTop: 10, letterSpacing: -0.6}}>Rp ••••••</div>
          <Row style={{marginTop: 14, gap: 8}}>
            {['Selesai hari ini', 'Total selesai', 'Total pendapatan'].map((l) => (
              <div key={l} style={{flex: 1, background: 'rgba(255,255,255,0.16)', borderRadius: 12, padding: '8px 10px'}}>
                <div style={{fontSize: 15, fontWeight: 800}}>••</div>
                <div style={{fontSize: 10.5, opacity: 0.9}}>{l}</div>
              </div>
            ))}
          </Row>
        </div>
        {/* Status online/offline */}
        <Row style={{marginTop: 16, gap: 12, padding: 16, borderRadius: radius.lg, background: '#fff', border: `1.5px solid ${on ? '#BBF7D0' : brand.border}`}}>
          <div style={{width: 42, height: 42, borderRadius: 21, background: on ? brand.successSoft : '#F6F3F5', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Power size={20} color={on ? brand.success : brand.text2} strokeWidth={2.2} />
          </div>
          <div style={{flex: 1}}>
            <Row style={{gap: 8}}>
              <span style={{fontSize: 16, fontWeight: 800}}>{on ? 'Kamu Online' : 'Kamu Offline'}</span>
              <Row style={{gap: 5, padding: '2px 8px', borderRadius: 999, background: on ? brand.successSoft : '#F6F3F5'}}>
                <div style={{width: 7, height: 7, borderRadius: 4, background: on ? brand.success : brand.textMuted}} />
                <span style={{fontSize: 11, fontWeight: 700, color: on ? brand.success : brand.text2}}>{on ? 'Aktif' : 'Nonaktif'}</span>
              </Row>
            </Row>
            <div style={{fontSize: 12, color: brand.text2, marginTop: 3}}>{on ? 'Siap menerima tawaran pesanan' : 'Aktifkan untuk menerima pesanan'}</div>
          </div>
          {/* Switch */}
          <div style={{width: 51, height: 31, borderRadius: 16, background: online > 0 ? `color-mix(in srgb, ${brand.pink} ${online * 100}%, ${brand.borderStrong})` : brand.borderStrong, position: 'relative'}}>
            <div style={{position: 'absolute', top: 2, left: 2 + online * 20, width: 27, height: 27, borderRadius: 14, background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}} />
          </div>
        </Row>
      </div>
    </Screen>
  );
};

// Tawaran pesanan untuk DRIVER (pembayaran tunai). mihape-mitra/components/driver/IncomingOrderWatcher.tsx:188-310
export const DriverOffer: React.FC<{ring: number; pressed: number}> = ({ring, pressed}) => (
  <Screen bg={DARK}>
    <div style={{position: 'absolute', inset: 0, padding: '64px 20px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4}}>
        <RingIcon ring={ring} />
        <span style={{color: brand.pinkLight, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase'}}>Tawaran pesanan</span>
        <span style={{color: '#fff', fontSize: 28, fontWeight: 800, letterSpacing: -0.6, marginTop: 4}}>Pesanan Baru!</span>
      </div>
      <div style={{background: '#fff', borderRadius: radius.xl, padding: '22px 18px 18px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 12}}>
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: brand.warning}} />
        <Row style={{justifyContent: 'space-between'}}>
          <span style={{fontSize: 17, fontWeight: 800}}>Pesan Makanan</span>
          <span style={{fontSize: 11, fontWeight: 800, color: brand.warning, background: brand.warningSoft, padding: '4px 8px', borderRadius: 8}}>COD · TUNAI</span>
        </Row>
        <div>
          <div style={{fontSize: 11, color: brand.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6}}>Jemput</div>
          <div style={{fontSize: 14, fontWeight: 600, marginTop: 2}}>{demo.store.name}</div>
        </div>
        <div>
          <div style={{fontSize: 11, color: brand.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6}}>Antar</div>
          <div style={{fontSize: 14, fontWeight: 600, marginTop: 2}}>{demo.address}</div>
        </div>
        <div style={{background: '#F6F3F5', borderRadius: 12, padding: 12}}>
          <Row style={{justifyContent: 'space-between'}}>
            <span style={{fontSize: 13, color: brand.text2}}>Tagih tunai ke pelanggan</span>
            <span style={{fontSize: 14, fontWeight: 800, color: brand.success}}>+Rp •••••</span>
          </Row>
          <Row style={{justifyContent: 'space-between', marginTop: 6}}>
            <span style={{fontSize: 13, color: brand.text2}}>Saldo deposit dipotong</span>
            <span style={{fontSize: 14, fontWeight: 800, color: brand.danger}}>−Rp •••••</span>
          </Row>
        </div>
        <Row style={{justifyContent: 'space-between', borderTop: `1px solid ${brand.border}`, paddingTop: 12}}>
          <span style={{fontSize: 13, color: brand.text2}}>Ongkos kirim (hak kamu)</span>
          <span style={{fontSize: 20, fontWeight: 800}}>Rp •••••</span>
        </Row>
      </div>
      <ActionBtns accept="Terima & Mulai Perjalanan" pressed={pressed} later="Matikan dering" />
    </div>
  </Screen>
);

// QR penyelesaian layar penuh di HP driver. mihape-mitra/app/driver/order/[id].tsx:585-609
export const DriverQr: React.FC<{qr: React.ReactNode}> = ({qr}) => (
  <Screen bg="rgba(28,27,34,0.92)">
    <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
      <div style={{background: '#fff', borderRadius: 24, padding: '28px 22px 24px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative'}}>
        <div style={{position: 'absolute', top: 14, right: 14}}>
          <X size={20} color={brand.ink} />
        </div>
        <div style={{fontSize: 17, fontWeight: 800, textAlign: 'center'}}>Scan untuk Selesaikan Pesanan</div>
        {qr}
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 12, color: brand.text2}}>Atau gunakan 4-Digit PIN Alternatif:</div>
          <div style={{fontSize: 34, fontWeight: 800, letterSpacing: 8, marginTop: 4}}>{demo.pin}</div>
          <div style={{fontSize: 11, color: brand.textMuted, marginTop: 4}}>Sebutkan PIN di atas jika pelanggan terkendala kamera/scan</div>
        </div>
      </div>
    </div>
  </Screen>
);
