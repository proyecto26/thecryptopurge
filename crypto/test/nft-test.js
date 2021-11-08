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
    const txn = await contract.mintNFT({
      index: 0,
      name: 'player',
      imageUri: 'https://raw.githubusercontent.com/proyecto26/Phaser-Workshop/client-server/client/assets/images/player.png',
      health: 1000,
      maxHealth: 1000,
      attackDamage: 100
    });
    // Wait for the transaction to be mined.
    await txn.wait();

    expect(await contract.getTotalCollection()).to.equal(1);
  });
});
