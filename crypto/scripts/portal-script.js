const { getAccountBalance, getContractBalance } = require('./utils');
const { deployPortalContract } = require('./scripts/portal-contract');

/**
 * Creating a new local Ethereum network.
 * Deploying your contract.
 * Hardhat will automatically destroy that local network by default.
 */
const main = async () => {
  /**
   * The Hardhat Runtime Environment, or HRE for short,
   * is an object containing all the functionality that Hardhat exposes when running a task,
   * test or script. In reality, Hardhat is the HRE.
   * More details here: https://hardhat.org/advanced/hardhat-runtime-environment.html
   */
  const [owner] = await hre.ethers.getSigners();

  // Get Owner balance
  console.log('Account balance:', await getAccountBalance(owner));

  // Deploy and get contract balance
  const contract = await deployPortalContract();  
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