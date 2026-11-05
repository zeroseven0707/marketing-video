import React from 'react';
import {Composition, Folder} from 'remotion';
import './config/fonts';
import {MihapeCustomerAd, MihapeLaunchAd, MihapeMitraAd, ScenePreview} from './compositions/MihapeLaunchAd';
import {frames, videos} from './config/scenes';
import {video} from './config/theme';

const MAIN = {launch: MihapeLaunchAd, customer: MihapeCustomerAd, mitra: MihapeMitraAd} as const;
const FOLDER = {launch: 'Scenes', customer: 'Scenes-Pelanggan', mitra: 'Scenes-Mitra'} as const;

export const RemotionRoot: React.FC = () => (
  <>
    {(Object.keys(videos) as (keyof typeof videos)[]).map((key) => (
      <Composition key={key} id={videos[key].id} component={MAIN[key]} durationInFrames={videos[key].total} fps={video.fps} width={video.width} height={video.height} />
    ))}
    {(Object.keys(videos) as (keyof typeof videos)[]).map((key) => (
      <Folder key={key} name={FOLDER[key]}>
        {videos[key].scenes.map((s) => (
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
    ))}
  </>
);
