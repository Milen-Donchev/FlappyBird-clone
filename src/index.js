import Phaser from "phaser";

import PreloadScene from "./scenes/PreloadScene";
import PlayScene from "./scenes/PlayScene";
import TitleScene from "./scenes/TitleScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";

import { CANVAS } from './constants/canvas';

const scene = [PreloadScene, TitleScene, ScoreScene, PlayScene, PauseScene];

new Phaser.Game({
  ...CANVAS,
  pixelArt: true,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade'
  },
  scene
});
