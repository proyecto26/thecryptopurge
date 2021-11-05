const { ethers } = require('hardhat');

/**
 * Creating a new local Ethereum network.
 * Deploying your contract.
 * Hardhat will automatically destroy that local network by default.
 */
const main = async () => {
  // https://hardhat.org/advanced/hardhat-runtime-environment.html
  const [owner, randomWallet] = await hre.ethers.getSigners();

  // Get Owner balance
  const accountBalance = await owner.getBalance();
  console.log('Account balance: ', accountBalance.toString());

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
  console.log('Contract deployed by:', owner.address);

  // Get Contract balance
  const contractBalance = await ethers.provider.getBalance(
    contract.address
  );
  console.log(
    'Contract balance:',
    ethers.utils.formatEther(contractBalance)
  );

  let count;
  count = await contract.getTotalLikes();
  
  let txn = await contract.like();
  // Wait for the transaction to be mined.
  await txn.wait();

  count = await contract.getTotalLikes();

  // Give a like with a random wallet address
  const contractsWithRandomWallet = contract.connect(randomWallet);
  txn = await contractsWithRandomWallet.like();
  // Wait for the transaction to be mined.
  await txn.wait();
  count = await contract.getTotalLikes();

  console.log('Total likes:', count.toString());

  // Send a message with a random wallet address
  txn = await contractsWithRandomWallet.sendMessage('Hello World!');
  // Wait for the transaction to be mined.
  await txn.wait();

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