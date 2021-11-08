const { ethers } = require('hardhat');
const { getAccountBalance, getContractBalance } = require('./utils');

const deployContract = async () => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory('TheCryptoPurgePortal');
  
  // Deploy our contract to the local blockchain.
  // Fund the contract so we can send ETH!
  const contract = await contractFactory.deploy({
    value: ethers.utils.parseEther('0.01')
  });
  // Await for the contract to be mined.
  await contract.deployed();
  console.log('Contract deployed to:', contract.address);
  return contract;
};

/**
 * Creating a new local Ethereum network.
 * Deploying your contract.
 * Hardhat will automatically destroy that local network by default.
 */
const main = async () => {
  // https://hardhat.org/advanced/hardhat-runtime-environment.html
  const [owner] = await hre.ethers.getSigners();

  // Get Owner balance
  console.log('Account balance:', await getAccountBalance(owner));

  // Deploy and get contract balance
  const contract = await deployContract();  
  console.log('Contract deployed by:', owner.address);
  // Get Contract balance
  console.log('Contract balance:', await getContractBalance(contract.address));

  // Get total likes
  const count = await contract.getTotalLikes();
  console.log('Total likes:', count.toString());

  // Feeling lucky
  console.log('Feeling lucky...');
  const transaction = await contract.feelingLucky();
  // Wait for the transaction to be mined.
  await transaction.wait();

  // Get Contract balance
  console.log('Contract balance:', await getContractBalance(contract.address));
};

const runMain = async () => {
  try {
    await main();
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();