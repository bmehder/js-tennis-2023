<script lang="ts">
  import { sum, isDuplicates } from '$lib/helpers'
  import Reload from '$lib/Reload.svelte'

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
      game: Array<string | number>
      isTiebreak: boolean
    }
    currentSet: string
    isInProgress: boolean
  }

  const match: Match = {
    players: ['Federer / Nadal', 'Tiafoe / Sock'],
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
    match.players = ['Federer / Nadal', 'Tiafoe / Sock']
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

  const updateSet = (ptWinner: number) => {
    const [player1Score, player2Score]: number[] = match.score.sets[match.currentSet]

    const isTiebreak = () => player1Score === 6 && player2Score === 6

    isTiebreak() && (match.score.isTiebreak = true)

    const startNextSet = () => {
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
      startNextSet()
    }
  }

  const updateTiebreak = (ptWinner: number) => {
    match.score.game[ptWinner] = +match.score.game[ptWinner] + 1

    const [player1TiebreakScore, player2TiebreakScore] = match.score.game

    const isTiebreakOver =
      (player1TiebreakScore >= 7 &&
        player2TiebreakScore < +player1TiebreakScore - 1) ||
      (player2TiebreakScore >= 7 && player1TiebreakScore < +player2TiebreakScore - 1)

    if (isTiebreakOver) {
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

<h1>TS Tennis 2023</h1>
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

<div class="button-group">
  <button
    class:matchOver={!match.isInProgress}
    disabled={!match.isInProgress}
    on:click={() => handleClick(0)}>Player 1</button
  >
  <button
    class:matchOver={!match.isInProgress}
    disabled={!match.isInProgress}
    on:click={() => handleClick(1)}>Player 2</button
  >
</div>

{#if !match.isInProgress}
  <div class="reload">
    <h2>Game Set Match:<br />{match.score.setWinners.at(-1)}</h2>
    <Reload on:click={createNewMatch} />
  </div>
{/if}

{#if match.score.isTiebreak}
  <h2>Tiebreak</h2>
{/if}

<style>
  h1,
  h2 {
    text-align: center;
    color: var(--dark);
    margin-bottom: 0;
  }
  .score {
    max-width: 600px;
    display: grid;
    grid-auto-flow: column;
    margin-block: 1.5rem;
    margin-inline: auto;
    background-color: white;
  }
  .score > div > div {
    padding: 1rem;
    text-align: center;
  }
  .score > div > div:nth-child(3) {
    border-top: 1px solid var(--dark);
  }
  .score > div > div:first-child {
    padding: 1rem;
    background-color: var(--dark);
    color: white;
  }
  .score > div {
    border-right: 1px solid var(--dark);
  }
  .score > div:last-child {
    border-right: none;
  }
  .score > div:last-child > div {
    font-weight: bold;
  }
  .isServing {
    font-weight: bold;
  }
  .button-group {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }
  button {
    padding: 1rem 2rem;
    background-color: var(--dark);
    color: white;
    font-size: inherit;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: scale 100ms ease-in-out;
  }
  button:hover:not([disabled]) {
    scale: 0.98;
  }
  button.matchOver {
    cursor: not-allowed;
    opacity: 50%;
  }
</style>
