class Scene2 extends Phaser.Scene {
    constructor() {
        super("titleScreen");
    }

    create() {
        this.props = this.physics.add.group();

        createBackgrounds(this);
        createPlatform(this, 23, 0, false);

        this.createProps();
        this.createPlayer();

        this.createTitle(30);
        this.createLangSelect(90);
        this.createTopicSelect(130);
        this.createStartButton(180);
    }

    createProps() {
        createProp(this, "palm", 60);
        createProp(this, "bush", 150);
        createProp(this, "bush", 230);
        createProp(this, "tree2", 190);
        createProp(this, "rock", 400);
        createProp(this, "shrooms", 370);
        createProp(this, "tree", 500);
        createProp(this, "pine", config.width - 20);
    }

    createPlayer() {
        var player = this.add.sprite(config.width / 2 - 32, config.height - 64, "player-idle").setScale(2);
        player.setScale(2);
        player.play("player-idle_anim");
    }

    createTitle(yPos) {
        var title = this.add.bitmapText(config.width / 2 - 132, yPos, "pixelFont", "MATH RUNNER", 48);
        title.tint = 0x000000;

        /*
        var start = this.add.bitmapText(config.width / 2 - 88, yPos + 40, "pixelFont", "Select a language", 24);
        start.alpha = 0;
        start.tint = 0x000000;

        this.tweens.add({
            targets: start,
            alpha: 1,
            duration: 1500,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });
        */
    }

    /* createFlags() {
        var enFlag = this.add.image(config.width / 2 - 65 + 50, 130, "en").setScale(2);
        var phFlag = this.add.image(config.width / 2 - 65, 130, "ph").setScale(2);
        var deFlag = this.add.image(config.width / 2 - 65 + 100, 130, "de").setScale(2);
        
        phFlag.setInteractive();
        phFlag.on("pointerdown", function() {
            gameSettings.language = "ph";
            this.scene.start("playGame");
        }, this);

        enFlag.setInteractive();
        enFlag.on("pointerdown", function() {
            gameSettings.language = "en";
            this.scene.start("playGame");
        }, this);

        deFlag.setInteractive();
        deFlag.on("pointerdown", function() {
            gameSettings.language = "de";
            this.scene.start("playGame");
        }, this);
    } */

    createStartButton(yPos) {
        var startButton = this.add.image(config.width / 2 - 16, yPos, "start").setScale(0.75);
        startButton.setInteractive();
        startButton.on("pointerdown", function() {
            this.scene.start("playGame");
        }, this);
    }

    createLangSelect(yPos) {
        var nextLangButton = this.add.image(config.width / 2 + 30, yPos, "arrow").setScale(0.4);
        var prevLangButton = this.add.image(config.width / 2 - 60, yPos, "arrow").setScale(0.4);
        prevLangButton.flipX = true;

        nextLangButton.setInteractive();
        prevLangButton.setInteractive();

        var enFlag = this.add.image(config.width / 2 - 15, yPos, "en").setScale(2);
        var phFlag = this.add.image(config.width / 2 - 15, yPos, "ph").setScale(2);
        var deFlag = this.add.image(config.width / 2 - 15, yPos, "de").setScale(2);
        enFlag.alpha = gameSettings.language == "en" ? 1 : 0;
        phFlag.alpha = gameSettings.language == "ph" ? 1 : 0;
        deFlag.alpha = gameSettings.language == "de" ? 1 : 0;

        nextLangButton.on("pointerdown", function() {
            switch(gameSettings.language) {
                case "en":
                    gameSettings.language = "ph";
                    enFlag.alpha = 0;
                    phFlag.alpha = 1;
                    deFlag.alpha = 0;
                    break;
                case "ph":
                    gameSettings.language = "de";
                    enFlag.alpha = 0;
                    phFlag.alpha = 0;
                    deFlag.alpha = 1;
                    break;
                case "de":
                    gameSettings.language = "en";
                    enFlag.alpha = 1;
                    phFlag.alpha = 0;
                    deFlag.alpha = 0;
                    break;
            }
        }, this);

        prevLangButton.on("pointerdown", function() {
            switch(gameSettings.language) {
                case "en":
                    gameSettings.language = "de";
                    enFlag.alpha = 0;
                    phFlag.alpha = 0;
                    deFlag.alpha = 1;
                    break;
                case "de":
                    gameSettings.language = "ph";
                    enFlag.alpha = 0;
                    phFlag.alpha = 1;
                    deFlag.alpha = 0;
                    break;
                case "ph":
                    gameSettings.language = "en";
                    enFlag.alpha = 1;
                    phFlag.alpha = 0;
                    deFlag.alpha = 0;
                    break;
            }
        }, this);
    }

    createTopicSelect(yPos) {
        this.nextTopicButton = this.add.image(config.width / 2, yPos, "arrow").setScale(0.4);
        this.prevTopicButton = this.add.image(config.width / 2, yPos, "arrow").setScale(0.4);
        this.prevTopicButton.flipX = true;

        this.nextTopicButton.setInteractive();
        this.prevTopicButton.setInteractive();

        this.topicLabel = this.add.bitmapText(config.width / 2, yPos - 9, "pixelFont", "", 24);
        this.topicLabel.tint = 0x000000;
        this.updateTopicLabel();

        this.nextTopicButton.on("pointerdown", function() {
            switch(gameSettings.topic) {
                case "mdrngeometry":
                    gameSettings.topic = "inventory";
                    break;
                case "inventory":
                    gameSettings.topic = "trigonometry";
                    break;
                case "trigonometry":
                    gameSettings.topic = "mdrngeometry";
                    break;
            }
            this.updateTopicLabel();
        }, this);

        this.prevTopicButton.on("pointerdown", function() {
            switch(gameSettings.topic) {
                case "mdrngeometry":
                    gameSettings.topic = "trigonometry";
                    break;
                case "trigonometry":
                    gameSettings.topic = "inventory";
                    break;
                case "inventory":
                    gameSettings.topic = "mdrngeometry";
                    break;
            }
            this.updateTopicLabel();
        }, this);
    }

    updateTopicLabel() {
        switch(gameSettings.topic) {
            case "inventory":
                this.topicLabel.text = "Inventory";
                this.topicLabel.x = config.width / 2 - 88 + 30;
                this.nextTopicButton.x = config.width / 2 + 54;
                this.prevTopicButton.x = config.width / 2 - 84;
                break;
            case "trigonometry":
                this.topicLabel.text = "Trigonometry";
                this.topicLabel.x = config.width / 2 - 88 + 13;
                this.nextTopicButton.x = config.width / 2 + 70;
                this.prevTopicButton.x = config.width / 2 - 101;
                break;
            case "mdrngeometry":
                this.topicLabel.text = "Modern Geometry";
                this.topicLabel.x = config.width / 2 - 88;
                this.nextTopicButton.x = config.width / 2 + 91;
                this.prevTopicButton.x = config.width / 2 - 114;
                break;
        }
    }
}