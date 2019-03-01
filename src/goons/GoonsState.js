import Phaser from 'phaser';
import {PathFinderPlugin} from '../util/pathfinder';

export class GoonsState extends Phaser.State {
    preload(game) {
        this.game.load.image('concrete', 'assets/games/goons/cobblestone.png');
        this.game.load.image('hitman', 'assets/games/goons/hitman.png');
        this.game.load.image('wall', 'assets/games/goons/concrete.png');
    }

    create(game) {
        this.pathfinder = this.game.plugins.add(PathFinderPlugin);
        this.pathfinder.setGrid([
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0]]
        , [0]);

        //  Resize our game world to be a 2000 x 2000 square
        this.game.world.setBounds(-1000, -1000, 2000, 2000);

        //  Our tiled scrolling background
        this.land = this.game.add.tileSprite(0, 0, 800, 600, 'concrete');

        this.land.fixedToCamera = true;

        //  The base of our goon
        this.goon = this.game.add.sprite(20, 20, 'hitman', 'hitman');
        this.goon.anchor.setTo(0.5, 0.5);

        this.wall = this.game.add.tileSprite(50, 50, 80, 40, 'wall');
        game.physics.enable(this.wall, Phaser.Physics.ARCADE);
        this.wall.body.collideWorldBounds = true;
        this.wall.body.immovable = true;

        //  This will force it to decelerate and limit its speed
        this.game.physics.enable(this.goon, Phaser.Physics.ARCADE);
        this.goon.body.drag.set(4);
        this.goon.body.maxVelocity.setTo(400, 400);
        this.goon.body.collideWorldBounds = true;
        // this.goon.body. =

        this.game.camera.follow(this.goon);
        this.game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        this.game.camera.focusOnXY(0, 0);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update(game) {
        this.game.physics.arcade.overlap(this.goon, this.wall, () => {
            this.currentSpeed = 0;
            this.goon.body.velocity.setTo(0, 0);
        });

        // if (this.cursors.left.isDown) {
        //     this.goon.angle -= 4;
        // } else if (this.cursors.right.isDown) {
        //     this.goon.angle += 4;
        // }

        // if (this.cursors.up.isDown) {
        //     //  The speed we'll travel at
        //     this.currentSpeed = 200;
        // } else {
        //     if (this.currentSpeed > 0) {
        //         this.currentSpeed -= 4;
        //     }
        // }
        //
        // if (this.currentSpeed > 0) {
        //     this.game.physics.arcade.velocityFromRotation(this.goon.rotation, this.currentSpeed, this.goon.body.velocity);
        // }

        this.land.tilePosition.x = -this.game.camera.x;
        this.land.tilePosition.y = -this.game.camera.y;

        if (this.game.input.activePointer.isDown) {
            //  Boom!
            this.game.physics.arcade.moveToPointer(this.goon, 200, this.game.input.activePointer, 500);
            this.pathfinder.setCallbackFunction((path) => { console.log(path); });
            this.pathfinder.preparePathCalculation([0, 0], [4, 0]);
            this.pathfinder.calculatePath();
        }

        this.goon.rotation = this.game.physics.arcade.angleToPointer(this.goon, this.game.input.activePointer);
    }
}
