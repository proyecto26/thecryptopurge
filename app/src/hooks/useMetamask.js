import { useState, useEffect, useCallback } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

import { CUSTOM_ERRORS, CHAIN_NETWORKS, ETH, SUPPORTED_CHAIN_ID } from '../constants'

export function useMetamask () {
  const [error, setError] = useState()
  const [isConnected, setIsConnected] = useState(() => window.ethereum?.isConnected())
  const [currentAccount, setCurrentAccount] = useState()

  const handleAccountsChanged = useCallback((accounts) => {
    let account = currentAccount
    if (!accounts.length) {
      // MetaMask is locked or the user has not connected any accounts
      setError(new Error(CUSTOM_ERRORS.NO_CONNECTED))
    } else if (accounts[0] !== currentAccount) {
      account = accounts[0]
      setCurrentAccount(accounts[0].toLowerCase())
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
      return setError(new Error(CUSTOM_ERRORS.NO_METAMASK))
    }
    /*****************************************/
    /* Detect the MetaMask Ethereum provider */
    /*****************************************/
    detectEthereumProvider().then(provider => {
      if (!provider) {
        setError(new Error(CUSTOM_ERRORS.NO_METAMASK))
      } else if (provider !== window.ethereum) {
        setError(new Error(CUSTOM_ERRORS.MULTIPLE_WALLETS))
      }
    })

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/
    const onChainChanged = (chainId) => {
      const decimal = parseInt(chainId)
      if (CHAIN_NETWORKS[decimal]) {
        console.log(`You are on the ${CHAIN_NETWORKS[decimal]} network :)`)
      }
      setError(decimal === SUPPORTED_CHAIN_ID ? null : new Error(CUSTOM_ERRORS.UNSUPPORTED_NETWORK))
    }
    window.ethereum.request({ method: ETH.CHAIN_ID }).then(onChainChanged)
    window.ethereum.on(ETH.CHAIN_CHANGED, onChainChanged)

    /***********************************************************/
    /* Handle user accounts and accountsChanged (per EIP-1193) */
    /***********************************************************/
    window.ethereum.request({ method: ETH.ACCOUNTS })
    .then(handleAccountsChanged)
    .catch((err) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      setError(err)
    })
    window.ethereum.on(ETH.ACCOUNTS_CHANGED, handleAccountsChanged)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*********************************************/
  /* Access the user's accounts (per EIP-1102) */
  /*********************************************/
  const connect = useCallback(async () => {
    return window.ethereum.request({ method: ETH.REQ_ACCOUNTS })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        setError(new Error(CUSTOM_ERRORS.NO_CONNECTED))
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