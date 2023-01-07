<script lang="ts">
  import { fly } from 'svelte/transition'
  import { quartInOut } from 'svelte/easing'
  import { isDuplicates } from '$lib/helpers'
  import createNewMatch from '$lib/Match/createNewMatch'

  import Players from '$lib/Match/Players.svelte'
  import Game from '$lib/Match/Game.svelte'
  import Buttons from '$lib/Match/Buttons.svelte'
  import Winner from '$lib/Match/Winner.svelte'
  import Sets from './Sets.svelte'

  let match = createNewMatch()

  const updateMatch = () => {
    isDuplicates(match.score.setWinners) && (match.isInProgress = false)
  }

  const updateSet = (ptWinner: 0 | 1) => {
    const [player1Score, player2Score]: [number, number] =
      match.score.sets[match.currentSet]

    const isTiebreak = () => [player1Score, player2Score].every(score => score === 6)

    const updateCurrentSet = () => {
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
      updateCurrentSet()
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

    const updateGameToDuece = () => {
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
      match.players[match.score.game.findIndex(item => item === 'Ad')]

    const isPlayerAtAdvantageWonPoint = () => playerAtAdvantage === playerWhoWonPoint
    const isDuece = () => match.score.game.every(point => point === 40)

    if (isPlayerAtAdvantageWonPoint()) {
      increaseWinnersSetScore(ptWinner)
      resetGameScore()
      return
    }

    if (playerAtAdvantage && !isPlayerAtAdvantageWonPoint()) {
      updateGameToDuece()
      return
    }

    if (isDuece()) {
      match.score.game[ptWinner] = 'Ad'
      return
    }

    enum Point {
      ZERO = 0,
      FIFTEEN = 15,
      THIRTY = 30,
      FORTY = 40,
    }

    switch (match.score.game[ptWinner]) {
      case Point.ZERO:
        match.score.game[ptWinner] = Point.FIFTEEN
        break
      case Point.FIFTEEN:
        match.score.game[ptWinner] = Point.THIRTY
        break
      case Point.THIRTY:
        match.score.game[ptWinner] = Point.FORTY
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

  const handleButtonKeypress = (event: KeyboardEvent) => {
    event.key === ',' && handlePoint(0)
    event.key === '.' && handlePoint(1)
  }

  const handleStartNewMatch = (event: KeyboardEvent | MouseEvent) => {
    if (event instanceof KeyboardEvent) {
      event.key === 'Enter' && (match = createNewMatch())
      return
    }
    match = createNewMatch()
  }
</script>

<main>
  <Players {match} />

  <Sets score={match.score} />

  <Game score={match.score} isInProgress={match.isInProgress} />
</main>

{#if match.isInProgress}
  {@const inTransition = { x: -1000, delay: 400 }}
  {@const outTransition = { x: -1000, duration: 300, easing: quartInOut }}
  <div in:fly={inTransition} out:fly={outTransition}>
    <Buttons
      on:point={event => handlePoint(event.detail)}
      on:keypress={handleButtonKeypress}
    />
  </div>
{:else}
  {@const winner = match.score.setWinners.at(-1)}
  {@const inTransition = { x: 1000, delay: 400, easing: quartInOut }}
  {@const outTransition = { y: 1000, duration: 300 }}
  <div in:fly={inTransition} out:fly={outTransition}>
    {#if winner}
      <Winner {winner} on:click={handleStartNewMatch} on:keypress={handleStartNewMatch} />
    {/if}
  </div>
{/if}
