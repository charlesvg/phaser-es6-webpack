/* eslint-disable */
import EasyStar from 'easystarjs';
import Phaser from 'phaser';

export class PathFinderPlugin extends Phaser.Plugin {
    constructor(game, parent) {
        super(game, parent);

        if (typeof EasyStar !== 'object') {
            throw new Error('Easystar is not defined!');
        }

        this.parent = parent;
        this._easyStar = new EasyStar.js();
        this._grid = null;
        this._callback = null;
        this._prepared = false;
        this._walkables = [0];
    }

    /**
     * Set Grid for Pathfinding.
     *
     * @param grid          Mapdata as a two dimensional array.
     * @param walkables     Tiles which are walkable. Every other tile is marked as blocked.
     * @param iterationsPerCount
     */
    setGrid(grid, walkables, iterationsPerCount) {
        iterationsPerCount = iterationsPerCount || null;

        this._grid = [];
        for (var i = 0; i < grid.length; i++) {
            this._grid[i] = [];
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j]) { this._grid[i][j] = grid[i][j].index; } else { this._grid[i][j] = 0; }
            }
        }
        this._walkables = walkables;

        this._easyStar.setGrid(this._grid);
        this._easyStar.setAcceptableTiles(this._walkables);

        // initiate all walkable tiles with cost 1 so they will be walkable even if they are not on the grid map, jet.
        for (i = 0; i < walkables.length; i++) {
            this.setTileCost(walkables[i], 1);
        }

        if (iterationsPerCount !== null) {
            this._easyStar.setIterationsPerCalculation(iterationsPerCount);
        }
    };

    /**
     * Sets the tile cost for a particular tile type.
     *
     * @param tileType {Number} The tile type to set the cost for.
     * @param cost {Number} The multiplicative cost associated with the given tile.
     */
    setTileCost(tileType, cost) {
        this._easyStar.setTileCost(tileType, cost);
    };

    /**
     * Set callback function (Uh, really?)
     * @param callback
     */
    setCallbackFunction(callback) {
        this._callback = callback;
    };

    /**
     * Enables diagonal movement
     */
    enableDiagonals() {
        this._easyStar.enableDiagonals();
    };

    /**
     * Disable diagonal movement
     */
    disableDiagonals() {
        this._easyStar.disableDiagonals();
    };

    /**
     * Prepare pathcalculation for easystar.
     *
     * @param from  array 0: x-coords, 1: y-coords ([x,y])
     * @param to    array 0: x-coords, 1: y-coords ([x,y])
     */
    preparePathCalculation(from, to) {
        if (this._callback === null || typeof this._callback !== 'function') {
            throw new Error('No Callback set!');
        }

        var startX = from[0],
            startY = from[1],
            destinationX = to[0],
            destinationY = to[1];

        this._easyStar.findPath(startX, startY, destinationX, destinationY, this._callback);
        this._prepared = true;
    };

    /**
     * Start path calculation.
     */
    calculatePath() {
        if (this._prepared === null) {
            throw new Error('no Calculation prepared!');
        }

        this._easyStar.calculate();
    };
}
