import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {presentationFor} from '../animations/presentations';
import {EASE_INOUT} from '../animations/anim';
import {MusicTrack, SceneAudio, SingleVoiceover} from '../audio/AudioLayer';
import {frames, startOf, videos, type SceneId, type VideoKey} from '../config/scenes';
import {sceneComponents} from '../scenes';

// Satu video: scene tersambung lewat transisi yang saling tumpang (urutan & timing dari config/scenes.ts).
const AdVideo: React.FC<{video: VideoKey}> = ({video}) => {
  const v = videos[video];
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <TransitionSeries>
        {v.scenes.flatMap((s) => {
          const Comp = sceneComponents[s.id];
          const items = [
            <TransitionSeries.Sequence key={s.id} durationInFrames={frames(s.durationSec)} name={s.id}>
              <Comp />
            </TransitionSeries.Sequence>,
          ];
          if (s.transitionOut) {
            items.push(
              <TransitionSeries.Transition
                key={`${s.id}-t`}
                presentation={presentationFor(s.transitionOut.kind, s.transitionOut.origin)}
                timing={linearTiming({durationInFrames: frames(s.transitionOut.sec), easing: EASE_INOUT})}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      {v.starts.map((s) => (
        <SceneAudio key={s.id} id={s.id} start={s.start} />
      ))}
      <MusicTrack />
      {/* audioConfig.voiceover berisi rekaman naskah video launching */}
      {video === 'launch' && <SingleVoiceover />}
    </AbsoluteFill>
  );
};

// Video launching (gabungan): 60 detik, 11 scene.
export const MihapeLaunchAd: React.FC = () => <AdVideo video="launch" />;
// Video pelanggan: 30 detik.
export const MihapeCustomerAd: React.FC = () => <AdVideo video="customer" />;
// Video rekrut mitra (driver + toko): 30 detik.
export const MihapeMitraAd: React.FC = () => <AdVideo video="mitra" />;

// Pratinjau satu scene (audio SFX scene + musik pada posisi yang sama dengan videonya).
export const ScenePreview: React.FC<{sceneId: SceneId}> = ({sceneId}) => {
  const Comp = sceneComponents[sceneId];
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Comp />
      <SceneAudio id={sceneId} start={0} />
      <MusicTrack startFromSec={startOf(sceneId) / 30} />
    </AbsoluteFill>
  );
};
