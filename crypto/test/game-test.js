const { expect } = require('chai');

const { getContractBalance } = require('../scripts/utils');
const { deployNFTContract } = require('../scripts/nft-contract');
const { deployGameContract, characters } = require('../scripts/game-contract');

const playGame = async (contract) => {
  // Play a game.
  const txn = await contract.play();
  // Wait for the transaction to be mined.
  await txn.wait();
};

describe('TheCryptoPurgeGame', function () {
  it('should create the default characters correctly', async function () {

    const nftContract = await deployNFTContract();
    const contract = await deployGameContract(nftContract);
    const defaultCharacters = await contract.getCharacters();

    expect(defaultCharacters.length).to.equal(Object.keys(characters).length);

    expect(defaultCharacters[0].name).to.equal(characters.player.name);
  });

  it('should increment number of rounds after a game is played', async function () {
    const nftContract = await deployNFTContract();
    const contract = await deployGameContract(nftContract);

    await playGame(contract);
    expect(await contract.getNumberOfRounds()).to.equal(1);

    await playGame(contract);
    expect(await contract.getNumberOfRounds()).to.equal(2);
  });

  it('should send prize amount to the winner after a game is finished', async function () {
    const nftContract = await deployNFTContract();
    const contract = await deployGameContract(nftContract);

    const oldBalance = await getContractBalance(contract.address);

    const finishTxn = await contract.finish();
    await finishTxn.wait();

    const newBalance = await getContractBalance(contract.address);
    expect(Number(newBalance)).to.be.lessThan(Number(oldBalance));
  });
});
