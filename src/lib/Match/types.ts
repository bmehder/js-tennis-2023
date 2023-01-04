export type Match = {
  players: readonly ['Player 1', 'Player 2']
  score: {
    sets: {
      set1: [number, number]
      set2: [number, number]
      set3: [number, number]
    }
    tiebreaks: {
      set1: [number, number]
      set2: [number, number]
      set3: [number, number]
    }
    setWinners: ('Player 1' | 'Player 2')[]
    game: (number | 'Ad')[]
    isTiebreak: boolean
  }
  currentSet: 'set1' | 'set2' | 'set3'
  isInProgress: boolean
}
