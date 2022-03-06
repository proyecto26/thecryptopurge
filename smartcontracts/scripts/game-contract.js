const { ethers } = require('hardhat');
const { CHARACTERS, BIG_BOSS } = require('./constants');

// Singleton instance of the contract
let multiPlayerContract;
const deployGameContract = async (nftContract) => {
  if (multiPlayerContract) return multiPlayerContract;
  const contractName = 'TheCryptoPurgeGame';
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory(contractName);
  // Deploy our contract to the local blockchain.
  multiPlayerContract = await contractFactory.deploy(
    nftContract.address,
    [CHARACTERS.player.name, CHARACTERS.enemy1.name],
    [CHARACTERS.player.imageUrl, CHARACTERS.enemy1.imageUrl],
    [CHARACTERS.player.health, CHARACTERS.enemy1.health],
    [CHARACTERS.player.attack, CHARACTERS.enemy1.attack],
    {
    value: ethers.utils.parseEther('0.001')
  });
  // Await for the contract to be mined.
  await multiPlayerContract.deployed();

  console.log(`Contract ${contractName} deployed:`, multiPlayerContract.address);

  return multiPlayerContract;
};

let singlePlayerContract;
const deploySingleModeGameContract = async (nftContract, bigBoss = BIG_BOSS) => {
  if (singlePlayerContract) return singlePlayerContract;
  const gameContract = await deployGameContract(nftContract);
  const contractName = 'TheCryptoPurgeSingleModeGame';
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory(contractName);
  // Deploy our contract to the local blockchain.
  singlePlayerContract = await contractFactory.deploy(
    gameContract.address,
    bigBoss.name,
    bigBoss.imageUrl,
    bigBoss.health,
    bigBoss.attack,
  );
  // Await for the contract to be mined.
  await singlePlayerContract.deployed();

  console.log(`Contract ${contractName} deployed:`, singlePlayerContract.address);

  return singlePlayerContract;
};

exports.deployGameContract = deployGameContract;
exports.deploySingleModeGameContract = deploySingleModeGameContract;