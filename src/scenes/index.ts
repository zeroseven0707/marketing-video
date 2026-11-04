import type React from 'react';
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
};
