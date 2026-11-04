import React from 'react';
import {AbsoluteFill} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {presentationFor} from '../animations/presentations';
import {EASE_INOUT} from '../animations/anim';
import {MusicTrack, SceneAudio, SingleVoiceover} from '../audio/AudioLayer';
import {frames, sceneStarts, scenes, type SceneId} from '../config/scenes';
import {sceneComponents} from '../scenes';

// Video utama: 11 scene tersambung lewat transisi yang saling tumpang.
export const MihapeLaunchAd: React.FC = () => (
  <AbsoluteFill style={{background: '#fff'}}>
    <TransitionSeries>
      {scenes.flatMap((s) => {
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
    {sceneStarts.map((s) => (
      <SceneAudio key={s.id} id={s.id} start={s.start} />
    ))}
    <MusicTrack />
    <SingleVoiceover />
  </AbsoluteFill>
);

// Pratinjau satu scene (audio SFX scene + musik pada posisi yang sama dengan video utama).
export const ScenePreview: React.FC<{sceneId: SceneId}> = ({sceneId}) => {
  const Comp = sceneComponents[sceneId];
  const start = sceneStarts.find((s) => s.id === sceneId)!.start;
  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <Comp />
      <SceneAudio id={sceneId} start={0} />
      <MusicTrack startFromSec={start / 30} />
    </AbsoluteFill>
  );
};
