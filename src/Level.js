setTileSpriteRepeating = function(tilesprite) {
    tilesprite.fixedToCamera = true;
    tilesprite.setOrigin(0, 0);
    tilesprite.setDepth(-100);
}

createBackgrounds = function(scene) {
    scene.background = scene.add.tileSprite(0, 0, config.width, config.height, 'background');
    scene.middleground = scene.add.tileSprite(0, 120, config.width, config.height, 'middleground');        
    setTileSpriteRepeating(scene.background);
    setTileSpriteRepeating(scene.middleground);
}

createPlatform = function(scene, length, startingX = 0, physicsEnabled = true) {
    var platform = physicsEnabled ? scene.physics.add.group() : scene.add.group();
    var blockWidth = 32;
    for (var i = 0; i < length; i++) {
        var block = platform.create(i * blockWidth + startingX, scene.game.config.height - 15, "grass" + Phaser.Math.Between(1, 3));
        block.setScale(2);
        if (Phaser.Math.Between(0, 1) == 1) {
            block.flipX = true;
        }
        if (physicsEnabled) {
            scene.physics.world.enable(block);
            block.body.immovable = true;
        }
    }
    if (physicsEnabled) {
        scene.physics.add.collider(scene.player, platform);
    }
    return platform;
}

createProp = function(scene, propName, positionX) {
    var positionY = config.height;
    var scale = 1.5;
    switch (propName) {
        case "bush":
            positionY -= 46;
            scale = 1;
            break;
        case "palm":
            positionY -= 164;
            break;
        case "pine":
            positionY -= 130;
            break;
        case "plant-house":
            positionY -= 109;
            break;
        case "rock":
            positionY -= 43;
            break;
        case "shrooms":
            positionY -= 40;
            scale = 1;
            break;
        case "straw-house":
            positionY -= 104;
            break;
        case "tree":
            positionY -= 102;
            break;
        case "tree2":
            positionY -= 115;
            break;
        case "tree-house":
            positionY -= 140;
            break;
        case  "wooden-house":
            positionY -= 106;
            break;
    }

    var prop = scene.physics.add.image(positionX, positionY, propName);
    prop.setScale(scale);
    scene.props.add(prop);
    return prop;
}

decoratePlatform = function(scene, platform) {
    var platformLength = platform.getChildren().length;
    var platformX = platform.getChildren()[0].x;

    var maxHouses = gameSettings.propDensity * Math.floor(platformLength / 20);
    var maxBushes = gameSettings.propDensity * Math.floor(platformLength / 10);
    var maxRocks = gameSettings.propDensity * Math.floor(platformLength / 15);
    var maxTrees = gameSettings.propDensity * Math.floor(platformLength / 10);
    var maxShrooms = gameSettings.propDensity * Math.floor(platformLength / 15);

    addRandomProps(scene, platformX, platformLength, maxTrees, ["pine", "palm", "tree", "tree2"]);
    addRandomProps(scene, platformX, platformLength, maxHouses, ["plant-house", "straw-house", "tree-house", "wooden-house"]);
    addRandomProps(scene, platformX, platformLength, maxBushes, ["bush"]);
    addRandomProps(scene, platformX, platformLength, maxRocks, ["rock"]);
    addRandomProps(scene, platformX, platformLength, maxShrooms, ["shrooms"]);    
    
    scene.props.setVelocityX(scene.gamePaused ? 0 : -gameSettings.playerSpeed * 200);
}

addPlatform = function(scene) {
    scene.platformsSpawned += 1;

    // get the last platform's last block's x position and add a random amount to it
    var lastPlatform = scene.platformPool.getChildren()[scene.platformPool.getChildren().length - 1];
    var nextPlatformX = lastPlatform.getChildren()[lastPlatform.getChildren().length - 1].x + Phaser.Math.Between(gameSettings.platformGapMin, gameSettings.platformGapMax);

    // add a new platform with length between 20 and 50
    var platformLength = Phaser.Math.Between(gameSettings.platformLengthMin, gameSettings.platformLengthMax);
    var platform = createPlatform(scene, platformLength, nextPlatformX, true);
    platform.setVelocityX(scene.gamePaused ? 0 : -gameSettings.playerSpeed * 200);
    scene.platformPool.add(platform);

    // decorate the platform
    decoratePlatform(scene, platform);
    if (scene.platformsSpawned % gameSettings.enemySpawnFrequency == 0) {
        spawnEnemy(scene, platform);
    } else {
        spawnItem(scene, platform);
    }
}

addRandomProps = function(scene, platformX, platformLength, maxProps, propNames) {
    for (var i = 0; i < Phaser.Math.Between(Math.floor(maxProps/2), maxProps); i++) {
        var propName = propNames[Phaser.Math.Between(0, propNames.length - 1)];
        var prop = createProp(scene, propName, platformX + Phaser.Math.Between(100, platformLength * 32 - 100));
        if (Phaser.Math.Between(0, 1) == 1) {
            prop.flipX = true;
        }
        prop.body.setVelocityX(scene.gamePaused ? 0 : -gameSettings.playerSpeed * 200);        
    }
}
    
createFirstPlatform = function(scene) {
    scene.platformPool.add(createPlatform(scene, 70));
    decoratePlatform(scene, scene.platformPool.getChildren()[0]);
    
    if (gameSettings.enemySpawnFrequency == 1) {
        spawnEnemy(scene, scene.platformPool.getChildren()[0]);
    }
}