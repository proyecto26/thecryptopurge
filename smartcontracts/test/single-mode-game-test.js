const { expect, use } = require('chai');
const { solidity } = require('ethereum-waffle');
use(solidity);

const { deployNFTContract } = require('../scripts/nft-contract');
const { deploySingleModeGameContract } = require('../scripts/game-contract');

describe('TheCryptoPurgeSingleModeGame', function () {
  it('should create the contract correctly', async function () {

    const nftContract = await deployNFTContract();
    const contract = await deploySingleModeGameContract(nftContract);
    const total = await contract.getTotalNFTMinted();

    expect(total).to.be.equal(1);
  });

  it('shuld reduce the health of the boss when attacked by a player', async function () {
    const nftContract = await deployNFTContract();
    const contract = await deploySingleModeGameContract(nftContract);
    const { health: prevBigBossHealth } = await contract.bigBoss();
    await contract.attackBoss();
    const { health: newBigBossHealth } = await contract.bigBoss();

    // Compare BigNumbers
    expect(newBigBossHealth).to.be.lt(prevBigBossHealth);
  });
});
