<script lang="ts">
  import type { Match } from '$lib/types'
  import { sum, isDuplicates } from '$lib/helpers'
  import Players from './Players.svelte'
  import Set from './Set.svelte'
  import Points from './Points.svelte'
  import Buttons from './Buttons.svelte'
  import Reload from '$lib/Reload.svelte'

  const match: Match = {
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

  const createNewMatch = () => {
    match.players = ['Player 1', 'Player 2']
    match.score = {
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
    }
    match.currentSet = 'set1'
    match.isInProgress = true
  }

  const getMatchWinner = () => {
    isDuplicates(match.score.setWinners) && (match.isInProgress = false)
  }

  const resetGameScore = () => (match.score.game = [0, 0])

  const increaseWinnersSetScore = (ptWinner: number) => {
    match.score.sets[match.currentSet as keyof typeof match.score.sets][ptWinner] += 1
    resetGameScore()
  }

  const updateSet = (ptWinner: number) => {
    const [player1Score, player2Score]: number[] =
      match.score.sets[match.currentSet as keyof typeof match.score.sets]

    const isTiebreak = () => [player1Score, player2Score].every(score => score === 6)

    isTiebreak() && (match.score.isTiebreak = true)

    const increaseCurrentSet = () => {
      match.currentSet === 'set2' && (match.currentSet = 'set3')
      match.currentSet === 'set1' && (match.currentSet = 'set2')
    }

    const isSetOver = () =>
      (player1Score === 6 && player2Score < 5) ||
      (player2Score === 6 && player1Score < 5) ||
      player1Score === 7 ||
      player2Score === 7

    if (isSetOver()) {
      match.score.setWinners = [...match.score.setWinners, match.players[ptWinner]]
      increaseCurrentSet()
    }
  }

  const updateTiebreak = (ptWinner: number) => {
    match.score.game[ptWinner] = +match.score.game[ptWinner] + 1

    const [player1Score, player2Score] = match.score.game

    const isTiebreakOver =
      (player1Score >= 7 && player2Score < +player1Score - 1) ||
      (player2Score >= 7 && player1Score < +player2Score - 1)

    if (isTiebreakOver) {
      const tiebreakScore =
        match.score.tiebreaks[match.currentSet as keyof typeof match.score.tiebreaks]

      tiebreakScore[ptWinner] = +match.score.game[ptWinner]

      increaseWinnersSetScore(ptWinner)
      match.score.isTiebreak = false
    }
  }

  const updateGame = (ptWinner: number) => {
    if (match.score.isTiebreak) return updateTiebreak(ptWinner)

    const playerWonPoint = match.players[ptWinner] as 'Player 1' | 'Player 2'
    const playerAtAdvantage = match.players[
      match.score.game.findIndex(item => String(item) === 'Ad')
    ] as 'Player 1' | 'Player 2' | undefined

    const isAdPlayerWonPoint = playerAtAdvantage === playerWonPoint
    const isDuece = () => match.score.game.every(point => point === 40)

    if (playerAtAdvantage && isAdPlayerWonPoint) {
      increaseWinnersSetScore(ptWinner)
      resetGameScore()
      return
    }

    if (playerAtAdvantage && !isAdPlayerWonPoint) {
      match.score.game = [40, 40]
      return
    }

    if (isDuece()) {
      match.score.game[ptWinner] = 'Ad'
      return
    }

    switch (match.score.game[ptWinner]) {
      case 0:
        match.score.game[ptWinner] = 15
        break
      case 15:
        match.score.game[ptWinner] = 30
        break
      case 30:
        match.score.game[ptWinner] = 40
        break
      default:
        increaseWinnersSetScore(ptWinner)
        resetGameScore()
    }
  }

  const handleWinPoint = (ptWinner: number) => {
    updateGame(ptWinner)
    updateSet(ptWinner)
    getMatchWinner()
  }

  $: playerServing =
    Object.values(match.score.sets)
      .map(item => item.reduce(sum))
      .reduce(sum) %
      2 ===
    0
      ? match.players[0]
      : match.players[1]
</script>

<main>
  <Players players={match.players} isTiebreak={match.score.isTiebreak} {playerServing} />

  {#each Object.values(match.score.sets) as set, index}
    {@const tiebreak = Object.values(match.score.tiebreaks)}
    <Set {set} tiebreak={tiebreak[index]} />
  {/each}

  <Points game={match.score.game} />
</main>

<Buttons
  isInProgress={match.isInProgress}
  on:winpoint={event => handleWinPoint(event.detail)}
/>

{#if !match.isInProgress}
  {@const winner = match.score.setWinners.at(-1)}
  <div>
    <Reload on:click={createNewMatch} {winner} />
  </div>
{/if}

{#if match.score.isTiebreak}
  <h2>Tiebreak</h2>
{/if}
