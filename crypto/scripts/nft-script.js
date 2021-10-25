const { ethers } = require('hardhat');

const main = async () => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory('TheCryptoPurgeNFT');

  // Deploy our contract to the local blockchain.
  const contract = await contractFactory.deploy();

  // Await for the contract to be mined.
  await contract.deployed();

  console.log('Contract deployed:', contract.address);

  // Mint a NFT.
  const txn = await contract.makeNFT();

  // Wait for the transaction to be mined.
  await txn.wait();
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