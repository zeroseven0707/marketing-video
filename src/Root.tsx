import React from 'react';
import {Composition, Folder} from 'remotion';
import './config/fonts';
import {MihapeLaunchAd, ScenePreview} from './compositions/MihapeLaunchAd';
import {frames, scenes, totalFrames} from './config/scenes';
import {video} from './config/theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MihapeLaunchAd" component={MihapeLaunchAd} durationInFrames={totalFrames} fps={video.fps} width={video.width} height={video.height} />
    <Folder name="Scenes">
      {scenes.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={ScenePreview}
          defaultProps={{sceneId: s.id}}
          durationInFrames={frames(s.durationSec)}
          fps={video.fps}
          width={video.width}
          height={video.height}
        />
      ))}
    </Folder>
  </>
);
