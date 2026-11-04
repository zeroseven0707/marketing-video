// Membuat musik latar dan SFX orisinal secara sintetis (WAV 16-bit stereo 44,1 kHz).
// Tidak memakai sampel pihak lain dan tidak membuat suara/narasi AI.
// Musik: pop hangat ±99,5 BPM dengan petikan senar bergaya kecapi (Karplus-Strong) di tangga nada
// pentatonik D. Bagian lagu dikunci ke timeline video di src/config/scenes.ts.
// Jalankan: npm run audio
import {mkdirSync, writeFileSync} from 'node:fs';
import {sceneStarts, totalFrames} from '../src/config/scenes.ts';

const SR = 44100;
const startSec = (id) => sceneStarts.find((s) => s.id === id).start / 30;
const T_INTRO_END = startSec('S03Intro'); // logo muncul: musik masuk penuh
const T_LIFT = startSec('S06Merchant'); // energi naik: segmen mitra
const T_OUTRO = startSec('S11Closing'); // penutup
const LEN = totalFrames / 30 + 0.5;
// Tempo dipilih agar dari T_INTRO_END ke T_OUTRO tepat 18 bar.
const BEAT = (T_OUTRO - T_INTRO_END) / (18 * 4);
const BPM = 60 / BEAT;

const rng = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const wavStereo = (L, R) => {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write('WAVEfmt ', 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 4, 40);
  const c = (v) => Math.round(Math.max(-1, Math.min(1, v)) * 32767);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(c(L[i]), 44 + i * 4);
    buf.writeInt16LE(c(R[i]), 46 + i * 4);
  }
  return buf;
};

const peakOf = (...chs) => chs.reduce((m, ch) => ch.reduce((a, v) => Math.max(a, Math.abs(v)), m), 0) || 1;
const normalize = (peak, ...chs) => {
  const k = peak / peakOf(...chs);
  chs.forEach((ch) => ch.forEach((v, i) => (ch[i] = v * k)));
};
const rms = (ch) => Math.sqrt(ch.reduce((a, v) => a + v * v, 0) / ch.length);

const midi = (m) => 440 * 2 ** ((m - 69) / 12);

// ---------- Instrumen ----------

// Senar dipetik (Karplus-Strong) untuk nuansa kecapi.
const pluck = (out, t0, freq, amp, decay = 0.996, bright = 0.5, r = rng(Math.round(freq * 100 + t0 * 1000))) => {
  const N = Math.max(2, Math.round(SR / freq));
  const buf = Float32Array.from({length: N}, () => (r() * 2 - 1) * amp);
  const start = Math.round(t0 * SR);
  const dur = Math.round(SR * 3.2);
  let prev = 0;
  for (let i = 0; i < dur && start + i < out.length; i++) {
    const k = i % N;
    const nxt = buf[(k + 1) % N];
    const v = decay * (bright * buf[k] + (1 - bright) * 0.5 * (buf[k] + nxt));
    buf[k] = v;
    // Sedikit low-pass agar tidak tajam.
    prev += 0.55 * (v - prev);
    if (start + i >= 0) out[start + i] += prev;
  }
};

const addTone = (out, t0, dur, fn) => {
  const s = Math.round(t0 * SR);
  const n = Math.round(dur * SR);
  for (let i = 0; i < n && s + i < out.length; i++) if (s + i >= 0) out[s + i] += fn(i / SR, i);
};

// Pad lembut: tumpukan sinus dengan detune tipis.
const pad = (out, t0, dur, notes, amp) =>
  addTone(out, t0, dur + 0.8, (t) => {
    const env = Math.min(1, t / 0.6) * Math.min(1, Math.max(0, (dur + 0.8 - t) / 0.8));
    return notes.reduce((s, m, j) => {
      const f = midi(m);
      return s + (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.003 * t + j)) * 0.33;
    }, 0) * env * amp;
  });

const kick = (out, t0, amp) =>
  addTone(out, t0, 0.35, (t) => {
    const f = 48 + 90 * Math.exp(-t * 32);
    return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 9) * amp;
  });

const clap = (out, t0, amp, r) =>
  addTone(out, t0, 0.22, (t) => {
    const env = Math.exp(-t * 26) + 0.5 * Math.exp(-Math.max(0, t - 0.012) * 30) * (t > 0.012);
    return (r() * 2 - 1) * env * amp;
  });

const shaker = (out, t0, amp, r) => {
  let y = 0;
  let x1 = 0;
  addTone(out, t0, 0.07, (t) => {
    const x = r() * 2 - 1;
    // High-pass sederhana.
    y = 0.85 * (y + x - x1);
    x1 = x;
    return y * Math.exp(-t * 60) * amp;
  });
};

