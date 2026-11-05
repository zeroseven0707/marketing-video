import React from 'react';
import {copy} from '../config/copy';
import type {SceneId} from '../config/scenes';
import {Scene01Opening} from './Scene01Opening';
import {Scene02Needs} from './Scene02Needs';
import {Scene03Intro} from './Scene03Intro';
import {Scene04Home} from './Scene04Home';
import {Scene05OrderFood} from './Scene05OrderFood';
import {Scene06Merchant} from './Scene06Merchant';
import {Scene07Driver} from './Scene07Driver';
import {Scene08Tracking} from './Scene08Tracking';
import {Scene09Complete} from './Scene09Complete';
import {Scene10Ecosystem} from './Scene10Ecosystem';
import {Scene11Closing} from './Scene11Closing';
import {SceneC01Hook} from './SceneC01Hook';
import {SceneC06Closing} from './SceneC06Closing';
import {SceneM01Hook} from './SceneM01Hook';
import {SceneM05Tools} from './SceneM05Tools';
import {SceneM06Closing} from './SceneM06Closing';

export const sceneComponents: Record<SceneId, React.FC> = {
  S01Opening: Scene01Opening,
  S02Needs: Scene02Needs,
  S03Intro: Scene03Intro,
  S04Home: Scene04Home,
  S05OrderFood: Scene05OrderFood,
  S06Merchant: Scene06Merchant,
  S07Driver: Scene07Driver,
  S08Tracking: Scene08Tracking,
  S09Complete: Scene09Complete,
  S10Ecosystem: Scene10Ecosystem,
  S11Closing: Scene11Closing,

  // Video pelanggan: scene UI launching dipakai ulang dengan copy pelanggan
  C01Hook: SceneC01Hook,
  C02Services: () => <Scene04Home headline={copy.C02.headline} highlight={[[1, 2]]} services={copy.C02.services} />,
  // hold 24 frame (0,8 dtk): callout tiga baris (ongkos, COD, non-tunai) sempat terbaca
  C03Order: () => <Scene05OrderFood headline={copy.C03.headline} highlight={[[1, 1]]} callout={copy.C03.callout} hold={24} />,
  C04Tracking: () => <Scene08Tracking headline={copy.C04.headline} highlight={[[1, 2]]} chips={copy.C04.chips} />,
  C05Complete: () => <Scene09Complete headline={copy.C05.headline} highlight={[[1, 0], [1, 1]]} sub={copy.C05.sub} />,
  C06Closing: SceneC06Closing,

  // Video mitra: satu alur pesanan, tanpa label terpisah "driver"/"toko"
  M01Hook: SceneM01Hook,
  M02Store: () => <Scene06Merchant kicker={null} headline={copy.M02.headline} highlight={[[2, 0], [2, 1]]} />,
  M03Driver: () => <Scene07Driver kicker={null} headline={copy.M03.headline} highlight={[[0, 1], [0, 2]]} />,
  M04Complete: () => <Scene09Complete headline={copy.M04.headline} highlight={[[1, 1], [1, 2]]} sub={copy.M04.sub} />,
  M05Tools: SceneM05Tools,
  M06Closing: SceneM06Closing,
};
