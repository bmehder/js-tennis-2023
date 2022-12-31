import type { Match } from '$lib/types'

export const createNewMatch = (): Match => {
  return {
    players: ['Player 1', 'Player 2'],
    score: {
      sets: {
        set1: [0, 0],
        set2: [0, 0],
        set3: [0, 0],
      },
      tiebreaks: {
        set1: [0, 0],
        set2: [0, 0],
        set3: [0, 0],
      },
      setWinners: [],
      game: [0, 0],
      isTiebreak: false,
    },
    currentSet: 'set1',
    isInProgress: true,
  }
}
