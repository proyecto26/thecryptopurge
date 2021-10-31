import React, { useCallback } from 'react'
import { withRouter } from 'react-router-dom'

import { CHAIN_NETWORKS, SUPPORTED_CHAIN_ID } from '../constants'
import { useMetamask } from '../hooks/useMetamask'
import { usePortalContract } from '../hooks/usePortalContract'
import './Home.css'

export default withRouter(({ history }) => {
  const { error, connect, currentAccount, isConnected } = useMetamask()
  const { likes, loading, handleOnClick } = usePortalContract()
  const onConnectPress = useCallback(async () => {
    if (!isConnected) {
      await connect()
    }
  }, [connect, isConnected])

  return (
    <section className="container mx-auto min-h-screen flex flex-col">
      <div className="min-h-screen flex flex-col justify-center">
        <div className="header">
        👋 Hey there! <br/>
        Welcome to <span className="text-red-500">The Crypto Purge</span> game! 💸
        <br/>
        Total likes: {likes}
        {loading ? (
          <button disabled className="disabled:opacity-50 mx-5 bg-blue-500 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
            <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        ) : (
          <button disabled={!!error} onClick={handleOnClick} className="disabled:opacity-50 mx-5 bg-blue-500 p-2 font-semibold text-white inline-flex items-center space-x-2 rounded">
            <svg className="h-8 w-8 text-white"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </button>
        )}
        </div>

        <div className="bio">
          {currentAccount ? (
            <p>
              Wallet Connected: <b>{currentAccount}</b>
            </p>
          ) : (
            <p>Connect your Ethereum wallet and give us a like!</p>
          )}
        </div>
        {error && (
          <div role="alert" className="m-10">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
              Error
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <p>{error.message}</p>
              <p>Remember to use the {CHAIN_NETWORKS[SUPPORTED_CHAIN_ID]} network :)</p>
            </div>
          </div>
        )}
        {isConnected ? (
          <button disabled={!!error} onClick={() => history.push('/game')} className="disabled:opacity-50 bg-green-500 hover:bg-green-700 text-white font-bold mt-6 py-2 px-4 rounded max-w-xs mx-auto">
            Play
          </button>
        ) : (
          <button onClick={onConnectPress} className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-6 py-2 px-4 rounded max-w-xs mx-auto">
            Connect
          </button>
        )}
      </div>
    </section>
  )
})
