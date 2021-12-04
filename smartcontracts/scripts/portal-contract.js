const { ethers } = require('hardhat');

const contractName = 'TheCryptoPurgePortal';
const initialValue = ethers.utils.parseEther('0.01');

exports.initialValue = initialValue;
exports.deployPortalContract = async () => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory(contractName);

  // Deploy our contract to the blockchain.
  // Fund the contract so we can send ETH!
  const contract = await contractFactory.deploy({
    value: initialValue
  });

  // Await for the contract to be mined.
  await contract.deployed();

  console.log(`Contract ${contractName} deployed:`, contract.address);

  return contract;
};