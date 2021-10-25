/* globals __DEV__ */
import Phaser from 'phaser-ce'
import * as io from 'socket.io-client'
import _ from 'lodash'

import config from '../config'
import Player from '../sprites/Player'
import Enemy from '../sprites/Enemy'
import Banner from '../texts/Banner'

class GameState extends Phaser.State {
  init () {
    this.socket = io.connect(config.serverUrl)
    this.socket.on('player.created', this.playerCreated.bind(this))
    this.socket.on('player.enemyCreated', this.createEnemy.bind(this))
    this.socket.on('player.disconnect', this.destroyPlayer.bind(this))
    this.socket.on('enemy.disconnect', this.destroyEnemy.bind(this))
    this.socket.on('enemy.position', this.updateEnemy.bind(this))
    this.lastTimeSocketCaptured = 0
    this.socketDelay = 1 / 60
  }
  /**
   * Load dynamic assets per level
   */
  preload () {}

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.checkCollision.down = true

    this.add.image(0, 0, 'level1')
    /**
     * We can get data from the cache
     */
    // let cacheImage = this.game.cache.getImage('level1')
    this.game.world.setBounds(0, 0, 3840, 1600)

    this.banner = new Banner({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY - 50,
      text: 'The Crypto Purge 💸 \nfor                     '
    })
    this.game.add.existing(this.banner)
    // this.logo = this.add.image(this.banner.x - 8, this.banner.y - 10, 'sonar')
    // this.logo.scale.setTo(0.28)
    this.logo = this.add.image(this.banner.x - 80, this.banner.y + 0, 'sonar-logo')
    this.logo.scale.setTo(0.055)

    // this.ring = this.add.image(this.world.centerX - 3, this.world.centerY + 170, 'sonar-logo-ring')
    // this.ring.scale.setTo(0.8)
    // this.ring.anchor.setTo(0.5)

    this.enemies = this.game.add.group()
    this.enemies.enableBody = true

    this.music = this.game.add.audio('music')
    this.music.loop = true
    // this.music.play()

    this.playerLastPosition = {}

    // Initialize the socket
    this.socket.emit('player.newPlayer', 'username')
  }

  update () {
    if (!this.player) return
    this.game.physics.arcade.collide(this.player, this.enemies)

    var currentPlayerPosition = {
      x: this.player.x,
      y: this.player.y,
      legsAngle: this.player.legs.angle,
      legsFrame: this.player.legs.frame,
      torsoFrame: this.player.torso.frame
    }

    if (
      this.game.time.now > this.lastTimeSocketCaptured &&
      !_.isEqual(this.playerLastPosition, currentPlayerPosition)
    ) {
      this.lastTimeSocketCaptured = this.game.time.now + this.socketDelay
      this.socket.emit('player.movement', currentPlayerPosition)
    }
  }

  playerCreated ({ player, enemies }) {
    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 170,
      asset: 'player',
      id: player.id
    })
    _.forEach(enemies, (enemy) => this.createEnemy(enemy))
  }

  createEnemy ({ id, x, y, legsAngle = 0 }) {
    var newEnemy = this.enemies.add(
      new Enemy({
        game: this.game,
        x: x,
        y: y,
        asset: 'player',
        id: id
      })
    )
    newEnemy.legs.angle = legsAngle
  }

  updateEnemy ({ id, x, y, legsAngle, legsFrame, torsoFrame }) {
    let enemy = _.find(this.enemies.children, { id: id })
    if (enemy) {
      enemy.x = x
      enemy.y = y
      enemy.legs.angle = legsAngle
      enemy.legs.frame = legsFrame
      enemy.torso.frame = torsoFrame
    }
  }

  destroyPlayer () {
    this.player.destroy()
  }

  destroyEnemy (playerId) {
    let enemy = _.find(this.enemies.children, { id: playerId })
    if (enemy) {
      enemy.destroy()
    }
  }

  render () {
    if (__DEV__) {
      if (this.player) {
        this.game.debug.spriteInfo(this.player, 32, 32)
        this.game.debug.body(this.player)
      }
      this.enemies.forEachAlive(function (enemy) {
        this.game.debug.body(enemy, 'rgba(255, 0, 0, 0.5)')
      }, this)
    }
  }
}

export default GameState