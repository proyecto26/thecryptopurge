export const ETH = {
  ACCOUNTS: 'eth_accounts',
  CHAIN_ID: 'eth_chainId',
  REQ_ACCOUNTS: 'eth_requestAccounts',
  CHAIN_CHANGED: 'chainChanged',
  ACCOUNTS_CHANGED: 'accountsChanged',
}
export const CHAIN_IDS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42
}
export const CHAIN_NETWORKS = {
  [CHAIN_IDS.MAINNET]: 'mainnet',
  [CHAIN_IDS.ROPSTEN]: 'ropsten',
  [CHAIN_IDS.RINKEBY]: 'rinkeby',
  [CHAIN_IDS.GOERLI]: 'goerli',
  [CHAIN_IDS.KOVAN]: 'kovan'
}
export const CUSTOM_ERRORS = {
  NO_METAMASK: 'No Metamask detected, please install',
  MULTIPLE_WALLETS: 'Metamask installed, but multiple wallets have been detected',
  NO_CONNECTED: 'Please connect to MetaMask.',
  UNSUPPORTED_NETWORK: 'Unsupported network',
  LUCKY_FAILED: 'Good luck for next time! Try again later.',
}

export const SUPPORTED_CHAIN_ID = CHAIN_IDS.RINKEBY
// ⛽️ Setting gas limit
export const GAS_LIMIT = 300000

/**
 * Holds the contract addresses after deploy!
 */
export const CONTRACTS = {
  PORTAL: '0x04517F6Ac6a4D245742E27a5a0A87547260a2455'
}