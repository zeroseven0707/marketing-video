// Token visual. Sumber: docs/BRAND_GUIDELINES.md (diturunkan dari mihp-customer/lib/theme.ts
// dan mihp-backend/public/css/landing.css). Jangan menambah warna merek di luar daftar ini.

export const video = {width: 1080, height: 1920, fps: 30} as const;

export const brand = {
  pink: '#D81B60', // primary
  pinkLogo: '#E61A64',
  pinkLight: '#FE679F',
  pinkDark: '#AD1457',
  pinkPressed: '#C2185B',
  pinkSoft: '#FFF0F5',
  pinkMuted: '#FCE4EC',
  pinkBorder: '#F8BBD0',
  ink: '#1C1B22',
  inkDeep: '#2A1220',
  text2: '#6B6874',
  textMuted: '#A29FAA',
  bg: '#FAF8F9',
  bgHero: '#FFF7FA',
  white: '#FFFFFF',
  border: '#F0ECEF',
  borderStrong: '#E4DEE2',
  success: '#15803D',
  successSoft: '#ECFDF3',
  warning: '#B45309',
  warningSoft: '#FFF7E6',
  danger: '#DC2626',
  info: '#1D4ED8',
  star: '#F59E0B',
} as const;

// Aksen ikon layanan beranda (mihp-customer/app/(tabs)/home.tsx:24-31).
export const serviceColors = {
  food: {color: '#E8590C', bg: '#FFF4EC'},
  ojek: {color: brand.pink, bg: brand.pinkSoft},
  car: {color: '#2563EB', bg: '#EFF4FF'},
  delivery: {color: '#7C3AED', bg: '#F5F1FF'},
} as const;

export const gradients = {
  brand: `linear-gradient(135deg, ${brand.pink} 0%, ${brand.pinkLogo} 60%, ${brand.pinkLight} 100%)`,
  hero: `linear-gradient(180deg, ${brand.bgHero} 0%, #FFFFFF 100%)`,
} as const;

// Palet dunia ilustrasi lokal (sawah, bukit, rumah). Hangat dan alami, bukan warna merek.
export const world = {
  skyTop: '#F6D7C3',
  skyMid: '#FBE8DA',
  skyLow: '#FFF6EE',
  sun: '#FFD9A8',
  hillFar: '#B9CFC4',
  hillMid: '#8FB59E',
  hillNear: '#5E9473',
  rice: ['#9CC25B', '#86B44A', '#B3CF6E', '#7AA843'],
  riceDark: '#5C8A36',
  water: '#CFE4E6',
  road: '#C9B9A6',
  roadEdge: '#B2A08C',
  roof: '#C8643B',
  roofDark: '#A44F2E',
  wall: '#F4EBDD',
  wallShade: '#E2D5C2',
  wood: '#8A5A3B',
  tree: '#4E7F5B',
  treeDark: '#3B6447',
  trunk: '#7A5A43',
} as const;

export const font = {
  family: '"Plus Jakarta Sans", system-ui, sans-serif',
} as const;

// Area aman 9:16: teks penting di antara 15% atas dan 20% bawah.
export const safe = {
  top: 300,
  bottom: 1920 - 400,
  side: 80,
} as const;
