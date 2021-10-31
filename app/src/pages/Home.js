import React, { useCallback } from 'react'
import { withRouter } from 'react-router-dom'

import { useMetamask } from '../hooks/useMetamask'
import './Home.css'

export default withRouter(({ history }) => {
  const { error, connect, currentAccount, isConnected } = useMetamask()
  const onLikePress = useCallback(async () => {
    if (!isConnected) {
      await connect()
    }
    history.push('/game')
  }, [history, connect, isConnected])

  return (
    <section className="container mx-auto min-h-screen flex flex-col">

      <div className="min-h-screen flex flex-col justify-center">
        <div className="header">
        👋 Hey there!
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
          <div className="error">
            Error: {error.message}
          </div>
        )}
        {isConnected ? (
          <button onClick={onLikePress} className="bg-green-500 hover:bg-green-700 text-white font-bold mt-6 py-2 px-4 rounded max-w-xs mx-auto">
            Play
          </button>
        ) : (
          <button onClick={onLikePress} className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-6 py-2 px-4 rounded max-w-xs mx-auto">
            Connect
          </button>
        )}
      </div>
    </section>
  )
})
