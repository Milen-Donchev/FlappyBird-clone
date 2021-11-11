import BaseScene from "./BaseScene";

class TitleScene extends BaseScene {
  constructor() {
    super('TitleScene')

    this.menu = [
      {scene: 'PlayScene', text: 'Play'},
      {scene: 'ScoreScene', text: 'Score'},
      {scene: null, text: 'Exit'},
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
        menuItem.scene ? 
        this.scene.start(menuItem.scene) :
        this.game.destroy(true);
    }, this);
  }
};

export default TitleScene;