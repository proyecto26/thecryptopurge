const { ethers } = require('hardhat');

const contractName = 'TheCryptoPurgeNFT';

exports.deployNFTContract = async () => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory(contractName);

  // Deploy our contract to the local blockchain.
  const contract = await contractFactory.deploy();

  // Await for the contract to be mined.
  await contract.deployed();

  console.log(`Contract ${contractName} deployed:`, contract.address);

  return contract;
};