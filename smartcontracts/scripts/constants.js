const CHARACTERS = {
  player: {
    name: 'Player',
    imageUrl: 'https://proyecto26.com/thecryptopurge/assets/images/player.png',
    health: 1000,
    attack: 25,
  },
  enemy1: {
    name: 'Enemy 1',
    imageUrl: 'https://proyecto26.com/thecryptopurge/assets/images/zombie.png',
    health: 100,
    attack: 10,
  }
};
const BIG_BOSS = {
  name: 'Big Boss',
  imageUrl: 'https://proyecto26.com/thecryptopurge/assets/images/zombie.png',
  health: 10000,
  attack: 20
};

exports.CHARACTERS = CHARACTERS;
exports.BIG_BOSS = BIG_BOSS;