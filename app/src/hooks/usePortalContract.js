import { useRef, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

import portalContract from '../abis/Portal.json'
import { CUSTOM_ERRORS } from '../constants'

/**
 * TODO: Remove this variable here that holds the contract address after you deploy!
 */
const contractAddress = '0x34EB1E92033F81dFe7a7A22b3b55bFd2Ea11aB1A'
const contractABI = portalContract.abi

export function usePortalContract () {
  const contractRef = useRef()
  const [error, setError] = useState()
  const [likes, setLikes] = useState(0)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const contract = contractRef.current
      const count = await contract.getTotalLikes()
      setLikes(count.toNumber())
      const messages = await contract.getAllMessages()
      if (messages) {
        setMessages(messages.map(m => ({
          from: m.user.toLowerCase(),
          message: m.message,
          timestamp: new Date(m.timestamp * 1000),
        })))
      }
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
    const contract = new ethers.Contract(contractAddress, contractABI, signer)
    contractRef.current = contract
    loadData().finally(() => setLoading(false))
  }, [loadData])

  const onLike = useCallback(async () => {
    setLoading(true)
    try {
      const contract = contractRef.current
      const tx = await contract.like()
      await tx.wait()
      await loadData()
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [loadData])

  const onSendMessage = useCallback(async (message) => {
    setLoading(true)
    try {
      const contract = contractRef.current
      const tx = await contract.sendMessage(message)
      await tx.wait()
      await loadData()
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [loadData])

  return {
    error,
    likes,
    loading,
    messages,
    onLike,
    onSendMessage,
  }
}