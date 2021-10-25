import Phaser from 'phaser-ce'
import WebFont from 'webfontloader'

import SplashState from './Splash'
import GameState from './Game'

class BootState extends Phaser.State {
  init () {
    this.stage.disableVisibilityChange = true
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT
    this.scale.pageAlignHorizontally = true

    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR
    ])

    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)

    this.state.add('Splash', SplashState)
    this.state.add('Game', GameState)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: () => this.fontsLoaded()
    })

    const text = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'loading fonts',
      {
        font: '16px Arial', fill: '#dddddd', align: 'center' }
    )
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}

export default BootState