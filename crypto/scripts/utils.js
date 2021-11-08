const { ethers } = require('hardhat');

/**
 * Get Contract balance
 * @param address - contract address
 */
exports.getContractBalance = async (address) => {
  const contractBalance = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(contractBalance);
};

/**
 * Get Account balance
 * @param account - account address
 */
exports.getAccountBalance = async (account) => {
  const accountBalance = await account.getBalance();
  return ethers.utils.formatEther(accountBalance);
};