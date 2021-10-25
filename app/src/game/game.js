import Phaser from 'phaser-ce';
import BootState from './states/Boot';

const gameConfig = {
  width: '100%',
  height: '100%',
  renderer: Phaser.CANVAS,
  state: BootState
};

export default gameConfig;
