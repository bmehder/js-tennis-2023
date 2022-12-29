export type Match = {
  players: string[]
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
    setWinners: string[]
    game: Array<string | number>
    isTiebreak: boolean
  }
  currentSet: string
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
