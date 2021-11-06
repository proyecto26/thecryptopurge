require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
require('./tasks/accounts');
require('./tasks/balance');
require('./tasks/block-number');

require('dotenv').config();

const RINKEBY_RPC_URL = process.env.ALCHEMY_RINKEBY_RPC_URL || 'https://eth-rinkeby.alchemyapi.io/v2/your-api-key'
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'your private key'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'localhost',
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      /*accounts: {
        mnemonic: MNEMONIC,
      },*/
      saveDeployments: true,
    }
  },
  mocha: {
    timeout: 20000
  }
};
