import React, {useMemo} from 'react';
import QRCode from 'qrcode';
import {brand} from '../../config/theme';

// QR asli (dapat dipindai) berisi teks contoh, seperti react-native-qrcode-svg di aplikasi driver.
export const Qr: React.FC<{value: string; size: number; reveal?: number}> = ({value, size, reveal = 1}) => {
  const {n, cells} = useMemo(() => {
    const q = QRCode.create(value, {errorCorrectionLevel: 'M'});
    const n = q.modules.size;
    const cells: [number, number][] = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.modules.get(x, y)) cells.push([x, y]);
    return {n, cells};
  }, [value]);
  const m = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells.map(([x, y], i) => {
        // Muncul bertahap diagonal saat reveal < 1.
        const k = (x + y) / (2 * n);
        return k <= reveal ? <rect key={i} x={x * m} y={y * m} width={m + 0.3} height={m + 0.3} fill={brand.ink} /> : null;
      })}
    </svg>
  );
};
