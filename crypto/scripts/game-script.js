const { getContractBalance } = require('./utils');
const { deployNFTContract } = require('./nft-contract');
const { deployGameContract, characters } = require('./game-contract');

const main = async () => {
  const nftContract = await deployNFTContract();
  const contract = await deployGameContract(nftContract);
  const balance = await getContractBalance(contract.address);
  console.log('Contract balance:', balance);

  const [owner] = await hre.ethers.getSigners();
  console.log('Owner address:', owner.address);

  const countCharacters = Object.keys(characters).length;
  // Mint NFTs for characters.
  for (let i = 0; i < countCharacters; i++) {
    // Mint a NFT.
    const txn = await contract.mintCharacterNFT(i);
    await txn.wait();
    console.log(`Minted NFT for character #${i+1}`);
  }

  console.log(`Number of NFTs minted: ${await contract.getTotalNFTMinted()}`);
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