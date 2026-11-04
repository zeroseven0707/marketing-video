import React from 'react';
import {safe} from '../../config/theme';
import {Kicker, WordReveal} from './Kinetic';

// Blok judul standar: kicker opsional + beberapa baris yang masuk kata demi kata.
// `highlight` berisi pasangan [baris, kata] yang diberi gradien merek.
export const Headline: React.FC<{
  lines: readonly string[];
  kicker?: string;
  delay?: number;
  exitAt?: number;
  size?: number;
  top?: number;
  align?: 'left' | 'center';
  highlight?: [number, number][];
  dark?: boolean;
}> = ({lines, kicker, delay = 4, exitAt, size = 84, top = safe.top, align = 'left', highlight = [], dark}) => {
  let wordCount = 0;
  return (
    <div style={{position: 'absolute', left: safe.side, right: safe.side, top, display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 6}}>
      {kicker && <Kicker text={kicker} delay={delay} exitAt={exitAt} dark={dark} style={{marginBottom: 22}} />}
      {lines.map((line, li) => {
        const d = delay + (kicker ? 6 : 0) + wordCount * 3;
        wordCount += line.split(' ').length;
        return (
          <WordReveal
            key={li}
            text={line}
            delay={d}
            exitAt={exitAt}
            size={size}
            align={align}
            color={dark ? '#fff' : undefined}
            highlight={highlight.filter(([l]) => l === li).map(([, w]) => w)}
          />
        );
      })}
    </div>
  );
};
