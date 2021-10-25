const { ethers } = require("hardhat");

const main = async () => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory("Game");

  // Deploy our contract to the local blockchain.
  const contract = await contractFactory.deploy();

  // Await for the contract to be mined.
  await contract.deployed();

  console.log("Contract deployed:", contract.address);

  // Play a game.
  const firstGameTxn = await contract.play();
  // Wait for the transaction to be mined.
  await firstGameTxn.wait();

  console.log("Game played, number of rounds:", (await contract.getNumberOfRounds()).toString());

  // Play a game.
  const secondGameTxn = await contract.play();
  // Wait for the transaction to be mined.
  await secondGameTxn.wait();

  console.log("Game played, number of rounds:", (await contract.getNumberOfRounds()).toString());
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