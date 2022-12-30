export type Match = {
  players: ['Player 1', 'Player 2']
  score: {
    sets: {
      set1: number[]
      set2: number[]
      set3: number[]
    }
    tiebreaks: {
      set1: number[]
      set2: number[]
      set3: number[]
    }
    setWinners: ('Player 1' | 'Player 2')[]
    game: (number | 'Ad')[]
    isTiebreak: boolean
  }
  currentSet: 'set1' | 'set2' | 'set3'
  isInProgress: boolean
}

export type Score = {
  sets: {
    set1: number[]
    set2: number[]
    set3: number[]
  }
  isTiebreak: boolean
}
