global.__DEV__ = process.env.NODE_ENV === 'development';

// Phaser Community Edition Global variables
window.PIXI = require('phaser-ce/build/custom/pixi');
window.p2 = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
