import Phaser from 'phaser-ce'

class Body extends Phaser.Sprite {
  constructor ({ game, x, y, asset, id }) {
    super(game, x, y)

    this.id = id

    /**
     * Create the player object
     */
    game.add.existing(this)
    this.anchor.set(0.5)
    game.physics.arcade.enable(this)

    /**
     * Create the legs of the player
     */
    this.legs = game.add.sprite(0, 0, 'legs')
    this.legs.anchor.set(0.5)
    this.legs.animations.add('walk', null, 10, true)
    game.physics.arcade.enable(this.legs)
    this.addChild(this.legs)

    /**
     * Create the torso of the player
     */
    this.torso = game.add.sprite(x, y, asset)
    this.torso.anchor.setTo(0.5, 0.7)
    this.torso.frame = 2
    this.torso.animations.add('walk', Phaser.ArrayUtils.numberArray(2, 9), 16, true)
    game.physics.arcade.enable(this.torso)

    this.body.setCircle(this.legs.height / 4, -this.legs.width / 10, -this.legs.height / 10)

    this.legs.collideWorldBounds = true
    this.torso.collideWorldBounds = true
    this.body.collideWorldBounds = true
    this.body.allowRotation = false
  }

  update () {
    this.torso.x = this.x
    this.torso.y = this.y
    this.torso.angle = this.legs.angle
  }

  destroy () {
    this.torso.destroy()
    super.destroy()
  }
}

export default Body
