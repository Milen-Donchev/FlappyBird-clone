import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
  constructor() {
    super('PauseScene')

    this.menu = [
      {scene: 'PlayScene', text: 'Continue'},
      {scene: 'TitleScene', text: 'Exit'},
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.handleMenuItem.bind(this));
  }

  handleMenuItem (menuItem) {
    const gameObject = menuItem.object;
    gameObject.setInteractive();

    gameObject.on('pointerover', function() {
      gameObject.setStyle({fill: '#000'});
    });

    gameObject.on('pointerout', function() {
      gameObject.setStyle({fill: '#fff'});
    });

    gameObject.on('pointerup', function() {
       if (menuItem.scene && menuItem.text === 'Continue'){
         this.scene.stop();
         this.scene.resume(menuItem.scene);
       } else {
         this.scene.stop('PlayScene');
         this.scene.start(menuItem.scene);
       }
    }, this);
  }
};

export default PauseScene;