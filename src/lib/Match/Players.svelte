<script lang="ts">
  import { sum } from '$lib/helpers'
  import type { Score } from '$lib/types'

  export let players: ['Player 1', 'Player 2']
  export let score: Score
  export let isInProgress: boolean

  // prettier-ignore
  $: playerServing =
    Object.values(score.sets)
      .map(item => item.reduce(sum))
      .reduce(sum) % 2 === 0 ? players[0] : players[1]
</script>

<div>
  <div>Player</div>
  {#each players as player, index}
    {@const isServing =
      playerServing === players[index] && !score.isTiebreak && isInProgress}
    <div class:isServing data-player={index + 1} contenteditable>
      {player}
    </div>
  {/each}
</div>

<style>
  .isServing {
    font-weight: bold;
  }
</style>
