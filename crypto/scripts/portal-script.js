const { ethers } = require('hardhat');
const { getAccountBalance, getContractBalance } = require('./utils');

const deployContract = async () => {
  // Compiling our Smart Contract.
  const contractFactory = await ethers.getContractFactory('TheCryptoPurgePortal');
  
  // Deploy our contract to the local blockchain.
  // Fund the contract so we can send ETH!
  const contract = await contractFactory.deploy({
    value: ethers.utils.parseEther('0')
  });
  // Await for the contract to be mined.
  await contract.deployed();
  console.log('Contract deployed to:', contract.address);
  return contract;
};

const sendMessage = async (contract, message) => {
  const transaction = await contract.sendMessage(message);
  // Wait for the transaction to be mined.
  await transaction.wait();
};

const sendLike = async (contract) => {
  const transaction = await contract.like();
  // Wait for the transaction to be mined.
  await transaction.wait();
};

/**
 * Creating a new local Ethereum network.
 * Deploying your contract.
 * Hardhat will automatically destroy that local network by default.
 */
const main = async () => {
  // https://hardhat.org/advanced/hardhat-runtime-environment.html
  const [owner, randomWallet] = await hre.ethers.getSigners();

  // Get Owner balance
  await getAccountBalance(owner);

  const contract = await deployContract();  
  console.log('Contract deployed by:', owner.address);

  // Get Contract balance
  await getContractBalance(contract.address);

  let count;
  count = await contract.getTotalLikes();
  
  await sendLike(contract);

  count = await contract.getTotalLikes();

  // Give a like with a random wallet address
  const contractsWithRandomWallet = contract.connect(randomWallet);
  await sendLike(contractsWithRandomWallet);
  count = await contract.getTotalLikes();

  console.log('Total likes:', count.toString());

  // Send a message with a random wallet address
  await sendMessage(contractsWithRandomWallet, 'Hello World!');

  console.log('All Messages:', await contract.getAllMessages());
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