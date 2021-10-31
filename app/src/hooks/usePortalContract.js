import { useRef, useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

import portalContract from '../abis/Portal.json'
import { CUSTOM_ERRORS } from '../constants'

/**
 * TODO: Remove this variable here that holds the contract address after you deploy!
 */
const contractAddress = '0x0dd220E5ec89e9B05CB3D52Eb4181d81e6714ddb'
const contractABI = portalContract.abi

export function usePortalContract () {
  const contractRef = useRef()
  const [error, setError] = useState()
  const [likes, setLikes] = useState(0)
  const [loading, setLoading] = useState(false)

  const loadLikes = useCallback(async () => {
    try {
      const contract = contractRef.current
      const count = await contract.getTotalLikes()
      setLikes(count.toNumber())
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
    loadLikes().finally(() => setLoading(false))
  }, [loadLikes])

  const handleOnClick = useCallback(async () => {
    setLoading(true)
    try {
      const contract = contractRef.current
      const tx = await contract.like()
      await tx.wait()
      await loadLikes()
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [loadLikes])

  return {
    error,
    likes,
    loading,
    handleOnClick,
  }
}