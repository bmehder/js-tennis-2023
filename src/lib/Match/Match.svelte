<script lang="ts">
  import type { Match } from '$lib/Match/types'
  import { fly } from 'svelte/transition'
  import { isDuplicates } from '$lib/helpers'
  import { createNewMatch } from '$lib/Match/createNewMatch'

  import Players from '$lib/Match/Players.svelte'
  import Set from '$lib/Match/Set.svelte'
  import Game from '$lib/Match/Game.svelte'
  import Buttons from '$lib/Match/Buttons.svelte'
  import Winner from '$lib/Match/Winner.svelte'

  let match: Match = createNewMatch()

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
      increaseCurrentSet()
      updateSetWinners()
    }
  }

  const updateGame = (ptWinner: 0 | 1) => {
    const increaseWinnersSetScore = (ptWinner: 0 | 1) => {
      match.score.sets[match.currentSet][ptWinner] += 1
    }

    const resetGameScore = () => {
      match.score.game = [0, 0]
    }

    const updateGameScoreToDuece = () => {
      match.score.game = [40, 40]
    }

    const updateTiebreak = (ptWinner: 0 | 1) => {
      match.score.game[ptWinner] = +match.score.game.at(ptWinner)! + 1

      const isTiebreakOver = () => {
        const [player1Score, player2Score] = match.score.game

        return (
          (player1Score >= 7 && player2Score < +player1Score - 1) ||
          (player2Score >= 7 && player1Score < +player2Score - 1)
        )
      }

      if (isTiebreakOver()) {
        const ptLoser = ptWinner === 0 ? 1 : 0
        const tiebreakScoreCurrentSet = match.score.tiebreaks[match.currentSet]

        tiebreakScoreCurrentSet[ptWinner] = +match.score.game.at(ptWinner)!

        tiebreakScoreCurrentSet[ptLoser] = +match.score.game.at(ptLoser)!

        increaseWinnersSetScore(ptWinner)
        resetGameScore()
        match.score.isTiebreak = false
      }
    }

    if (match.score.isTiebreak) return updateTiebreak(ptWinner)

    const playerWhoWonPoint = match.players.at(ptWinner)!
    const playerAtAdvantage =
      match.players[match.score.game.findIndex(item => String(item) === 'Ad')]

    const isPlayerAtAdvantagePlayerWonPoint = () =>
      playerAtAdvantage === playerWhoWonPoint
    const isDuece = () => match.score.game.every(point => point === 40)

    if (isPlayerAtAdvantagePlayerWonPoint()) {
      increaseWinnersSetScore(ptWinner)
      resetGameScore()
      return
    }

    if (playerAtAdvantage && !isPlayerAtAdvantagePlayerWonPoint()) {
      updateGameScoreToDuece()
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
  <Players {match} />

  {#each Object.values(match.score.sets) as set, index}
    {@const tiebreak = Object.values(match.score.tiebreaks)}
    {@const setWinner = match.score.setWinners[index]}
    <Set
      {set}
      tiebreak={tiebreak[index]}
      setNumber={index + 1}
      players={match.players}
      {setWinner}
    />
  {/each}

  <Game {match} />
</main>

{#if match.isInProgress}
  {@const inTransition = { x: -1000, delay: 400 }}
  {@const outTransition = { x: -1000, duration: 300 }}
  <div in:fly={inTransition} out:fly={outTransition}>
    <Buttons on:point={event => handlePoint(event.detail)} />
  </div>
{:else}
  {@const winner = match.score.setWinners.at(-1) ?? 'Player 1'}
  {@const inTransition = { x: 1000, delay: 400 }}
  {@const outTransition = { y: 1000, duration: 300 }}
  <div in:fly={inTransition} out:fly={outTransition}>
    <Winner
      on:click={() => (match = createNewMatch())}
      on:keypress={evt => evt.key === 'Enter' && (match = createNewMatch())}
      {winner}
    />
  </div>
{/if}
