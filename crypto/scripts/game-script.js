const { ethers } = require('hardhat');

const main = async () => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory('TheCryptoPurgeGame');

  // Deploy our contract to the local blockchain.
  // Fund the contract so we can send ETH!
  const contract = await contractFactory.deploy(
    ['player', 'zombie1'],
    [
      'https://proyecto26.com/thecryptopurge/assets/images/player.png',
      'https://proyecto26.com/thecryptopurge/assets/images/zombie.png',
    ],
    [1000, 100],
    [25, 10],
    {
    value: ethers.utils.parseEther('0.001')
  });
  // Await for the contract to be mined.
  await contract.deployed();
  console.log('Contract deployed:', contract.address);

  // Play a game.
  const firstGameTxn = await contract.play();
  // Wait for the transaction to be mined.
  await firstGameTxn.wait();

  console.log('Game played, number of rounds:', (await contract.getNumberOfRounds()).toString());

  // Play a game.
  const secondGameTxn = await contract.play();
  // Wait for the transaction to be mined.
  await secondGameTxn.wait();

  console.log('Game played, number of rounds:', (await contract.getNumberOfRounds()).toString());

  const finishTxn = await contract.finish();
  await finishTxn.wait();

  // Get Contract balance
  const contractBalance = await ethers.provider.getBalance(
    contract.address
  );
  console.log(
    'Contract balance:',
    ethers.utils.formatEther(contractBalance)
  );
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