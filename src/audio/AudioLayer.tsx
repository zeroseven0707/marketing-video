import React from 'react';
import {Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {CLAMP} from '../animations/anim';
import {audioConfig as A, sfxCues} from '../config/audio';
import {frames, type SceneId} from '../config/scenes';

const fade = (f: number, total: number, inSec: number, outSec: number) =>
  interpolate(f, [0, Math.max(1, frames(inSec))], [0, 1], CLAMP) * interpolate(f, [total - Math.max(1, frames(outSec)), total], [1, 0], CLAMP);

const voiceActive = () => (A.voiceover.mode === 'single' ? Boolean(A.voiceover.src) : Object.keys(A.voiceover.perScene).length > 0);

// Musik latar dengan fade in/out dan ducking otomatis saat ada voice-over.
export const MusicTrack: React.FC<{startFromSec?: number}> = ({startFromSec = 0}) => {
  const {durationInFrames} = useVideoConfig();
  if (!A.music.src) return null;
  const base = A.music.volume * A.masterVolume * (voiceActive() ? A.music.duckWithVoiceover : 1);
  return <Audio src={staticFile(A.music.src)} startFrom={frames(startFromSec)} volume={(f) => base * fade(f, durationInFrames, A.music.fadeInSec, A.music.fadeOutSec)} />;
};

export const SingleVoiceover: React.FC = () => {
  if (A.voiceover.mode !== 'single' || !A.voiceover.src) return null;
  return (
    <Sequence from={frames(A.voiceover.offsetSec)} layout="none" name="Voice-over">
      <Audio src={staticFile(A.voiceover.src)} volume={(f) => A.voiceover.volume * A.masterVolume * interpolate(f, [0, frames(A.voiceover.fadeInSec) || 1], [0, 1], CLAMP)} />
    </Sequence>
  );
};

// SFX + voice-over per scene. `start` = frame awal scene di timeline induk.
export const SceneAudio: React.FC<{id: SceneId; start: number}> = ({id, start}) => (
  <>
    {A.sfx.enabled &&
      (sfxCues[id] ?? []).map((cue, i) => {
        const dur = frames(cue.dur ?? 2.5);
        const from = start + frames(cue.at);
        const trim = Math.max(0, -from);
        return (
          <Sequence key={i} from={Math.max(0, from)} durationInFrames={dur - trim} layout="none" name={`SFX ${id} ${cue.name}`}>
            <Audio
              src={staticFile(A.sfx.files[cue.name])}
              startFrom={trim}
              volume={(f) => (cue.volume ?? 1) * A.sfx.volume * A.masterVolume * interpolate(f, [dur - trim - frames(A.sfx.fadeOutSec), dur - trim], [1, 0], CLAMP)}
            />
          </Sequence>
        );
      })}
    {A.voiceover.mode === 'per-scene' && A.voiceover.perScene[id] && (
      <Sequence from={start + frames(A.voiceover.offsetSec)} layout="none" name={`VO ${id}`}>
        <Audio src={staticFile(A.voiceover.perScene[id]!)} volume={A.voiceover.volume * A.masterVolume} />
      </Sequence>
    )}
  </>
);
