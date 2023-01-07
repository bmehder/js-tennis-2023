<script lang="ts">
  export let set: [number, number]
  export let tiebreak: [number, number]
  export let setNumber: number
  export let setWinner: 'Player 1' | 'Player 2'

  const players = ['Player 1', 'Player 2'] as const
</script>

<div>
  <div>Set {setNumber}</div>
  {#each set as playerScore, index}
    <div class:bold={setWinner === players[index]}>
      {playerScore}
      {#if tiebreak.some(pt => pt > 0) && setWinner !== players[index]}
        <sup>{tiebreak[index]}</sup>
      {/if}
    </div>
  {/each}
</div>
