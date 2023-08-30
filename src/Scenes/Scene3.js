class Scene3 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        this.gamePaused = true;
        this.timePassed = 0;
        this.score = 0;
        this.penalty = 0;
        this.platformsSpawned = 1;
        this.lastEnemyNames = [];
        this.lastEnemySpawned = "";

        this.questions = Phaser.Utils.Array.Shuffle(this.cache.json.get("questions_" + gameSettings.language));
        this.questionsIndex = 0;

        this.background = this.add.tileSprite(0, 0, config.width, config.height, 'background');
        this.middleground = this.add.tileSprite(0, 120, config.width, config.height, 'middleground');
        setTileSpriteRepeating(this.background);
        setTileSpriteRepeating(this.middleground);

        this.props = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.items = this.physics.add.group();
        this.platformPool = this.add.group();

        this.createSounds();
        this.createTopBar();
        createPlayer(this);

        createFirstPlatform(this);
        addPlatform(this);
        addPlatform(this);

        addRandomProps(this, 0, 50, 10, ["bush"]);

        /* this.physics.add.collider(this.player, this.items, function(player, item) {
            item.pickedUp(player);
        }); */
        this.physics.add.overlap(this.player, this.items, function(player, item) {
            item.pickedUp(player);
        });
    }

    update() {
        if (this.player.y > config.height - 24) {
            this.gameOver();
        }

        if (this.gamePaused) { 
            return;
        }

        // score keeping
        this.timePassed += 1;
        if (this.timePassed % 10 == 0) {
            this.score = Math.floor(this.timePassed * gameSettings.scorePerSecond / 60);
            this.updateScoreLabel();
        }

        // move the background
        this.background.tilePositionX += gameSettings.playerSpeed * 0.5;
        this.background.tilePositionY = Math.sin(this.background.tilePositionX / 100);
        this.middleground.tilePositionX += gameSettings.playerSpeed * 1.5;

        // jump if spacebar is pressed
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
            playerJump(this);
        }

        // remove first platform if it's off screen
        var firstPlatform = this.platformPool.getChildren()[0];
        if (firstPlatform.getChildren()[firstPlatform.getChildren().length - 1].x < -64) {
            this.platformPool.remove(firstPlatform);
            addPlatform(this);

            // clean up props
            for (var i = 0; i < this.props.getChildren().length; i++) {
                var prop = this.props.getChildren()[i];
                if (prop.x < -100) {
                    this.props.remove(prop);
                    prop.destroy();
                }
            }
        }

        // update enemies
        for (var i = 0; i < this.enemies.getChildren().length; i++) {
            var enemy = this.enemies.getChildren()[i];
            enemy.update();
        }

        // update items
        for (var i = 0; i < this.items.getChildren().length; i++) {
            var item = this.items.getChildren()[i];
            item.update();
        }
    }

    createSounds() {
        this.jumpSound = this.sound.add("audio_jump", sfxConfig);
        this.hurtSound = this.sound.add("audio_hurt", sfxConfig);
        this.cherrySound = this.sound.add("audio_cherry", sfxConfig);
        this.gemSound = this.sound.add("audio_gem", sfxConfig);
        this.correctSound = this.sound.add("audio_correct", sfxConfig);
        this.wrongSound = this.sound.add("audio_wrong", sfxConfig);
        this.pauseSound = this.sound.add("audio_pause", sfxConfig);
        this.unpauseSound = this.sound.add("audio_unpause", sfxConfig);
        this.bgmSound = this.sound.add("audio_bgm", musicConfig);
    }

    createTopBar() {
        this.topBar = this.add.graphics();
        this.topBar.alpha = 0;
        this.topBar.fillStyle(0x000000, 1);
        this.topBar.beginPath();
        this.topBar.moveTo(0,0);
        this.topBar.lineTo(config.width, 0);
        this.topBar.lineTo(config.width, 40);
        this.topBar.lineTo(0, 40);
        this.topBar.lineTo(0, 0);
        this.topBar.closePath();
        this.topBar.fillPath();

        this.scoreLabel = this.add.bitmapText(10, 12, "pixelFont", "SCORE: 000000", 24); 
        this.scoreLabel.alpha = 0; 
        this.scoreLabel.tint = 0xFFFFFF;
        this.scoreLabel.depth = 2;

        this.jumpButton = this.add.bitmapText(config.width - 100, 10, "pixelFont", "JUMP", 36);
        this.jumpButton.alpha = 0;
        this.jumpButton.tint = 0xFFFFFF;
        this.jumpButton.depth = 2;
        this.jumpButton.setInteractive();
        this.jumpButton.on('pointerdown', function(pointer) {
            playerJump(this);
        }, this);

        this.pauseButton = this.add.bitmapText(config.width - 220, 10, "pixelFont", "PAUSE", 36);
        this.pauseButton.alpha = 0;
        this.pauseButton.tint = 0xFFFFFF;
        this.pauseButton.depth = 2;
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', function(pointer) {
            if (!this.gamePaused) {
                playerPause(this);
            }
        }, this);
    }

    showTopBar() {
        this.tweens.add({
            targets: this.topBar,
            alpha: 0.5,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.scoreLabel,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.jumpButton,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.pauseButton,
            alpha: 1,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
    }

    hideTopBar() {
        this.tweens.add({
            targets: this.scoreLabel,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.topBar,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.jumpButton,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
        this.tweens.add({
            targets: this.pauseButton,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            repeat: 0
        });
    }

    zeroPad(number, size) {
        var stringNumber = String(number);
        while(stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    updateScoreLabel() {
        var labelText = this.score - this.penalty < 0 ? 0 : this.score - this.penalty;
        this.scoreLabel.text = "SCORE: " + this.zeroPad(labelText, 6);
    }

    pauseGame() {
        this.gamePaused = true;
        this.hideTopBar();

        for (var i = 0; i < this.platformPool.getChildren().length; i++) {
            this.platformPool.getChildren()[i].setVelocityX(0);
        }
        this.props.setVelocityX(0);
        this.enemies.setVelocityX(0);
        this.items.setVelocityX(0);

        this.player.play("player-idle_anim");
    }

    unpauseGame() {
        this.gamePaused = false;
        this.showTopBar();

        for (var i = 0; i < this.platformPool.getChildren().length; i++) {
            this.platformPool.getChildren()[i].setVelocityX(-gameSettings.playerSpeed * 200);
        }
        this.props.setVelocityX(-gameSettings.playerSpeed * 200);
        this.enemies.setVelocityX(-gameSettings.playerSpeed * 200);
        this.items.setVelocityX(-gameSettings.playerSpeed * 200);
        
        this.player.play("player-run_anim");
    }

    gameOver() {
        this.pauseGame();

        this.time.delayedCall(2000, function() {
            var title = this.add.bitmapText(config.width / 2 - 84, 50, "pixelFont", "GAME OVER", 48);
            title.tint = 0x000000;

            var restartLabel = this.add.bitmapText(config.width / 2 - 80, 90, "pixelFont", "Click/Tap to restart", 24);
            restartLabel.alpha = 0;
            restartLabel.tint = 0x000000;

            this.showScoreLabel(false);
            
            this.player.body.enable = false;
            this.player.body.gravity.y = 0;
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);

            this.time.delayedCall(1000, function() {
                this.tweens.add({
                    targets: restartLabel,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: -1
                });

                this.input.on('pointerdown', function(pointer) {
                    this.bgmSound.stop();
                    title.destroy();
                    restartLabel.destroy();
                    this.input.removeAllListeners();
                    this.scene.start("playGame");
                }, this);
            }, [], this);
        }, [], this);        
    }

    gameWin() {
        if (!this.gamePaused) {
            this.pauseGame();
        }
        
        this.time.delayedCall(2000, function() {
            var title = this.add.bitmapText(config.width / 2 - 84, 50, "pixelFont", "YOU WIN!", 48);
            title.tint = 0x000000;

            var restartLabel = this.add.bitmapText(config.width / 2 - 90, 90, "pixelFont", "Click/Tap to restart", 24);
            restartLabel.alpha = 0;
            restartLabel.tint = 0x000000;

            this.showScoreLabel(true);

            this.player.body.enable = false;
            this.player.body.gravity.y = 0;
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);

            this.time.delayedCall(1000, function() {
                this.tweens.add({
                    targets: restartLabel,
                    alpha: 1,
                    duration: 1500,
                    ease: 'Power2',
                    yoyo: true,
                    repeat: -1
                });

                this.input.on('pointerdown', function(pointer) {
                    this.bgmSound.stop();
                    title.destroy();
                    restartLabel.destroy();
                    this.input.removeAllListeners();
                    this.scene.start("playGame");
                }, this);
            }, [], this);
        }, [], this);
    }

    showScoreLabel(isWin) {
        var scoreLabel = this.add.bitmapText(config.width / 2 - 88, 130, "pixelFont", "SCORE: " + this.zeroPad((this.score - this.penalty), 6), 36);
        if (isWin) {
            scoreLabel.x -= 10;
        }
        scoreLabel.tint = 0x000000;
        scoreLabel.alpha = 1;
        scoreLabel.depth = 2;
    }
}