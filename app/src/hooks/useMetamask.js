import { useState, useEffect, useCallback } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

const eth = {
  ACCOUNTS: 'eth_accounts',
  CHAIN_ID: 'eth_chainId',
  REQ_ACCOUNTS: 'eth_requestAccounts',
  CHAIN_CHANGED: 'chainChanged',
  ACCOUNTS_CHANGED: 'accountsChanged',
}
const chainIDs = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42
}
const chainNetworks = {
  [chainIDs.MAINNET]: 'mainnet',
  [chainIDs.ROPSTEN]: 'ropsten',
  [chainIDs.RINKEBY]: 'rinkeby',
  [chainIDs.GOERLI]: 'goerli',
  [chainIDs.KOVAN]: 'kovan'
}
const customErrors = {
  NO_METAMASK: 'No Metamask detected, please install',
  MULTIPLE_WALLETS: 'Metamask installed, but multiple wallets have been detected',
  NO_CONNECTED: 'Please connect to MetaMask.'
}

export function useMetamask () {
  const [error, setError] = useState()
  const [isConnected, setIsConnected] = useState(() => window.ethereum?.isConnected())
  const [currentAccount, setCurrentAccount] = useState()

  const handleChainChanged = useCallback(() => {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }, [])

  const handleAccountsChanged = useCallback((accounts) => {
    let account = currentAccount
    if (!accounts.length) {
      // MetaMask is locked or the user has not connected any accounts
      setError(new Error(customErrors.NO_CONNECTED))
    } else if (accounts[0] !== currentAccount) {
      account = accounts[0]
      setCurrentAccount(accounts[0])
    }
    return account
  }, [currentAccount])

  useEffect(() => {
    if (window.ethereum) {
      setIsConnected(window.ethereum.isConnected())
    }
  }, [currentAccount])

  useEffect(() => {
    if (!window.ethereum) {
      setError(new Error(customErrors.NO_METAMASK))
    }
    /*****************************************/
    /* Detect the MetaMask Ethereum provider */
    /*****************************************/
    detectEthereumProvider().then(provider => {
      if (!provider) {
        setError(new Error(customErrors.NO_METAMASK))
      } else if (provider !== window.ethereum) {
        setError(new Error(customErrors.MULTIPLE_WALLETS))
      }
    })

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/
    window.ethereum.request({ method: eth.CHAIN_ID }).then(chainId => {
      if (chainNetworks[chainId]) {
        alert(`You are on the ${chainNetworks[chainId]} network`)
        handleChainChanged(chainId)
      }
    })
    window.ethereum.on(eth.CHAIN_CHANGED, handleChainChanged)

    /***********************************************************/
    /* Handle user accounts and accountsChanged (per EIP-1193) */
    /***********************************************************/
    window.ethereum.request({ method: eth.ACCOUNTS })
    .then(handleAccountsChanged)
    .catch((err) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      setError(err)
    })
    window.ethereum.on(eth.ACCOUNTS_CHANGED, handleAccountsChanged)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*********************************************/
  /* Access the user's accounts (per EIP-1102) */
  /*********************************************/
  const connect = useCallback(async () => {
    return window.ethereum.request({ method: eth.REQ_ACCOUNTS })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        setError(new Error(customErrors.NO_CONNECTED))
      } else {
        setError(err)
      }
    });
  }, [handleAccountsChanged])

  return {
    error,
    connect,
    isConnected,
    currentAccount
  }
}