const bassNote = (out, t0, dur, m, amp) =>
  addTone(out, t0, dur, (t) => {
    const f = midi(m);
    const env = Math.min(1, t / 0.01) * Math.exp(-t * 2.2) * Math.min(1, (dur - t) / 0.04);
    return (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t)) * env * amp;
  });

// Reverb Schroeder sederhana (kirim/return), berbeda sedikit untuk L dan R.
const reverb = (input, combs, mix) => {
  const out = new Float32Array(input.length);
  for (const [d, g] of combs) {
    const D = Math.round(d * SR);
    const buf = new Float32Array(D);
    let lp = 0;
    for (let i = 0; i < input.length; i++) {
      const y = buf[i % D];
      lp += 0.4 * (y - lp);
      buf[i % D] = input[i] + lp * g;
      out[i] += y / combs.length;
    }
  }
  for (const d of [0.005, 0.0017]) {
    const D = Math.round(d * SR);
    const buf = new Float32Array(D);
    for (let i = 0; i < out.length; i++) {
      const b = buf[i % D];
      const y = -0.6 * out[i] + b;
      buf[i % D] = out[i] + 0.6 * y;
      out[i] = y;
    }
  }
  return out.map((v) => v * mix);
};

// ---------- Musik ----------

const music = () => {
  const n = Math.round(LEN * SR);
  const drums = new Float32Array(n);
  const bass = new Float32Array(n);
  const keysL = new Float32Array(n);
  const keysR = new Float32Array(n);
  const padBus = new Float32Array(n);
  const r = rng(11);

  // Progresi D - Bm - G - A (I vi IV V), satu akor per bar.
  const chords = [
    {root: 50, notes: [62, 66, 69]},
    {root: 47, notes: [59, 62, 66]},
    {root: 43, notes: [55, 59, 62]},
    {root: 45, notes: [57, 61, 64]},
  ];
  // Pentatonik D (D E F# A B) untuk petikan.
  const penta = [62, 64, 66, 69, 71, 74, 76, 78, 81];
  const bar = BEAT * 4;
  const firstBar = -Math.ceil(T_INTRO_END / bar); // bar negatif = intro sebelum logo
  const lastBar = Math.ceil((LEN - T_INTRO_END) / bar);

  for (let b = firstBar; b < lastBar; b++) {
    const t = T_INTRO_END + b * bar;
    const ch = chords[((b % 4) + 4) % 4];
    const intro = t < T_INTRO_END - 0.01;
    const outro = t >= T_OUTRO - 0.01;
    const lift = t >= T_LIFT - 0.01 && !outro;

    if (t + bar > 0) pad(padBus, Math.max(0, t), bar, ch.notes, intro ? 0.05 : 0.04);

    // Petikan kecapi: arpeggio 8 ketuk per bar, pola berubah tiap bar.
    const pattern = intro ? [0, 2, 4, 2] : [0, 2, 4, 5, 3, 5, 4, 2];
    const step = bar / pattern.length;
    pattern.forEach((p, k) => {
      const tt = t + k * step;
      if (tt < 0 || (outro && k > 0)) return;
      const base = penta.indexOf(ch.notes[0] >= 62 ? ch.notes[0] : ch.notes[0] + 12);
      const idx = Math.min(penta.length - 1, Math.max(0, (base < 0 ? 0 : base) + p - 1));
      const m = penta[idx] + (lift && k % 4 === 3 ? 12 : 0);
      const out = k % 2 ? keysR : keysL;
      pluck(out, tt, midi(m), intro ? 0.32 : 0.28, 0.9965, 0.45);
      pluck(k % 2 ? keysL : keysR, tt + 0.012, midi(m), 0.08, 0.996, 0.45);
    });

    if (intro || outro) continue;

    for (let q = 0; q < 4; q++) {
      const tb = t + q * BEAT;
      kick(drums, tb, q % 2 === 0 ? 0.95 : 0.6);
      if (q % 2 === 1) clap(drums, tb, 0.42, r);
      for (let s = 0; s < 4; s++) shaker(drums, tb + (s * BEAT) / 4, s % 2 ? 0.12 : 0.2, r);
      // Bass: akar pada ketuk, oktaf pada sinkop.
      bassNote(bass, tb, BEAT * 0.48, ch.root, 0.5);
      bassNote(bass, tb + BEAT * 0.5, BEAT * 0.45, ch.root + (q === 3 ? 7 : 12), 0.32);
    }
    // Melodi tinggi pada bagian "lift".
    if (lift && ((b % 2) + 2) % 2 === 0) {
      [4, 5, 7, 5].forEach((p, k) => pluck(k % 2 ? keysL : keysR, t + bar * 0.5 + k * BEAT * 0.5, midi(penta[Math.min(8, p)] + 12), 0.14, 0.997, 0.4));
    }
  }

  // Riser menuju logo (S03) dan menuju penutup.
  const riser = (out, tEnd, dur, amp) => {
    const rr = rng(Math.round(tEnd * 100));
    let y = 0;
    addTone(out, tEnd - dur, dur, (t) => {
      const k = t / dur;
      y += (0.01 + 0.2 * k * k) * ((rr() * 2 - 1) - y);
      return y * k * k * amp;
    });
  };
  riser(drums, T_INTRO_END, 1.8, 1.6);
  riser(drums, T_OUTRO, 1.2, 1.1);
  // Hantaman lembut saat logo dan saat penutup.
  for (const tt of [T_INTRO_END, T_OUTRO]) {
    kick(drums, tt, 1.1);
    pad(padBus, tt, 2.4, [50, 57, 62, 66], 0.06);
  }
  // Akor terakhir penutup ditahan.
  pad(padBus, T_OUTRO + 1.2, 3.6, [50, 57, 62, 66, 69], 0.05);
  [74, 78, 81, 86].forEach((m, k) => pluck(k % 2 ? keysR : keysL, T_OUTRO + 1.5 + k * 0.12, midi(m), 0.22, 0.998, 0.4));

  // Gabung ke stereo + reverb pada petikan & pad.
  const sendL = keysL.map((v, i) => v + padBus[i] * 0.8);
  const sendR = keysR.map((v, i) => v + padBus[i] * 0.8);
  const revL = reverb(sendL, [[0.0297, 0.8], [0.0371, 0.8], [0.0411, 0.78], [0.0437, 0.77]], 0.35);
  const revR = reverb(sendR, [[0.0311, 0.8], [0.0359, 0.8], [0.0423, 0.78], [0.0449, 0.77]], 0.35);
  const L = new Float32Array(n);
  const R = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const c = drums[i] * 0.9 + bass[i] * 0.85;
    L[i] = c + keysL[i] + keysR[i] * 0.35 + padBus[i] + revL[i];
    R[i] = c + keysR[i] + keysL[i] * 0.35 + padBus[i] + revR[i];
  }
  // Fade awal dan akhir.
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const g = Math.min(1, t / 0.8) * Math.min(1, Math.max(0, (LEN - t) / 2.5));
    L[i] *= g;
    R[i] *= g;
  }
  // Soft clip ringan lalu normalisasi ke puncak -1,5 dBFS.
  for (let i = 0; i < n; i++) {
    L[i] = Math.tanh(L[i] * 0.9);
    R[i] = Math.tanh(R[i] * 0.9);
  }
  normalize(0.84, L, R);
  return [L, R];
};

