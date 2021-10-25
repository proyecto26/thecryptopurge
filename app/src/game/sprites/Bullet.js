import Phaser from 'phaser-ce'

class Bullet extends Phaser.Sprite {
  constructor ({ game, x, y, asset, playerId }) {
    super(game, x, y, asset)

    this.playerId = playerId
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
  }
}

export default Bullet
