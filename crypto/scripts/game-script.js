const { getContractBalance } = require('./utils');
const { deployNFTContract } = require('./nft-contract');
const { deployGameContract } = require('./game-contract');

const main = async () => {
  const nftContract = await deployNFTContract();
  await deployGameContract(nftContract);
  await getContractBalance(contract.address);
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