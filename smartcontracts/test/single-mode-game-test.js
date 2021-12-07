const { expect } = require('chai');

const { deployNFTContract } = require('../scripts/nft-contract');
const { deploySingleModeGameContract } = require('../scripts/game-contract');

describe('TheCryptoPurgeSingleModeGame', function () {
  it('should create the contract correctly', async function () {

    const nftContract = await deployNFTContract();
    const contract = await deploySingleModeGameContract(nftContract);
    const total = await contract.getTotalNFTMinted();

    expect(total).to.be.equal(1);
  });
});
