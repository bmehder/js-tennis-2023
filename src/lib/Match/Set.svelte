<script lang="ts">
  export let set: number[]
  export let tiebreak: number[]
  export let setNumber: number
  export let setWinner: 'Player 1' | 'Player 2'
  export let players: ['Player 1', 'Player 2']
</script>

<div>
  <div>Set {setNumber}</div>
  {#each set as playerScore, player}
    <div class:isWinner={setWinner === players[player]}>
      {playerScore}
      {#if tiebreak.some(pt => pt > 0) && setWinner !== players[player]}
        <sup>{tiebreak[player]}</sup>
      {/if}
    </div>
  {/each}
</div>

<style>
  .isWinner {
    font-weight: bold;
  }
</style>
