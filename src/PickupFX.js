class PickupFX extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, name) {
        super(scene, x, y, "item-pickup-fx");
        scene.add.existing(this);
        this.play("item-pickup-fx_anim");
        scene.tweens.add({
            targets: this,
            x: 0,
            duration: 1000,
            ease: "Linear",
            onComplete: function () {
                this.destroy();
            },
            callbackScope: this
        });
    }
}