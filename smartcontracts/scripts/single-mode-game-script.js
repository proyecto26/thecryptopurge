const { getContractBalance, getAccountBalance } = require('./utils');
const { deployNFTContract } = require('./nft-contract');
const { deploySingleModeGameContract } = require('./game-contract');

const main = async () => {
  const [owner] = await hre.ethers.getSigners();
  console.log('Owner address:', owner.address);
  console.log('Account balance:', await getAccountBalance(owner));

  const nftContract = await deployNFTContract();
  const contract = await deploySingleModeGameContract(nftContract);
  console.log('Contract balance:', await getContractBalance(contract.address));
  console.log('Account balance:', await getAccountBalance(owner));
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