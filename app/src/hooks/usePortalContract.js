import { useRef, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

import portalContract from '../abis/Portal.json'
import { CUSTOM_ERRORS, CONTRACTS, GAS_LIMIT } from '../constants'

const contractABI = portalContract.abi

export const formatMessage = ({ user, message, timestamp }) => ({
  from: user.toLowerCase(),
  message: message,
  timestamp: new Date(timestamp * 1000),
});

export function usePortalContract () {
  const contractRef = useRef()
  const [error, setError] = useState()
  const [likes, setLikes] = useState(0)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const setLoadingTransaction = useCallback(() => {
    setError(null)
    setLoading(true)
  }, [setError, setLoading])

  const loadData = useCallback(async () => {
    try {
      const contract = contractRef.current
      const count = await contract.getTotalLikes()
      setLikes(count.toNumber())
      const messages = await contract.getAllMessages()
      setMessages(messages.map(m => formatMessage(m)))
    } catch (err) {
      setError(err)
    }
  }, [])


  useEffect(() => {
    if (!window.ethereum) {
      return setError(new Error(CUSTOM_ERRORS.NO_METAMASK))
    }

    setLoading(true)
    // Used to actually talk to Ethereum nodes
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // https://docs.ethers.io/v5/api/signer/#signers
    const signer = provider.getSigner()
    const contract = new ethers.Contract(CONTRACTS.PORTAL, contractABI, signer)
    contractRef.current = contract

    /**
     * Listen in for emitter events!
     */
    contract.on('WinPrize', (owner, prizeAmount) => {
      console.log('WinPrize', owner, prizeAmount)
      alert(`Congratulations! You won ${ethers.utils.formatEther(prizeAmount)} ETH!`)
    })
    contract.on('NewMessage', (user, timestamp, message) => {
      setMessages(prevState => [
        ...prevState,
        formatMessage({ user, message, timestamp }),
      ]);
    })

    loadData().finally(() => setLoading(false))

    return () => {
      contract.removeAllListeners()
    }
  }, [loadData])

  const onLike = useCallback(async () => {
    setLoadingTransaction()
    try {
      const contract = contractRef.current
      const tx = await contract.like({ gasLimit: GAS_LIMIT })
      await tx.wait()
      await loadData()
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [setLoadingTransaction, setError, setLoading, loadData])

  const onSendMessage = useCallback(async (message) => {
    if (!message) {
      throw new Error('Message is required')
    }
    setLoadingTransaction(true)
    try {
      const contract = contractRef.current
      // set a limit of gas for the transaction
      const tx = await contract.sendMessage(message, { gasLimit: GAS_LIMIT })
      await tx.wait()
      await loadData()
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [setLoadingTransaction, setError, setLoading, loadData])

  const onFeelingLucky = useCallback(async () => {
    setLoadingTransaction(true)

    try {
      const contract = contractRef.current
      const tx = await contract.feelingLucky({ gasLimit: GAS_LIMIT })
      await tx.wait()
    } catch {
      setError(new Error(CUSTOM_ERRORS.LUCKY_FAILED))
    } finally {
      setLoading(false)
    }
  }, [setLoadingTransaction, setError, setLoading])

  return {
    error,
    likes,
    loading,
    messages,
    onLike,
    onSendMessage,
    onFeelingLucky
  }
}