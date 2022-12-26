<script lang="ts">
  import { sum, isDuplicates } from '$lib/helpers'

  type Match = {
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
      game: number[]
      isTiebreak: boolean
    }
    currentSet: string
  }

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
  }

  const getMatchWinner = () => {
    isDuplicates(match.score.setWinners) && alert(match.score.setWinners.at(-1))
  }

  const updateSet = (ptWinner: number) => {
    const [player1Score, player2Score] = match.score.sets[match.currentSet]
    const isTiebreak = () => player1Score === 6 && player2Score === 6

    const startNextSet = () => {
      match.currentSet === 'set2' && (match.currentSet = 'set3')
      match.currentSet === 'set1' && (match.currentSet = 'set2')
    }

    if (
      (player1Score === 6 && player2Score < 5) ||
      (player2Score === 6 && player1Score < 5) ||
      player1Score === 7 ||
      player2Score === 7
    ) {
      match.score.setWinners = [...match.score.setWinners, match.players[ptWinner]]
      startNextSet()
    }

    if (isTiebreak()) {
      match.score.isTiebreak = true
    }
  }

  const updateTiebreak = (ptWinner: number) => {
    match.score.game[ptWinner] += 1
    const [player1TiebreakScore, player2TiebreakScore] = match.score.game

    if (
      (player1TiebreakScore >= 7 &&
        player2TiebreakScore < player1TiebreakScore - 1) ||
      (player2TiebreakScore >= 7 && player1TiebreakScore < player2TiebreakScore - 1)
    ) {
      match.score.tiebreaks[match.currentSet][ptWinner] = match.score.game[ptWinner]
      match.score.sets[match.currentSet][ptWinner] += 1
      match.score.game[0] = 0
      match.score.game[1] = 0

      match.score.isTiebreak = false
    }
  }

  const updateScore = (ptWinner: number) => {
    if (match.score.isTiebreak) return updateTiebreak(ptWinner)
    const gameScore = match.score.game
    const playerWonPoint = match.players[ptWinner]
    const playerAtAdvantage =
      match.players[match.score.game.findIndex(item => String(item) === 'Ad')]

    const isAdPlayerWonPoint = playerAtAdvantage === playerWonPoint
    const isDuece = () => gameScore.every(point => point === 40)

    const resetGameScore = () => {
      match.score.game[0] = 0
      match.score.game[1] = 0
    }

    if (isAdPlayerWonPoint) {
      match.score.sets[match.currentSet][ptWinner] += 1
      resetGameScore()
      return
    }

    if (playerAtAdvantage && !isAdPlayerWonPoint) {
      match.score.game[0] = 40
      match.score.game[1] = 40
      return
    }

    if (isDuece()) {
      match.score.game[ptWinner] = 'Ad'
      return
    }

    if (match.score.game[ptWinner] === 0) {
      match.score.game[ptWinner] = 15
      return
    }

    if (match.score.game[ptWinner] === 15) {
      match.score.game[ptWinner] = 30
      return
    }

    if (match.score.game[ptWinner] === 30) {
      match.score.game[ptWinner] = 40
      return
    }

    if (!isDuece()) {
      match.score.sets[match.currentSet][ptWinner] += 1
      resetGameScore()
    }
  }

  $: playerServing =
    Object.values(match.score.sets)
      .map(item => item.reduce(sum))
      .reduce(sum) %
      2 !==
    0
      ? match.players[1]
      : match.players[0]

  const handleClick = (ptWinner: number) => {
    updateScore(ptWinner)
    updateSet(ptWinner)
    getMatchWinner()
  }
</script>

<h1>JS Tennis 2023</h1>
<div class="score">
  <div>
    <div>Player</div>
    {#each match.players as player, index}
      <div
        class:isServing={playerServing === match.players[index] &&
          !match.score.isTiebreak}
      >
        {player}
      </div>
    {/each}
  </div>
  <div>
    <div>Set 1</div>
    {#each match.score.sets.set1 as set1}
      <div>{set1}</div>
    {/each}
  </div>
  <div>
    <div>Set 2</div>
    {#each match.score.sets.set2 as set2}
      <div>{set2}</div>
    {/each}
  </div>
  <div>
    <div>Set 3</div>
    {#each match.score.sets.set3 as set3}
      <div>{set3}</div>
    {/each}
  </div>
  <div>
    <div>Pt</div>
    {#each match.score.game as game}
      <div>{game}</div>
    {/each}
  </div>
</div>

<div class="buttons">
  <button on:click={() => handleClick(0)}>Player 1</button>
  <button on:click={() => handleClick(1)}>Player 2</button>
</div>

<style>
  h1 {
    text-align: center;
  }
  .score {
    display: grid;
    grid-auto-flow: column;
    margin: 1.5rem;
    border: 1px solid #323232;
  }
  .score > div > div {
    padding: 1rem;
    text-align: center;
  }
  .score > div > div:nth-child(3) {
    background-color: #f1f1f1;
  }
  .score > div > div:first-child {
    padding: 1rem;
    background-color: #323232;
    color: white;
  }
  .isServing {
    font-weight: bold;
  }
  .buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }
  button {
    padding: 1rem 2rem;
  }
</style>
