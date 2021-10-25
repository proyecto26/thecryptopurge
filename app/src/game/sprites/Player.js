import Phaser from 'phaser-ce'
import Body from './Body'

class Player extends Body {
  constructor ({ game, x, y, asset, id }) {
    super({ game, x, y, asset, id })

    this.maxSpeed = 300
    this.fireRate = 200
    console.log(`PlayerId: ${id}`)

    game.camera.follow(this)

    /**
     * Capture the cursor and the keyboard keys
     */
    this.cursor = game.input.keyboard.createCursorKeys()
    this.spaceButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S)
    }

    this.shootingSound = game.add.audio('shoot')
    //  Creates 30 bullets, using the 'bullet' graphic
    this.weapon = game.add.weapon(30, 'bullet')
    //  The bullet will be automatically killed when it leaves the world bounds
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    //  The speed at which the bullet is fired
    this.weapon.bulletSpeed = 600
    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    this.weapon.fireRate = this.fireRate
    this.weapon.trackSprite(this.torso, 0, 0, false)
    //  Fix the position of the bullets to create from the gun
    this.weapon.bullets.setAll('anchor.x', -6)
    this.weapon.bullets.setAll('anchor.y', 0)
    this.weapon.onFire.add(this.newShot, this)
  }

  update () {
    super.update()
    this.body.velocity.x = 0
    this.body.velocity.y = 0
    this.legs.body.angularVelocity = 0

    if (this.cursor.left.isDown || this.wasd.left.isDown) {
      this.legs.body.angularVelocity = -this.maxSpeed
    } else if (this.cursor.right.isDown || this.wasd.right.isDown) {
      this.legs.body.angularVelocity = this.maxSpeed
    }

    var direction = null
    if (this.cursor.up.isDown || this.wasd.up.isDown) direction = 1
    if (this.cursor.down.isDown || this.wasd.down.isDown) direction = -1

    if (direction) {
      var angle = this.legs.angle - 90
      this.game.physics.arcade.velocityFromAngle(angle, direction * this.maxSpeed, this.body.velocity)

      this.torso.animations.play('walk')
      this.legs.animations.play('walk')
    } else {
      this.torso.animations.stop()
      this.legs.animations.stop()
      this.torso.frame = 2
      this.legs.frame = 0
    }

    if (this.spaceButton.isDown) {
      this.torso.animations.stop()
      this.torso.frame = 0
      this.weapon.fireAngle = this.torso.angle - 90
      this.weapon.fire()
    }
  }

  newShot () {
    this.shootingSound.play()
  }
}

export default Player