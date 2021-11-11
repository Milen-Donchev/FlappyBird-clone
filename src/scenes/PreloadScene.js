import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  preload() 
  {
    this.load.image('sky', 'assets/sky.png');
    this.load.spritesheet('bird', 'assets/birdSprite.png', {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image('pipe', 'assets/pipe.png');
    this.load.image('pause-button', 'assets/pause.png');
    this.load.image('back-button', 'assets/back.png');
  }

  create() 
  {
    this.scene.start('TitleScene');
  }
};

export default PreloadScene;