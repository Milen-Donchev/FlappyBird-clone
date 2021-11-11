import Phaser from 'phaser';

import { CANVAS } from '../constants/canvas';

class BaseScene extends Phaser.Scene {
  constructor(key, config){
    super(key, config);
    this.config = config;
    this.canvas = CANVAS;
    this.screenCenter = [CANVAS.width / 2, CANVAS.height / 2];
    this.fontStyles = {fontSize: '32px', fill: "#fff"};
    this.backButton = null;
  }

  create()
  {
    this.add.image(0, 0, 'sky').setOrigin(0);
    if (this.config?.canGoBack){
      this.createBackButton();
      this.createBackButtonHandler(this.config.backScene);
    }
  }

  createBackButton() {
    this.backButton = this.physics.add.sprite(CANVAS.width - 10, 10, 'back-button')
    .setScale(2)
    .setInteractive()
    .setOrigin(1, 0);
  };
  
  createBackButtonHandler(backScene) {
    this.backButton.on('pointerdown', function() {
      this.scene.start(backScene);
    }, this);
  }

  createMenu(menu, callback) {
    let lastMenuItemPositionY = 0;
    menu.forEach(menuItem => {
      const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuItemPositionY];
      menuItem.object = this.add.text(...menuPosition, menuItem.text, this.fontStyles)
      .setOrigin(0.5, 1);
      lastMenuItemPositionY += 40;
      callback(menuItem);
    });
  }
};

export default BaseScene;