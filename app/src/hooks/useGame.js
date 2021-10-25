import { useState, useEffect } from 'react'
import Phaser from 'phaser-ce'

export function useGame (
  config,
  containerRef
) {
  const [game, setGame] = useState()
  useEffect(() => {
    if (!game && containerRef.current) {
      const newGame = new Phaser.Game({ ...config, parent: containerRef.current })
      setGame(newGame)
    }
    return () => {
      game?.destroy()
    }
  }, [config, containerRef, game])

  return game
}
