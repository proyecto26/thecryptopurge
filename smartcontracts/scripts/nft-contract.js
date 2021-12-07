const { ethers } = require('hardhat');

const contractName = 'TheCryptoPurgeNFT';
// Singleton instance of the contract.
let contract;
exports.deployNFTContract = async () => {
  if (contract) return contract;
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory(contractName);

  // Deploy our contract to the local blockchain.
  contract = await contractFactory.deploy();

  // Await for the contract to be mined.
  await contract.deployed();

  console.log(`Contract ${contractName} deployed:`, contract.address);

  return contract;
};