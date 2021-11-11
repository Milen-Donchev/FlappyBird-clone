import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {
  constructor(){
    super('ScoreScene', {canGoBack: true, backScene: 'TitleScene'});
    this.bestScore = localStorage.getItem('best_score');
    this.bestScoreText = 'No best score';
    this.backButton = null;
  }

  create() {
    super.create();
    this.createBestScore();
  }

  createBestScore() {
    if (this.bestScore) this.bestScoreText = `Best Score: ${this.bestScore}`;
    this.add.text(...this.screenCenter, this.bestScoreText, this.fontStyles).setOrigin(0.5, 1);
  }
};

export default ScoreScene;