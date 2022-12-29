<script lang="ts">
  import { sum } from '$lib/helpers'
  import type { Score } from '$lib/types'

  export let players: string[]
  export let score: Score

  $: playerServing =
    Object.values(score.sets)
      .map(item => item.reduce(sum))
      .reduce(sum) %
      2 ===
    0
      ? players[0]
      : players[1]
</script>

<div>
  <div>Player</div>
  {#each players as player, index}
    {@const isServing = playerServing === players[index] && !score.isTiebreak}
    <div class:isServing>
      {player}
    </div>
  {/each}
</div>

<style>
  .isServing {
    font-weight: bold;
  }
</style>
