const { ethers } = require('hardhat');
const { getContractBalance } = require('./utils');
const { deployNFTContract } = require('./nft-contract');

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

// Fund the contract so we can send ETH!
const createContract = async () => {
  const contractNFT = await deployNFTContract();
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory('TheCryptoPurgeGame');
  // Deploy our contract to the local blockchain.
  const contract = await contractFactory.deploy(
    contractNFT.address,
    [CHARACTERS.player.name, CHARACTERS.enemy1.name],
    [CHARACTERS.player.imageUrl, CHARACTERS.enemy1.imageUrl],
    [CHARACTERS.player.health, CHARACTERS.enemy1.health],
    [CHARACTERS.player.attack, CHARACTERS.enemy1.attack],
    {
    value: ethers.utils.parseEther('0.001')
  });
  // Await for the contract to be mined.
  await contract.deployed();
  console.log('Contract deployed:', contract.address);

  return contract;
};

const playGame = async (contract) => {
  // Play a game.
  const txn = await contract.play();
  // Wait for the transaction to be mined.
  await txn.wait();
};

const runGame = async (contract) => {
  await playGame(contract);
  console.log('Game played, number of rounds:', (await contract.getNumberOfRounds()).toString());

  await playGame(contract);
  console.log('Game played, number of rounds:', (await contract.getNumberOfRounds()).toString());
};

const main = async () => {
  const contract = await createContract();
  await runGame(contract);
  const finishTxn = await contract.finish();
  await finishTxn.wait();
  await getContractBalance(contract.address);
};

const initialize = async () => {
  try {
    await main();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

initialize();