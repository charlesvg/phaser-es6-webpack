import Phaser from 'phaser';

export class GoonsState extends Phaser.State {
    preload(game) {
        this.game.load.image('concrete', 'assets/games/goons/cobblestone.png');
        this.game.load.image('hitman', 'assets/games/goons/hitman.png');
    }

    create(game) {
        //  Resize our game world to be a 2000 x 2000 square
        this.game.world.setBounds(-1000, -1000, 2000, 2000);

        //  Our tiled scrolling background
        this.land = this.game.add.tileSprite(0, 0, 800, 600, 'concrete');

        this.land.fixedToCamera = true;

        //  The base of our goon
        this.goon = this.game.add.sprite(20, 20, 'hitman', 'hitman');
        this.goon.anchor.setTo(0.5, 0.5);

        //  This will force it to decelerate and limit its speed
        this.game.physics.enable(this.goon, Phaser.Physics.ARCADE);
        this.goon.body.drag.set(4);
        this.goon.body.maxVelocity.setTo(400, 400);
        this.goon.body.collideWorldBounds = true;

        this.game.camera.follow(this.goon);
        this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        this.game.camera.focusOnXY(0, 0);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update(game) {
        if (this.cursors.left.isDown) {
            this.goon.angle -= 4;
        } else if (this.cursors.right.isDown) {
            this.goon.angle += 4;
        }

        if (this.cursors.up.isDown) {
            //  The speed we'll travel at
            this.currentSpeed = 200;
        } else {
            if (this.currentSpeed > 0) {
                this.currentSpeed -= 4;
            }
        }

        if (this.currentSpeed > 0) {
            this.game.physics.arcade.velocityFromRotation(this.goon.rotation, this.currentSpeed, this.goon.body.velocity);
        }

        this.land.tilePosition.x = -this.game.camera.x;
        this.land.tilePosition.y = -this.game.camera.y;
    }
}
