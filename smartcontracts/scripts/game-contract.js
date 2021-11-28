const { ethers } = require('hardhat');

const contractName = 'TheCryptoPurgeGame';
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
exports.characters = CHARACTERS;
exports.deployGameContract = async (nftContract) => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory(contractName);
  // Deploy our contract to the local blockchain.
  const contract = await contractFactory.deploy(
    nftContract.address,
    [CHARACTERS.player.name, CHARACTERS.enemy1.name],
    [CHARACTERS.player.imageUrl, CHARACTERS.enemy1.imageUrl],
    [CHARACTERS.player.health, CHARACTERS.enemy1.health],
    [CHARACTERS.player.attack, CHARACTERS.enemy1.attack],
    {
    value: ethers.utils.parseEther('0.001')
  });
  // Await for the contract to be mined.
  await contract.deployed();

  console.log(`Contract ${contractName} deployed:`, contract.address);

  return contract;
};