spawnItem = function (scene, platform) {
    if (gameSettings.itemSpawnChance < Phaser.Math.Between(1, 100)) {
        return;
    }

    var itemName = Phaser.Math.RND.pick(["item-cherry", "item-gem"]);
    var platformLength = platform.getChildren().length;
    var firstBlock = platform.getChildren()[0];
    var lastBlock = platform.getChildren()[platformLength - 1];

    var itemX = Phaser.Math.Between(firstBlock.x + 200, lastBlock.x - 200);
    var itemY = firstBlock.y - Phaser.Math.Between(100, 150);

    var item = new Item(scene, itemX, itemY, itemName);
    scene.items.add(item);
    item.body.setVelocityX(scene.gamePaused ? 0 : -gameSettings.playerSpeed * 200);
}

class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, itemName) {
        super(scene, x, y, itemName);
        this.scene = scene;

        this.play(itemName + "_anim");
        this.setScale(2.5);
        this.depth = 3;

        this.scene.add.existing(this);
    }

    update() {
        if (this.x < -100) {
            this.scene.items.remove(this);
            this.destroy();
        }
    }

    pickedUp(player) {
        var points = 0;
        if (this.texture.key == "item-cherry") {
            this.scene.cherrySound.play();
            points = gameSettings.cherryBonus;
            this.scene.penalty -= gameSettings.cherryBonus;
        } else if (this.texture.key == "item-gem") {
            this.scene.gemSound.play();
            points = gameSettings.gemBonus;
            this.scene.penalty -= gameSettings.gemBonus;
        }
        playerPointGain(this.scene, points);
        var fx = new PickupFX(this.scene, this.x, this.y);
        this.scene.items.remove(this);
        this.destroy();
    }
}