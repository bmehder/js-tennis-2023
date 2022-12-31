<script lang="ts">
  import type { Match } from '$lib/types'
  import { fly } from 'svelte/transition'
  import { isDuplicates } from '$lib/helpers'
  import { createNewMatch } from '$lib/models/matches'

  import Players from '$lib/Match/Players.svelte'
  import Set from '$lib/Match/Set.svelte'
  import Game from '$lib/Match/Game.svelte'
  import Buttons from '$lib/Match/Buttons.svelte'
  import Winner from '$lib/Match/Winner.svelte'

  let match: Match = createNewMatch()

  const resetGameScore = () => {
    match.score.game = [0, 0]
  }

  const updateMatch = () => {
    isDuplicates(match.score.setWinners) && (match.isInProgress = false)
  }

  const updateSet = (ptWinner: 0 | 1) => {
    const [player1Score, player2Score]: number[] = match.score.sets[match.currentSet]

    const isTiebreak = () => [player1Score, player2Score].every(score => score === 6)

    const increaseCurrentSet = () => {
      match.currentSet === 'set2' && (match.currentSet = 'set3')
      match.currentSet === 'set1' && (match.currentSet = 'set2')
    }

    const updateSetWinners = () => {
      match.score.setWinners = [...match.score.setWinners, match.players[ptWinner]]
    }

    const isSetOver = () =>
      (player1Score === 6 && player2Score < 5) ||
      (player2Score === 6 && player1Score < 5) ||
      player1Score === 7 ||
      player2Score === 7

    isTiebreak() && (match.score.isTiebreak = true)

    if (isSetOver()) {
      updateSetWinners()
      increaseCurrentSet()
      resetGameScore()
    }
  }

  const updateGame = (ptWinner: 0 | 1) => {
    const increaseWinnersSetScore = (ptWinner: 0 | 1) => {
      match.score.sets[match.currentSet][ptWinner] += 1
    }
    const updateTiebreak = (ptWinner: 0 | 1) => {
      match.score.game[ptWinner] = +match.score.game.at(ptWinner)! + 1

      const [player1Score, player2Score] = match.score.game

      const isTiebreakOver =
        (player1Score >= 7 && player2Score < +player1Score - 1) ||
        (player2Score >= 7 && player1Score < +player2Score - 1)

      if (isTiebreakOver) {
        const tiebreakScore = match.score.tiebreaks[match.currentSet]

        tiebreakScore[ptWinner] = +match.score.game.at(ptWinner)!

        increaseWinnersSetScore(ptWinner)
        resetGameScore()
        match.score.isTiebreak = false
      }
    }

    if (match.score.isTiebreak) return updateTiebreak(ptWinner)

    const playerWonPoint = match.players.at(ptWinner)
    const playerAtAdvantage =
      match.players[match.score.game.findIndex(item => String(item) === 'Ad')]

    const isAdPlayerWonPoint = () => playerAtAdvantage === playerWonPoint
    const isDuece = () => match.score.game.every(point => point === 40)

    if (playerAtAdvantage && isAdPlayerWonPoint()) {
      increaseWinnersSetScore(ptWinner)
      resetGameScore()
      return
    }

    if (playerAtAdvantage && !isAdPlayerWonPoint()) {
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

  const handlePoint = (ptWinner: 0 | 1) => {
    updateGame(ptWinner)
    updateSet(ptWinner)
    updateMatch()
  }
</script>

<main>
  <Players
    players={match.players}
    score={match.score}
    isInProgress={match.isInProgress}
  />

  {#each Object.values(match.score.sets) as set, index}
    {@const tiebreak = Object.values(match.score.tiebreaks)}
    {@const setWinner = match.score.setWinners[index]}
    <Set
      {set}
      tiebreak={tiebreak[index]}
      setNumber={index}
      players={match.players}
      {setWinner}
    />
  {/each}

  <Game
    points={match.score.game}
    isTiebreak={match.score.isTiebreak}
    isInProgress={match.isInProgress}
  />
</main>

{#if match.isInProgress}
  <div in:fly={{ x: -1000, delay: 400 }} out:fly={{ x: -1000, duration: 300 }}>
    <Buttons
      isInProgress={match.isInProgress}
      on:point={event => handlePoint(event.detail)}
    />
  </div>
{/if}

{#if !match.isInProgress}
  {@const winner = match.score.setWinners.at(-1)}
  <div in:fly={{ x: 1000, delay: 400 }} out:fly={{ x: 1000, duration: 300 }}>
    {#if winner}
      <Winner
        on:click={() => (match = createNewMatch())}
        on:keypress={evt => evt.key === 'Enter' && (match = createNewMatch())}
        {winner}
      />
    {/if}
  </div>
{/if}
