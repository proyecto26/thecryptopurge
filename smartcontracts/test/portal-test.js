const { expect } = require('chai');

const { getAccountBalance, getContractBalance } = require('../scripts/utils');
const { deployPortalContract, initialValue } = require('../scripts/portal-contract');

const sendMessage = async (contract, message) => {
  const transaction = await contract.sendMessage(message);
  // Wait for the transaction to be mined.
  await transaction.wait();
};

const sendLike = async (contract) => {
  const transaction = await contract.like();
  // Wait for the transaction to be mined.
  await transaction.wait();
};

const feelingLucky = async (contract) => {
  const transaction = await contract.feelingLucky();
  // Wait for the transaction to be mined.
  await transaction.wait();
};

describe('TheCryptoPurgePortal', function () {

  it('should send a message correctly', async function () {
    // Deploy and get contract balance
    const contract = await deployPortalContract();
    expect((await contract.getAllMessages()).length).to.equal(0);

    // Send a message with a random wallet address
    // https://hardhat.org/advanced/hardhat-runtime-environment.html
    const [_, randomWallet] = await hre.ethers.getSigners();
    const contractWithRandomWallet = contract.connect(randomWallet);
    await sendMessage(contractWithRandomWallet, 'Hello World!');

    expect((await contract.getAllMessages()).length).to.equal(1);
  });

  it('should return a new total of likes', async function () {
    const [owner, randomWallet] = await hre.ethers.getSigners();

    // Deploy and get contract balance
    const contract = await deployPortalContract();  
    console.log('Contract deployed by:', owner.address);

    // Get total likes
    expect(await contract.getTotalLikes()).to.equal(0);

    await sendLike(contract);

    // Give a like with a random wallet address
    const contractWithRandomWallet = contract.connect(randomWallet);
    await sendLike(contractWithRandomWallet);
    const count = await contract.getTotalLikes();
    console.log('Total likes:', count.toString());

    expect(count).to.equal(2);
  });


  it('should return a new balance equal or less than the initial', async function () {
    // https://hardhat.org/advanced/hardhat-runtime-environment.html
    const [owner] = await hre.ethers.getSigners();

    // Get Owner balance
    console.log('Account balance:', await getAccountBalance(owner));

    // Deploy and get contract balance
    const contract = await deployPortalContract();  
    console.log('Contract deployed by:', owner.address);
    // Get Contract balance
    console.log('Contract balance:', await getContractBalance(contract.address));

    // Lets try feeling lucky
    console.log('Feeling lucky...');
    const contractWithOwner = contract.connect(owner);
    await feelingLucky(contractWithOwner);

    const balance = await getContractBalance(contract.address);
    console.log('Contract balance:', balance);
    expect(Number(balance)).to.be.lessThanOrEqual(Number(initialValue));
  });
});
