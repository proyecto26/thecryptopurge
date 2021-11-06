const { ethers } = require('hardhat');

exports.deployNFTContract = async () => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory('TheCryptoPurgeNFT');

  // Deploy our contract to the local blockchain.
  const contract = await contractFactory.deploy();

  // Await for the contract to be mined.
  await contract.deployed();

  console.log('Contract deployed:', contract.address);

  return contract;
};