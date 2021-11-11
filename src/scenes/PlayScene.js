import { times } from 'lodash';
import BaseScene from './BaseScene';

class PlayScene extends BaseScene {
  constructor() {
    super('PlayScene');
    this.pipes = null;
    this.bird = null;
    this.pauseButton = null;
    this.isPaused = false;
    this.score = 0;
    this.scoreText = '';
    this.bestScore = 0;
    this.PIPES_TO_RENDER = 4;
    this.PIPE_SPACING_RANGE = [150, 250];
    this.PIPE_DISTANCE_RANGE = [300, 350];
    this.INITIAL_BIRD_POSITION = [this.canvas.width * 0.05, this.canvas.height / 2];
    this.currentDifficulty = 'easy';
    this.difficulties = {
      'easy': {
        PIPE_SPACING_RANGE: [200, 220],
        PIPE_DISTANCE_RANGE: [350, 400]
      },
      'medium': {
        PIPE_SPACING_RANGE: [170, 200],
        PIPE_DISTANCE_RANGE: [320, 350]
      },
      'hard': {
        PIPE_SPACING_RANGE: [150, 180],
        PIPE_DISTANCE_RANGE: [270, 300]
      }
    }
  }

  create() 
  {
    this.currentDifficulty = 'easy';
    super.create();
    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPauseButton();
    this.handleInput();
    this.handleGlobalEvents();

    this.anims.create({
      key: 'birdFly',
      frames: this.anims.generateFrameNumbers('bird', {start: 8, end: 15}),
      frameRate: 8,
      repeat: -1
    });

    this.bird.play('birdFly');
  }

  update()
  {
    this.handleBirdOffscreen();
    this.recyclePipes();
  }

  createBird () {
    this.bird = this.physics.add.sprite(...this.INITIAL_BIRD_POSITION, 'bird')
    .setFlipX(true)
    .setScale(3)
    .setOrigin(0);
    this.bird.setBodySize(this.bird.width, this.bird.height - 8);
    this.bird.body.gravity.y = 600;
    this.bird.setCollideWorldBounds(true);
  }

  createPipes () {
    this.pipes = this.physics.add.group();

    for (let x = 0; x < this.PIPES_TO_RENDER; x++) {
      const upperPipe = this.createPipe([0, 1]);
      const lowerPipe = this.createPipe([0, 0]);
      this.renderPipe(upperPipe, lowerPipe);
    };
  
    this.pipes.setVelocityX(-200);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.handleGameOver, null, this);
  }

  createScore() {
    let bestScore = localStorage.getItem('best_score');
    this.score = 0;
    this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {...this.fontStyles, fontSize: '20px'});
    this.bestScore = this.add.text(20, 50, `Best Score: ${bestScore ?? 0}`, {fontSize: '15px', fill : '#fff'});
  };

  createPauseButton () {
    this.isPaused = false;
    this.pauseButton = this.add.image(this.canvas.width - 10, this.canvas.height - 10, 'pause-button')
    .setOrigin(1)
    .setInteractive()
    .setScale(3);

    this.pauseButton.on('pointerdown', function() {
        this.isPaused = true;
        this.physics.pause();
        this.scene.pause();
        this.scene.launch('PauseScene');
    }, this);
  }

  handleInput () {
    this.input.on('pointerdown', this.flapBird, this);
    this.input.keyboard.on('keydown-SPACE', this.flapBird, this);
  }

  handleGlobalEvents() {
    if (this.customResumeEvent) return;
    this.customResumeEvent = this.events.on('resume', function() {
      this.countdownNumber = 3;
      this.countdownText = this.add.text(...this.screenCenter, `Fly in: ${this.countdownNumber}`, this.fontStyles)
      .setOrigin(0.5);
      this.countdown = this.time.addEvent({
        delay: 1000,
        callback: this.handleResumeCountdown,
        callbackScope: this,
        loop: true
      })
    }, this);
  }

  handleResumeCountdown(){
    this.countdownNumber--;
    this.countdownText.setText(`Fly in: ${this.countdownNumber}`);
    if (this.countdownNumber <= 0) {
      this.isPaused = false;
      this.countdownText.setText('');
      this.physics.resume();
      this.countdown.remove();
    }
  };

  handleBirdOffscreen () {
    if (this.bird.y <= 0 || this.bird.getBounds().bottom >= this.canvas.height) {
      this.handleGameOver();
    }
  };

  recyclePipes () {
    const pipePair = [];
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().right <= 0) {
        pipePair.push(pipe);
        if (pipePair.length === 2) {
          this.renderPipe(...pipePair);
          this.increaseScore();
        }
      }
    })
  };


  createPipe (origin) {
    return this.pipes.create(0, 0, 'pipe')
    .setImmovable(true)
    .setOrigin(...origin);
  } 

  renderPipe (upper, lower) {
    const LAST_PIPE_X = this.getLastPipeX();
    const difficulty = this.difficulties[this.currentDifficulty];
    const PIPE_SPACING = Phaser.Math.Between(...difficulty.PIPE_SPACING_RANGE);
    const PIPE_Y_POSITION = Phaser.Math.Between(20, this.canvas.height - PIPE_SPACING - 20);
    const PIPE_X_POSITION = Phaser.Math.Between(...difficulty.PIPE_DISTANCE_RANGE) + LAST_PIPE_X;

    upper.x = PIPE_X_POSITION;
    upper.y = PIPE_Y_POSITION;
    lower.x = upper.x;
    lower.y = upper.y + PIPE_SPACING;
  };

  getLastPipeX () {
    let lastPipeX = 200;
    this.pipes.getChildren().forEach(pipe => {
      lastPipeX = Math.max(pipe.x, lastPipeX);
    });
    return lastPipeX;
  };
  
  flapBird () {
    if (!this.isPaused) {
      this.bird.body.velocity.y = -350;
    }
  };

  increaseScore () {
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
    const bestScore = localStorage.getItem('best_score');
    if (this.score >= bestScore) {
      this.bestScore.setText(`Best Score: ${this.score}`);
    }
    if (this.score === 5) this.increaseDifficulty('medium');
    if (this.score === 10) this.increaseDifficulty('hard');
  };

  increaseDifficulty (newDifficulty) {
    this.currentDifficulty = newDifficulty;
  };

  setBestScore () {
    const prevBestScore = localStorage.getItem('best_score');
    if (!prevBestScore || (prevBestScore && this.score > prevBestScore)){
      localStorage.setItem('best_score', this.score);
    };
  }
  
  handleGameOver () {
    this.physics.pause();
    this.bird.setTint(0xff0000);
    this.setBestScore();
    this.bird.stop();
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false
    })
  }
};

export default PlayScene;