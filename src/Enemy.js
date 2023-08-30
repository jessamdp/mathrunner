spawnEnemy = function(scene, platform) {
    if (gameSettings.enemySpawnChance < Phaser.Math.Between(1, 100)) {
        return;
    }
    var platformLength = platform.getChildren().length;
    var lastBlock = platform.getChildren()[platformLength - 1];
    
    var enemyNames = ["enemy-eagle", "enemy-possum", "enemy-frog-jump"];
    var enemyName = enemyNames[Phaser.Math.Between(0, enemyNames.length - 1)];
    
    // check if enemyName is in scene.lastEnemyNames array
    if (scene.lastEnemyNames.includes(enemyName)) {
        // if so, remove it from the array
        var temp = enemyNames;
        // remove all instances of scene.lastEnemyNames from temp
        for (var i = 0; i < scene.lastEnemyNames.length; i++) {
            temp = temp.filter(function(value, index, arr){ return value != scene.lastEnemyNames[i];});
        }
        // if temp is empty, all enemies have been spawned, so reset scene.lastEnemyNames
        if (temp.length == 0) {
            scene.lastEnemyNames = [];
            enemyName = enemyNames[Phaser.Math.Between(0, enemyNames.length - 1)];
            if (enemyName == scene.lastEnemySpawned) {
                temp = enemyNames;
                temp = temp.filter(function(value, index, arr){ return value != enemyName;});
                enemyName = temp[Phaser.Math.Between(0, temp.length - 1)];
            }
        }
        // otherwise, set enemyName to a random value from temp
        else {
            enemyName = temp[Phaser.Math.Between(0, temp.length - 1)];
        }
    }
    // add enemyName to scene.lastEnemyNames
    scene.lastEnemyNames.push(enemyName);
    scene.lastEnemySpawned = enemyName;

    // set enemyY based on enemyName
    var enemyY = config.height;
    switch (enemyName) {
        case "enemy-eagle":
            enemyY -= 100;
            break;
        case "enemy-frog-jump":
            enemyY -= 64;
            break;
        case "enemy-possum":
            enemyY -= 60;
            break;
    }

    // spawn enemy and add it to scene.enemies
    var enemy = new Enemy(scene, lastBlock.x - 50, enemyY, enemyName);
    scene.enemies.add(enemy);
    enemy.body.setVelocityX(scene.gamePaused ? 0 : -gameSettings.playerSpeed * 200);
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemyName) {
        super(scene, x, y, enemyName);
        this.scene = scene;
        this.spottedPlayer = false;
        this.enemyName = enemyName;
        
        this.play(enemyName + "_anim");
        this.setScale(2);

        this.scene.add.existing(this);
    }

    update() {
        if (this.x - this.scene.player.x < config.width - 250) {
            this.spotPlayer();
        }
    }

    spotPlayer() {
        if (this.spottedPlayer) {
            return;
        }
        this.spottedPlayer = true;
        
        // enemy spotted player
        this.scene.pauseGame();
        
        this.scene.tweens.add({
            targets: this,
            x: 300,
            duration: 1500,
            ease: 'Linear',
            repeat: 0,
            onComplete: () => {
                // enemy arrived at player
                if (this.enemyName == "enemy-frog-jump") {
                    this.y = config.height - 54;
                    this.play("enemy-frog-idle_anim");
                }
                this.askQuestion();
            }
        });
    }

    askQuestion() {
        var question = this.scene.questions[this.scene.questionsIndex];   
        var textColor = "#FFFFFF";
        var textSize = 18;

        var questionBackground = this.scene.add.graphics();
        questionBackground.alpha = 0;
        questionBackground.fillStyle(0x000000, 1);
        questionBackground.beginPath();
        questionBackground.moveTo(5, 5);
        questionBackground.lineTo(config.width - 5, 5);
        questionBackground.lineTo(config.width - 5, 220);
        questionBackground.lineTo(5, 220);
        questionBackground.lineTo(5, 5);
        questionBackground.alpha = 0;
        questionBackground.closePath();
        questionBackground.fillPath();
        this.scene.tweens.add({
            targets: questionBackground,
            alpha: 0.5,
            duration: 1000,
            ease: 'Power4',
            repeat: 0
        });

        var questionText = this.scene.add.text(config.width / 2, 35, question["question"], {fontFamily: "Arial", fontSize: textSize + 6, color: textColor, fontStyle: "bold", align: "center"});
        // make bold
        questionText.setOrigin(0.5, 0.5);
        questionText.depth = 2;
        questionText.alpha = 0;
        this.scene.tweens.add({
            targets: questionText,
            alpha: 1,
            duration: 1000,
            ease: 'Power4',
            repeat: 0
        });

        var answers = Phaser.Utils.Array.Shuffle(question["wrong"].concat([question["correct"]]));

        var answerLabel1 = this.scene.add.text(config.width / 2, 90, "A) " + answers[0], {fontFamily: "Arial", fontSize: textSize, color: textColor, fontStyle: "bold"});
        answerLabel1.setOrigin(0.5, 0.5);
        answerLabel1.depth = 2;
        answerLabel1.alpha = 0;
        this.scene.tweens.add({
            targets: answerLabel1,
            alpha: 1,
            duration: 1000,
            ease: 'Power4',
            repeat: 0
        });    

        var answerLabel2 = this.scene.add.text(config.width / 2, 125, "B) " + answers[1], {fontFamily: "Arial", fontSize: textSize, color: textColor, fontStyle: "bold"});
        answerLabel2.setOrigin(0.5, 0.5);
        answerLabel2.depth = 2;
        answerLabel2.alpha = 0;
        this.scene.tweens.add({
            targets: answerLabel2,
            alpha: 1,
            duration: 1000,
            ease: 'Power4',
            repeat: 0
        });

        var answerLabel3 = this.scene.add.text(config.width / 2, 160, "C) " + answers[2], {fontFamily: "Arial", fontSize: textSize, color: textColor, fontStyle: "bold"});
        answerLabel3.setOrigin(0.5, 0.5);
        answerLabel3.depth = 2;
        answerLabel3.alpha = 0;
        this.scene.tweens.add({
            targets: answerLabel3,
            alpha: 1,
            duration: 1000,
            ease: 'Power4',
            repeat: 0
        });
        
        var answerLabel4 = this.scene.add.text(config.width / 2, 195, "D) " + answers[3], {fontFamily: "Arial", fontSize: textSize, color: textColor, fontStyle: "bold"});
        answerLabel4.setOrigin(0.5, 0.5);
        answerLabel4.depth = 2;
        answerLabel4.alpha = 0;
        this.scene.tweens.add({
            targets: answerLabel4,
            alpha: 1,
            duration: 5000,
            ease: 'Power4',
            repeat: 0
        });

        answerLabel1.setInteractive();
        answerLabel1.on('pointerdown', (pointer) => {
            this.leavePlayer(answerLabel1.text.substring(3) == question["correct"]);
            questionBackground.destroy();
            questionText.destroy();
            answerLabel1.destroy();
            answerLabel2.destroy();
            answerLabel3.destroy();
            answerLabel4.destroy();
        }, this);

        answerLabel2.setInteractive();
        answerLabel2.on('pointerdown', (pointer) => {
            this.leavePlayer(answerLabel2.text.substring(3) == question["correct"]);
            questionBackground.destroy();
            questionText.destroy();
            answerLabel1.destroy();
            answerLabel2.destroy();
            answerLabel3.destroy();
            answerLabel4.destroy();
        }, this);

        answerLabel3.setInteractive();
        answerLabel3.on('pointerdown', (pointer) => {
            this.leavePlayer(answerLabel3.text.substring(3) == question["correct"]);
            questionBackground.destroy();
            questionText.destroy();
            answerLabel1.destroy();
            answerLabel2.destroy();
            answerLabel3.destroy();
            answerLabel4.destroy();
        }, this);

        answerLabel4.setInteractive();   
        answerLabel4.on('pointerdown', (pointer) => {
            this.leavePlayer(answerLabel4.text.substring(3) == question["correct"]);
            questionBackground.destroy();
            questionText.destroy();
            answerLabel1.destroy();
            answerLabel2.destroy();
            answerLabel3.destroy();
            answerLabel4.destroy();
        }, this);
    }

    leavePlayer(isAnswerCorrect) {
        if (isAnswerCorrect) {
            this.scene.correctSound.play();
            this.scene.penalty -= gameSettings.questionBonus;
        } else {
                this.scene.wrongSound.play();
                this.scene.time.delayedCall(1000, () => {                        
                    playerHurt(this.scene, gameSettings.questionPenalty);
                }, null, this);
        }

        playerPointGain(this.scene, isAnswerCorrect ? gameSettings.questionBonus : -gameSettings.questionPenalty);

        this.scene.time.delayedCall(3000, () => {
            // enemy leaving
            if (this.enemyName == "enemy-frog-jump") {
                this.y = config.height - 64;
                this.play("enemy-frog-jump_anim");
            }
            this.scene.tweens.add({
                targets: this,
                x: -100,
                duration: 1000,
                ease: 'Linear',
                repeat: 0,
                onComplete: () => {
                    this.scene.questionsIndex++;
                    this.scene.enemies.remove(this);
                    this.scene.time.delayedCall(1000, () => {
                        this.destroy();
                    }, null, this);
                }
            });
            
            if (this.scene.questionsIndex >= this.scene.questions.length - 1) {
                for (var i = 1; i < this.scene.enemies.getChildren().length; i++) {
                    this.scene.enemies.getChildren()[i].destroy();
                }
                this.scene.gameWin();
                return;
            }
            this.scene.unpauseGame();
        }, null, this);
    }    
}