import Phaser from 'phaser-ce'

class Banner extends Phaser.Text {
  constructor ({ game, x, y, text }) {
    super(game, x, y, text)

    this.font = 'Bangers'
    this.padding.set(10, 16)
    this.fontSize = 70
    // this.fill = '#77BFA3'
    this.fill = 'white'
    this.smoothed = false
    this.anchor.setTo(0.5)
    this.wordWrap = true
    this.wordWrapWidth = 800
    this.align = 'center'
  }
}

export default Banner