// ---------- SFX ----------

const mono = (secs, fn) => Float32Array.from({length: Math.round(secs * SR)}, (_, i) => fn(i / SR, i));
const bell = (t, f, decay) => (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 6) + 0.2 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 12)) * Math.exp(-t * decay) * Math.min(1, t * 400);

const sfx = {
  whoosh: () => {
    const r = rng(1);
    let y = 0;
    return mono(0.8, (t) => {
      const k = t / 0.8;
      y += (0.02 + 0.3 * Math.sin(Math.PI * k)) * ((r() * 2 - 1) - y);
      return y * Math.sin(Math.PI * k) ** 1.5;
    });
  },
  swipe: () => {
    const r = rng(2);
    let y = 0;
    return mono(0.32, (t) => {
      const k = t / 0.32;
      y += (0.15 + 0.4 * k) * ((r() * 2 - 1) - y);
      return y * Math.sin(Math.PI * k) * 0.8;
    });
  },
  pop: () => mono(0.16, (t) => Math.sin(2 * Math.PI * (300 + 700 * Math.exp(-t * 40)) * t) * Math.exp(-t * 28) * Math.min(1, t * 2000)),
  tap: () => {
    const r = rng(3);
    return mono(0.06, (t) => ((r() * 2 - 1) * 0.5 + Math.sin(2 * Math.PI * 2200 * t)) * Math.exp(-t * 120));
  },
  ding: () => mono(1.3, (t) => bell(t, 1568, 4)),
  chime: () => mono(2.0, (t) => [1175, 1480, 1760, 2349].reduce((s, f, k) => s + (t > k * 0.08 ? bell(t - k * 0.08, f, 3.2) * 0.6 : 0), 0)),
  scan: () => mono(0.3, (t) => (t < 0.09 || (t > 0.14 && t < 0.23) ? Math.sin(2 * Math.PI * 1850 * t) * 0.7 : 0) * Math.min(1, (t % 0.14) * 300)),
  success: () => mono(1.2, (t) => bell(t, 880, 3.5) * 0.7 + (t > 0.11 ? bell(t - 0.11, 1175, 3) : 0)),
  // Suasana kampung: angin lembut + kicau burung sintetis.
  'ambience-kampung': () => {
    const r = rng(9);
    let y = 0;
    const chirps = Array.from({length: 14}, (_, k) => ({t: 0.3 + k * 0.48 + r() * 0.3, f: 2800 + r() * 1600, n: 2 + Math.floor(r() * 3)}));
    return mono(7.0, (t) => {
      y += 0.004 * ((r() * 2 - 1) - y);
      let s = y * 3.5 * (0.7 + 0.3 * Math.sin(t * 0.9));
      for (const c of chirps) {
        for (let j = 0; j < c.n; j++) {
          const tt = t - c.t - j * 0.09;
          if (tt > 0 && tt < 0.07) s += Math.sin(2 * Math.PI * (c.f + 900 * Math.sin(tt * 90)) * tt) * Math.sin((Math.PI * tt) / 0.07) * 0.22;
        }
      }
      return s * Math.min(1, t / 0.5) * Math.min(1, (7 - t) / 0.8);
    });
  },
  // Showcase produk (Scene 1): sub-drone, riser udara menuju hentakan lembut + kilau saat layar
  // menyala (1,93 dtk), lalu swell terang saat bloom menuju Scene 2.
  'studio-reveal': () => {
    const r = rng(11);
    const HIT = 1.93;
    const LEN_S = 6.2;
    let air = 0;
    let swell = 0;
    return mono(LEN_S, (t) => {
      const fadeOut = Math.min(1, (LEN_S - t) / 1.2);
      const drone = (Math.sin(2 * Math.PI * 55 * t) + 0.5 * Math.sin(2 * Math.PI * 82.5 * t) + 0.15 * Math.sin(2 * Math.PI * 110 * t)) * 0.3 * Math.min(1, t / 1.5) * (0.85 + 0.15 * Math.sin(t * 1.7));
      const n = r() * 2 - 1;
      // Riser: noise yang makin terang dan keras sampai HIT, lalu ekor pendek.
      const rk = t < HIT ? t / HIT : Math.exp(-(t - HIT) * 9);
      air += (0.01 + 0.25 * rk ** 2) * (n - air);
      const riser = air * 0.9 * rk ** 1.6;
      const dt = t - HIT;
      const thump = dt > 0 ? Math.sin(2 * Math.PI * (38 + 30 * Math.exp(-dt * 8)) * dt) * Math.exp(-dt * 3.5) * Math.min(1, dt * 600) * 0.9 : 0;
      const shimmer = dt > 0 ? [2349, 3136, 3520, 4699].reduce((s, f, k) => s + (dt > k * 0.06 ? bell(dt - k * 0.06, f, 2.2) * 0.12 : 0), 0) : 0;
      // Swell terang (4,6 dtk -> akhir) mengikuti bloom layar.
      const sk = Math.max(0, Math.min(1, (t - 4.6) / 1.4));
      swell += (0.03 + 0.2 * sk) * (n - swell);
      return (drone + riser + thump + shimmer) * fadeOut + swell * 0.6 * Math.sin((Math.PI * sk) / 1.15);
    });
  },
};

// `node scripts/buat-audio.mjs <nama-sfx>...` hanya membuat SFX tersebut (musik & SFX lain tidak ditulis ulang).
const only = process.argv.slice(2);

mkdirSync('assets/audio/music', {recursive: true});
mkdirSync('assets/audio/sfx', {recursive: true});
if (!only.length) {
  const [L, R] = music();
  writeFileSync('assets/audio/music/mihape-bgm.wav', wavStereo(L, R));
  console.log(`Musik: ${LEN.toFixed(1)} dtk, ${BPM.toFixed(2)} BPM, RMS ${(20 * Math.log10(rms(L))).toFixed(1)} dBFS`);
}
for (const [name, fn] of Object.entries(sfx)) {
  if (only.length && !only.includes(name)) continue;
  const s = fn();
  normalize(0.89, s);
  writeFileSync(`assets/audio/sfx/${name}.wav`, wavStereo(s, s));
}
console.log('SFX dibuat:', (only.length ? only : Object.keys(sfx)).join(', '));
