createPlayer = function(scene) {
    // Add the player sprite
    scene.player = scene.physics.add.sprite(-33, config.height - 64, "player-run");
    scene.player.setScale(2);
    scene.player.play("player-run_anim");
    scene.player.depth = 1;

    // Enable physics on the player
    scene.physics.world.enable(scene.player);
    scene.player.body.gravity.y = gameSettings.playerGravity;

    // Player intro animation
    scene.tweens.add({
        targets: scene.player,
        x: 200,
        duration: 1000,
        ease: 'Power1',
        repeat: 0
    });

    // Starting monologue
    scene.time.delayedCall(1000, function() {
        scene.player.play("player-idle_anim");

        playerSpeak(scene, "Oh no! I'm late for school!\nI need to get there fast!");

        scene.time.delayedCall(6000, function() {
            playerSpeak(scene, "I hope I won't run into too many\nanimals with math questions again!", 6000);
            scene.unpauseGame();
            scene.bgmSound.play();
        }, [], scene);
    }, [], scene);
}

playerJump = function(scene) {
    if (scene.player.body.touching.down) {
        scene.player.setVelocityY(-gameSettings.playerJumpHeight);
        scene.player.play("player-jump_anim");
        scene.jumpSound.play();
        scene.time.delayedCall(1200, function() {
            scene.player.play(scene.gamePaused ? "player-idle_anim" : "player-run_anim");
        }, [], scene);
    }
}

playerHurt = function(scene, scorePenalty = 0) {
    scene.penalty += scorePenalty;
    if (scene.score - scene.penalty < 0) {
        scene.penalty = scene.score;
    }
    scene.updateScoreLabel();
    scene.player.play("player-hurt_anim");
    scene.hurtSound.play();
    scene.player.setVelocityY(-gameSettings.playerJumpHeight);
    scene.time.delayedCall(1200, function() {
        scene.player.play(scene.gamePaused ? "player-idle_anim" : "player-run_anim");
    }, [], scene);
}

playerSpeak = function(scene, text, duration = 5000, fadeInSpeed = 1000, fadeOutSpeed = 500) {
    scene.playerText = scene.add.bitmapText(225, config.height - 79, "pixelFont", text, 24);
    scene.playerText.alpha = 0;
    
    // Fade in
    scene.tweens.add({
        targets: scene.playerText,
        alpha: 1,
        duration: fadeInSpeed,
        ease: 'Bounce',
        repeat: 0
    });

    // Fade out
    scene.tweens.add({
        targets: scene.playerText,
        alpha: 0,
        duration: fadeOutSpeed,
        ease: 'Power4',
        repeat: 0,
        delay: duration
    });
}

playerPause = function(scene) {
    scene.pauseGame();
    scene.pauseSound.play();

    var gamePausedText = scene.add.bitmapText(config.width / 2 - 100, 50, "pixelFont", "GAME PAUSED", 48);
    gamePausedText.tint = 0x000000;

    var unpauseText = scene.add.bitmapText(config.width / 2 - 80, 90, "pixelFont", "Click/Tap to resume", 24);
    unpauseText.alpha = 0;
    unpauseText.tint = 0x000000;

    scene.time.delayedCall(1000, function() {
        scene.tweens.add({
            targets: unpauseText,
            alpha: 1,
            duration: 1500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1,
            autoStart: true
        });

        scene.input.on('pointerdown', function(pointer) {
            scene.unpauseGame();
            scene.unpauseSound.play();
            gamePausedText.destroy();
            unpauseText.destroy();
            scene.input.removeAllListeners();
        }, scene);
    }, [], scene);
}

playerPointGain = function(scene, points) {
    var pointsText = scene.add.bitmapText(scene.player.x, scene.player.y, "pixelFont", (points > 0 ? "+" : "") + points, 24);
    pointsText.tint = points > 0 ? 0x00ff00 : 0xff0000;
    pointsText.alpha = 0;

    // Fade in
    scene.tweens.add({
        targets: pointsText,
        alpha: 1,
        y: pointsText.y - 50,
        fontSize: 36,
        duration: 1000,
        ease: 'Bounce',
        repeat: 0,
    });

    // Fade out
    scene.tweens.add({
        targets: pointsText,
        alpha: 0,
        y: pointsText.y + 50,
        fontSize: 24,
        duration: 1000,
        ease: 'Power4',
        repeat: 0,
        delay: 3000
    });
}