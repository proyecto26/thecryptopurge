const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('TheCryptoPurgeNFT', function () {
  it(`Should return a new total once NFT is minted`, async function () {

    // Compiling our Smart Contract.
    const contractFactory = await ethers.getContractFactory('TheCryptoPurgeNFT');
    // Deploy our contract to the local blockchain.
    const contract = await contractFactory.deploy();
    // Await for the contract to be mined.
    await contract.deployed();

    expect(await contract.getTotalCollection()).to.equal(0);

    // Mint a NFT.
    /**
     *  {
     *    "name": "The Crypto Purge Player",
     *    "description": "A sprite of a simple character-player",
     *    "image": "https://raw.githubusercontent.com/proyecto26/Phaser-Workshop/client-server/client/assets/images/player.png"
     *  }
     */
    const txn = await contract.mintNFT('https://jsonkeeper.com/b/OGGV');
    // Wait for the transaction to be mined.
    await txn.wait();

    expect(await contract.getTotalCollection()).to.equal(1);
  });
});
