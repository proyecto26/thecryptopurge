require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require('@appliedblockchain/chainlink-plugins-random-number-consumer');
require('hardhat-deploy');
require('solidity-coverage');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
require('./tasks/accounts');
require('./tasks/balance');
require('./tasks/block-number');
require('./tasks/withdraw-link');

require('dotenv').config();

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || process.env.ALCHEMY_MAINNET_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/your-api-key'
const RINKEBY_RPC_URL = process.env.ALCHEMY_RINKEBY_RPC_URL || 'https://eth-rinkeby.alchemyapi.io/v2/your-api-key'
const POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-mainnet.alchemyapi.io/v2/your-api-key'
const MNEMONIC = process.env.MNEMONIC || 'your mnemonic'
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'Your etherscan API key'
// optional
const PRIVATE_KEY = process.env.PRIVATE_KEY || 'your private key'

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.6.6"
      },
      {
        version: "0.8.4"
      }
    ]
  },
  //defaultNetwork: 'localhost',
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
    mainnet: {
      chainId: 1,
      url: MAINNET_RPC_URL,
      accounts: {
        mnemonic: MNEMONIC,
      },
      saveDeployments: true,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      saveDeployments: true,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0 // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    feeCollector: {
      default: 1
    }
  },
  mocha: {
    timeout: 20000
  }
};
